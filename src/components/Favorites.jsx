import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./searchStyle.css";
import image from "./NoFavs.jpg";

const Favorites = () =>  {
    const title = "Favorite"
    const [ids, setIds] = useState([])
    const [posters, setPosters] = useState([])
    const [taglines, setTaglines] = useState([])
    const [titles, setTitles] = useState([])
    const [length, setLength] = useState(0)
    const [test, setTest] = useState({})
    const [there, setThere] = useState(false)
    const items= [];
    const getRepo = async () =>{
        console.log("fetching")
        await fetch(`/flask/favorites`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTest(data)
                setLength(data.length)
                setIds(data.ids)
                setPosters(data.posters)
                setTaglines(data.taglines)
                setTitles(data.titles)
            });        
    };
    useEffect(() => getRepo(), []);
    console.log(length)
    if (length !== 0){
        setThere(true)
    }
    if (there === true){
        console.log(test)
        console.log(title, ids, titles, posters, taglines, length)
    }
    const Delete =(na) => {
        console.log(na)
        fetch(`/remove/${na}`);

    }

    for (let i = 0; i < length; i++) {
        items.push(
            <div class='item'>
                <p><h2>({i+1}) {titles[i] }</h2>
                <Link to={`/${ids[i]}`}><input type="submit" value="More info"/></Link>
                </p>
                <img src={String(posters[i])} />
                <p>{ taglines[i] }</p>
                    {console.log(ids[i])}
                    <button onClick={() => Delete(ids[i])}>Remove from Favorites</button>
            </div>
        )
    }
     return (
        <>
        <h1>{title} Movies</h1>
        {there === false && 
            <center>
                <img src={image} alt=''/>
                <br />
                <h1>Go add some movies!</h1>
            </center>
        }
        <div class='container'>
            {items}
        </div>
        </>
    )
}

export default Favorites;