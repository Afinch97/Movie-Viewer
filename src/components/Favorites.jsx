import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
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
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState();
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
                setThere(true)
                
            });        
    };
    useEffect(() => getRepo(), []);
    console.log("Length: ",length)
    console.log("Test: ",test)
    console.log("Seperate Variables: ",title, ids, titles, posters, taglines, length)
    const Delete =(na,index) => {
        console.log(na)
        setShow(true)
        setAlert(
            <>
            <Alert variant="success" onClose={() => setShow(false)} dismissible style={{"margin-left":"auto", "margin-right":"auto"}}>
                <Alert.Heading>{title} added to favorites!</Alert.Heading>
            </Alert>
            </>
        );
        setLength(length-1)
        setIds(ids.filter((x,i) => i !== index))
        setTitles(titles.filter((x,i) => i !== index))
        setPosters(posters.filter((x,i) => i !== index))
        setTaglines(taglines.filter((x,i) => i !== index))
        fetch(`/remove/${na}`);
        console.log("Variables after deletion: ",title, ids, titles, posters, taglines, length)
    }

    for (let i = 0; i < length; i++) {
        items.push(
            <div class='item'>
                <p><h2>({i+1}) {titles[i] }</h2>
                <Link className="btn btn-secondary btn-sm" role="button" to={`/info/${ids[i]}`}>More Info</Link>
                </p>
                <img src={String(posters[i])} alt=''/>
                <p>{ taglines[i] }</p>
                    {console.log(ids[i])}
                    <Button variant="danger" onClick={() => Delete(ids[i],i)}>Remove from Favorites</Button>
            </div>
        )
    }
     return (
        <>
        <h1>{title} Movies</h1>
        {show && 
            alert
        }
        {there === false &&
        <div className='d-flex justify-content-center'>
        <Spinner animation="border" variant="info" style={{ width: '6rem', height: '6rem' }}/>
        </div>
        }
        {there === true && length === 0 &&
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