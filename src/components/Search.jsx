import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "./searchStyle.css";

const Search = () =>  {
    const [title, setTitle] = useState("")
    const [ids, setIds] = useState([])
    const [posters, setPosters] = useState([])
    const [taglines, setTaglines] = useState([])
    const [titles, setTitles] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const items= [];
    const getRepo = async () =>{
        await fetch('/flask/search')
            .then(response => response.json())
            .then(data => {
                setTitle(data.title)
                setIds(data.ids)
                setPosters(data.posters)
                setTaglines(data.taglines)
                setTitles(data.titles)
                setIsLoaded(true)
            });        
    };
    useEffect(() => {
        getRepo()
    }, []);
    console.log(title, ids, titles, posters, taglines)
    if(titles.length !== 0){
        for (let i = 0; i < 10; i++) {
            items.push(
                <div class='item'>
                    <p><h2>({i+1}) {titles[i] }</h2>
                    <Link to={`/info/${ids[i]}`}><input type="submit" value="More info"/></Link>
                    </p>
                    <img src={String(posters[i])} alt=""/>
                    <p>{ taglines[i] }</p>
                    <button onClick={() => Add(ids[i])}>Add to Favorites</button>
                </div>
            )
            }
    }
    const Add = (e) =>{
        e.preventDefault();
        fetch(`/add/${e}`)
    };
     return (
        <>
        <h1>{title} Movies</h1>
        {isLoaded === false &&
        <div className='d-flex justify-content-center'>
        <Spinner animation="border" variant="info" style={{ width: '6rem', height: '6rem' }}/>
        </div>
        }
    
        <div class='container'>
            {items}
        </div>
        </>
    )
}

export default Search