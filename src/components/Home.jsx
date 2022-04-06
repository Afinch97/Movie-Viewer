import React, {useState} from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate} from "react-router-dom";
import { RiMovie2Line } from 'react-icons/ri';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./homeStyle.css";

const Home = ()=>{
    const [user, setUser] = useState({username:"", password:"", remember:false});
    const [error, setError] = useState("");
    let navigate = useNavigate();
        const Submit = e => {
            e.preventDefault();
            console.log(JSON.stringify(user))
            fetch('/login', { method: 'POST', headers:{'Content-Type':'application/json'} ,body: JSON.stringify(user) })
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    var key = Object.keys(json)
                    console.log(key[0])
                    if(key[0]==="success"){
                        navigate("/search");
                    }
                    else if(key[0]==="error"){
                        console.log(Object.values(json))
                        setError(Object.values(json))
                    }
                });
        }
        
        return (
            <>
            <h1><RiMovie2Line size={"2.5em"}/>Movie Viewer</h1>
            <div className="inner">
            <Form onSubmit={Submit}>
                <h3>Log In</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>Username/Email: </Form.Label>
                    <Form.Control type="text" placeholder="Username or Email" id="user" onChange={e =>setUser({...user, username: e.target.value})} value={user.username} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" id="password" onChange={e =>setUser({...user, password: e.target.value})} value={user.password} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember Me" id="remember" value={user.remember} onChange={e =>setUser({...user, remember: !user.remember})} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <br/>
            <span>Don't have an account? </span>
            <Link className="btn btn-secondary btn-sm" role="button" to={"/register"}>Register</Link>
            </div>
            </>
        )

}
export default Home