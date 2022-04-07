import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Button,  Alert } from 'react-bootstrap';
import "./searchStyle.css";

const Search = () =>  {
    const [title, setTitle] = useState("")
    const [ids, setIds] = useState([])
    const [posters, setPosters] = useState([])
    const [taglines, setTaglines] = useState([])
    const [titles, setTitles] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState();
    const items= [];
    const getRepo = async () =>{
        let information = {}
        await fetch('/flask/search')
            .then(response => response.json())
            .then(data => {
                information = data
            });
        setTitle(information.title)
        setIds(information.ids)
        setPosters(information.posters)
        setTaglines(information.taglines)
        setTitles(information.titles)
        setIsLoaded(true)
        console.log("Info Set")
        console.log("Information Object: ",information)
    };
    useEffect(() => {
        getRepo()
    }, []);
    //console.log(title, ids, titles, posters, taglines)
    if(titles.length !== 0){
        for (let i = 0; i < titles.length; i++) {
            items.push(
                <div class='item'>
                    <p><h3><strong>({i+1}) {titles[i] }</strong></h3>
                    <Link className="btn btn-secondary btn-sm" role="button" to={`/info/${ids[i]}`}>More Info</Link>
                    </p>
                    <img src={String(posters[i])} alt=""/>
                    <p>{ taglines[i] }</p>
                        <Button variant="success" onClick={() => {Add(ids[i],titles[i]);}}>Add to Favorites</Button>
                </div>
            )
            }
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
    console.log(show)
     return (
        <>
        <h1>{title} Movies</h1>
        {show && 
            alert
        }
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