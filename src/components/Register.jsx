import React, {useState} from "react";
import { Form,Button } from "react-bootstrap";
import { Link, useNavigate} from "react-router-dom";
import { RiMovie2Line } from 'react-icons/ri';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./homeStyle.css";


const Register = ()=>{
    const [user, setUser] = useState({username:"",email:"" ,password:""});
    const [error, setError] = useState("");
    let navigate = useNavigate();
        const Submit = e => {
            e.preventDefault();
            console.log(JSON.stringify(user))
            fetch('/register', { method: 'POST', headers:{'Content-Type':'application/json'} ,body: JSON.stringify(user) })
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    var key = Object.keys(json)
                    console.log(key[0])
                    if(key[0]==="success"){
                        navigate("/");
                    }
                    else if(key[0]==="error"){
                        setError(Object.values(json))
                    }
                });
        }

        return (
            <>
            <h1><RiMovie2Line size={"2.5em"}/>Movie Viewer</h1>
            <div className="inner">
            <Form onSubmit={Submit}>
            <h3>Register</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
                <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>Username: </Form.Label>
                    <Form.Control type="text" placeholder="Username" onChange={e =>setUser({...user, username: e.target.value})} value={user.username} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={e =>setUser({...user, email: e.target.value})} value={user.email} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e =>setUser({...user, password: e.target.value})} value={user.password} />
                </Form.Group>
                <Button variant="primary" type="submit" >
                    Submit
                </Button>
            </Form>
            <br/>
            <span>Already have an account? </span>
            <Link className="btn btn-secondary btn-sm" role="button" to={"/"}>Log In</Link>
            </div>
            </>
        )

}
export default Register