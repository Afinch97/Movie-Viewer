from flask import Flask, Blueprint, render_template, redirect, url_for, request, flash, jsonify
from flask_login import UserMixin, LoginManager, login_user, login_required, current_user, logout_user
from sqlalchemy import over, table, select
from tmdb import  get_trending,get_genres, movie_search, movie_info, get_favorites
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import over, table, select, update
from dotenv import find_dotenv, load_dotenv
from flask_sqlalchemy import SQLAlchemy
from multiprocessing import synchronize
import requests
import MediaWiki
import sqlalchemy
import os
import re

load_dotenv(find_dotenv())

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'secret-key-goes-here'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config["SQLALCHEMY_DATABASE_URI"].replace("postgres://", "postgresql://") 
db = SQLAlchemy(app, session_options={"autocommit": True})
db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    
class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer)
    rating = db.Column(db.Integer)
    user = db.Column(db.String(1000))
    text = db.Column(db.String(1000))

class Favorites(db.Model):
    __tablename__ = 'Favorites'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    movie = db.Column(db.Integer)
    
    def __repr__(self) :
        return repr(self.movie)
    
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login')
def login():
    return render_template('home.html')

@app.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('name')
    name = request.form.get('name')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False
    
    user = User.query.filter_by(name=name).first()
    if not user:
        user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        flash('Username or Password Incorrect')
        return redirect(url_for('login'))
    login_user(user, remember=remember)
    return redirect(url_for('search'))

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user:
        flash('Email address already exists')
        return redirect(url_for('signup'))
    
    new_user = User(email=email, name=name, password=generate_password_hash(password, method='sha256'))
    db.session.begin()
    db.session.add(new_user)
    db.session.commit()
    
    return redirect(url_for('login'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, id=current_user.id)

@app.route('/favorites', methods=["POST","GET"])
@login_required
def favorites():
    #fav_movies = Favorites.query.filter(Favorites.email.like("%"+current_user.email+"%")).all()
    #fav_movies = select(Favorites).where(Favorites.email==current_user.email)
    fav_movies = Favorites.query.filter_by(email=current_user.email).all()
    print(fav_movies)

    #showThere = Show.query.filter_by(name = showname).first()
    
    favs = fav_movies
    if favs is not None:
        fav_length = len(favs)
        print(fav_length)
        #print(favs)
        favorites = get_favorites(favs)
        fav_titles = favorites['fav_titles']
        fav_posters = favorites['fav_posters']
        fav_ids = favorites['fav_ids']
        fav_taglines = favorites['fav_taglines']
        
        fav_wikiLinks=[]
        for i in range(len(fav_titles)):
            links = MediaWiki.get_wiki_link(fav_titles[i])
        try:
            fav_wikiLinks.append(links[3][0])#This is the part that has the link to the wikipedia page
        except:
            fav_wikiLinks.append("#")#The links get out of order If I don't do this
            print("Link doesn't exist")
            
                
        return render_template(
            "favorites.html",
            fav_length = fav_length,
            fav_titles = fav_titles,
            fav_posters = fav_posters,
            fav_taglines = fav_taglines,
            fav_ids = fav_ids,
            fav_wikiLinks = fav_wikiLinks
        )
    return render_template("favorites.html")
        
@app.route('/search', methods=["POST","GET"])
@login_required
def search():
    data = get_genres()
    movies = get_trending()
    title = 'Trending'    
    if request.method == "POST":
        query = request.form.get("search")
        title = query
        movies = movie_search(query)
                     
    titles = movies['titles']
    overviews = movies['overviews']
    posters = movies['posters']
    ids = movies['ids']
    taglines = movies['taglines']
    
    wikiLinks=[]
    for i in range(len(titles)):
        links = MediaWiki.get_wiki_link(titles[i])
        try:
            wikiLinks.append(links[3][0])#This is the part that has the link to the wikipedia page
        except:
            wikiLinks.append("#")#The links get out of order If I don't do this
            print("Link doesn't exist")
            
    return render_template(
        "search.html",
        title = title,
        genres = data,
        titles = titles,
        overviews = overviews, 
        posters = posters,
        taglines = taglines,
        ids = ids,
        wikiLinks = wikiLinks,
        )
    
@app.route('/add/<id>', methods=["POST","GET"])
@login_required
def addMovie(id):
    favorites = Favorites.query.filter(Favorites.email.like("%"+current_user.email+"%")).all()
    if favorites is None:
        new_movie = Favorites(email=current_user.email, movie=int(id))
        db.session.begin()
        db.session.add(new_movie)
        db.session.commit()
        return redirect(url_for('favorites'))
    if id in favorites:
        flash("Movie is already added")
        return redirect(url_for('search'))
    new_movie = Favorites(email=current_user.email, movie=int(id))
    db.session.begin()
    db.session.add(new_movie)
    db.session.commit()
    flash("Movie added to Favorites!")
    return redirect(url_for('favorites'))

@app.route('/remove/<id>', methods=["POST","GET"])
@login_required
def removeMovie(id):
    favorites = Favorites.query.filter_by(email=current_user.email,movie=id).first()
    if favorites is None:
        return redirect(url_for('favorites'))
    db.session.begin()
    db.session.delete(favorites)
    db.session.commit()
    flash("Movie removed!")
    return redirect(url_for('favorites'))
    
    
    
@app.route('/movie/<id>', methods=["POST","GET"])
def viewMovie(id):
    (title, genres, poster, tagline, overview, release_date) = movie_info(id)
    if request.method == "POST":
        rating = request.form.get("rating")
        textReview = request.form.get("textReview")
        new_rating = Reviews(movie_id=int(id), user=current_user.name, rating=rating, text=textReview)
        db.session.begin()
        db.session.add(new_rating)
        db.session.commit()

    reviews = Reviews.query.filter_by(movie_id=id).all()
    
    if reviews:
        users=[]
        ratings=[]
        texts=[]
        for i in reviews:
            print (i.__dict__)
            users.append(i.__dict__.get('user'))
            ratings.append(i.__dict__.get('rating'))
            texts.append(i.__dict__.get('text'))
        return render_template(
            "viewMovie.html",
            title = title,
            genres = genres,
            poster = poster, 
            tagline = tagline,
            overview = overview,
            release_date = release_date, 
            id=id,
            user=users, 
            rating=ratings,
            text=texts,
            reviews=1,
            rev_length=len(ratings),
        )
       
    return render_template(
        "viewMovie.html",
         title = title,
         genres = genres,
         poster = poster, 
         tagline = tagline,
         overview = overview,
         release_date = release_date, 
         id=id
        )
app.run()





# set up a separate route to serve the index.html file generated
# by create-react-app/npm run build.
# By doing this, we make it so you can paste in all your old app routes
# from Milestone 2 without interfering with the functionality here.
bp = Blueprint(
    "bp",
    __name__,
    template_folder="./static/react",
)

# route for serving React page
@bp.route("/")
def index():
    # NB: DO NOT add an "index.html" file in your normal templates folder
    # Flask will stop serving this React page correctly
    return render_template("index.html")


@bp.route("/funfact")
def funfact():
    facts = [
        "Three presidents, all Founding Fathers—John Adams, Thomas Jefferson, and James Monroe—died on July 4. Presidents Adams and Jefferson also died the same year, 1826; President Monroe died in 1831.",
        "The heart of the blue whale, the largest animal on earth, is five feet long and weighs 400 pounds.",
        "The word “strengths” is the longest word in the English language with only one vowel.",
    ]
    return jsonify(facts)


app.register_blueprint(bp)

app.run()
