import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "./searchStyle.css";
import { Button,  Alert, Card } from 'react-bootstrap';

const Searchv2 = () =>  {
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
        await fetch('/flask/searchv2')
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
    useEffect(() => {getRepo()}, []);
    if(titles.length !== 0){
        for (let i = 0; i < 10; i++) {
            items.push(
                <div class='item'>
                <Card style={{ width: '345px' }}>
                    <Card.Header><strong>{titles[i]}</strong></Card.Header>
                    <Card.Img variant="top" src={String(posters[i])} styie={{padding: '4px'}} />
                    <Card.Body>
                        <Card.Text>{taglines[i]}</Card.Text>
                    </Card.Body>
                    <Card.Body>
                        <Link className="btn btn-secondary" role="button" to={`/info/${ids[i]}`}>More Info</Link>{' '}
                        <Button variant="success" onClick={() => {Add(ids[i],titles[i]);}}>Add to Favorites</Button>
                    </Card.Body>
                </Card>
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

export default Searchv2