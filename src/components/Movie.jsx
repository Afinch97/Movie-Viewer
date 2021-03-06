import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import "./styleMovie.css";

const Movie = () => {
    const { movieId } = useParams();
    console.log({movieId})
    const[areReviews, setAreReviews] = useState(false)
    const[genres, setGenres] = useState([])
    const [title, setTitle] = useState("")
    const [id, setId] = useState()
    const [poster, setPoster] = useState("")
    const [tagline, setTagline] = useState("")
    const [overview, setOverview] = useState("")
    const [releaseDate, setReleaseDate] = useState()
    const [user, setUser] = useState([])
    const [rating, setRating] = useState([])
    const [text, setText] = useState([])
    const [reviewLength, setReviewLength] = useState(0)
    const [startForm, setStartForm] = useState("Be the first to write a review:")
    const [inputs, setInputs] = useState({})
    const [current_user, setCurrent_user] = useState("")
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState();
    const [isLoaded, setIsLoaded] = useState(false)

    

    const getRepo = async () =>{
        await fetch(`/movie/${movieId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTitle(data.title)
                setId(data.id)
                setPoster(data.poster)
                setTagline(data.tagline)
                setOverview(data.overview)
                setPoster(data.poster)
                setReleaseDate(data.release_date)
                setGenres(data.genres)
                setCurrent_user(data.current_user)
                setIsLoaded(true)
                if(data.reviews === "true"){
                    setAreReviews(true)
                    setUser(data.user)
                    setRating(data.rating)
                    setText(data.text)
                    setReviewLength(data.rev_length)
                    setStartForm("Write a Review:")
                }
        
            });        
    };
    useEffect(() => getRepo(), []);
    console.log(areReviews, genres, title, id, poster, tagline, overview, releaseDate, user, rating, text, reviewLength)
    console.log(reviewLength)
    const reviews = []
    if (areReviews === true){
        for (let i=0; i<reviewLength; i++){
            reviews.push(
                <>
                <div class="name_and_rating">
                    <h3>{user[i]}: {rating[i]}</h3>
                </div>
                <div class="review_text">
                   {text[i]}
                </div><br></br>
                </>
            )
        }
    }
    const submit = (e)  => {
        e.preventDefault();
        setUser(olduser => [...olduser, current_user])
        setRating(oldrating => [...oldrating, inputs.rating])
        setText(oldtext => [...oldtext, inputs.textReview ])
        setReviewLength(reviewLength + 1)
        if(areReviews===false){
            setAreReviews(true)
        }
        reviews.push(
            <>
                <div class="name_and_rating">
                    <h3>{current_user}: {inputs.rating}</h3>
                </div>
                <div class="review_text">
                    {inputs.textReview}
                </div><br></br>
            </>
        )
        fetch(`/movie/${movieId}`, { method: 'POST', headers:{'Content-Type':'application/json'} ,body: JSON.stringify(inputs) })
        
    }
    const Add = (e,title) =>{
        console.log(title)
        setShow(true)
        setAlert(
            <>
            <Alert variant="success" onClose={() => setShow(false)} dismissible style={{"margin-left":"auto", "margin-right":"auto"}}>
                <Alert.Heading>{title} added to favorites!</Alert.Heading>
            </Alert>
            </>
        );
        fetch(`/add/${e}`)
    };

    return (
    <>
    <h2>{title}</h2>
    {show && 
            alert
        }
    {isLoaded === false &&
        <div className='d-flex justify-content-center'>
        <Spinner animation="border" variant="info" style={{ width: '6rem', height: '6rem' }}/>
        </div>
    }
    <Button variant="success" onClick={() => {Add(id,title);}}>Add to Favorites</Button>
    <div class="movieInfo">
        <div class="poster">
            <img src={poster} alt=""/>
        </div>
        <div class="details">
            <div class="title">{title}</div> {releaseDate}<br/>
            {tagline}<br/>
            {genres}<br/><br/>
            {overview}<br/>
        </div>
    </div>
    <div class="reviews">
        {areReviews === true &&
            <>
            <h2>Reviews:</h2>
            {reviews}
            </>
        }
        <form onSubmit={submit} action="/movie/{{id}}" class="reviewbox">
        <h2>{startForm}</h2>
        <label for="rating">Rate the movie out of 10: </label><input type="number" name="rating" min="0" max="10" onChange={e =>setInputs({...inputs, rating: e.target.value})} value={inputs.rating}/><br></br>
        <label for="text">Review: </label><input type="text" name="textReview" size="60" onChange={e =>setInputs({...inputs, textReview: e.target.value})} value={inputs.textReview}/><br></br>
        <button type="submit">Submit Review</button>
        </form>
    </div>
    </>
  );
};

export default Movie;