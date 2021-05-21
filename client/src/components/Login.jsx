import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { Container, Form, Button } from 'react-bootstrap';
import { checkCredentials, getCookieToken } from '../utils/Utils.js';

export default ({ redirectPath, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErr, setFormErr] = useState(null);
    const [user, setUser] = useState(null);

    const SendCredentials = () => {
        axios({
            url: 'http://localhost:8080/authentication/signin',
            method: 'POST',
            withCredentials: true,
            crossdomain: true,
            data: {
                email: email,
                password: password
            }
        }).then(response => {
            const token = getCookieToken();
            const user = token.user;
            setFormErr(`Received: ${JSON.stringify(response)}`);
            setUser(user);
            onLogin(token);
        }).catch(err => {
            console.log(`${JSON.stringify(err)}`)
            //setFormErr(`Error: ${JSON.stringify(err.response.data.message)}`);
            // setFormErr(`Error: ${err.message}`);
        });
    }

    useEffect(
        () => {
            checkCredentials((err, token) => {
                if (err) {
                    return;
                }

                if (token) {
                    const user = token.user;
                    setUser(user);
                }
            });
        },
        []);

    const handleSubmit = event => {
        event.preventDefault();

        if (email.length === 0) {
            setFormErr('Must fill in a valid email.');
            return;
        }
        else if (password.length === 0) {
            setFormErr('Must fill in a valid password.');
            return;
        }
        else {
            setFormErr(null);
        }

        SendCredentials();
    };

    if (user) {
        return <Redirect to={redirectPath} />;
    }

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <h1>Login Component</h1>
                    {formErr && <Form.Text>{formErr}</Form.Text>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={event => { setEmail(event.target.value) }} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type='password' placeholder='Password' value={password} onChange={event => { setPassword(event.target.value) }} />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    Login
            </Button>
            </Form>
        </Container>
    );
}