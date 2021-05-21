import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { checkCredentials } from '../utils/Utils.js';

export default function Signup({ redirectPath }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [formErr, setFormErr] = useState(null);
    const [user, setUser] = useState(null);

    const SendCredentials = () => {
        axios({
            url: 'http://localhost:8080/authentication/signup',
            method: 'POST',
            data: {
                username,
                email,
                password,
                bio
            }
        }).then(response => {
            setFormErr(`Received: ${JSON.stringify(response)}`);
        }).catch(err => {
            setFormErr(`Error: ${JSON.stringify(err.response.data.message)}`);
            // setFormErr(`Error: ${err.message}`);
        });
    }

    useEffect(
        () => {
            checkCredentials((err, token) => {
                console.log('finished = ' + token);
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

        if (username.length === 0) {
            setFormErr('Must fill in a valid username.');
            return;
        }
        else if (email.length === 0) {
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
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <h1>Signup Component</h1>
                {formErr && <Form.Text>{formErr}</Form.Text>}
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    Username:
                </Form.Label>
                <Form.Control type='text' placeholder='Enter a Username' value={username} onChange={event => { setUsername(event.target.value) }} />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    Email:
                </Form.Label>
                <Form.Control type='email' placeholder='Enter Email' value={email} onChange={event => { setEmail(event.target.value) }} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Label value='Password'>
                    Password:
                </Form.Label>
                <Form.Control type='password' placeholder='Enter a password' value={password} onChange={event => { setPassword(event.target.value) }} />
            </Form.Group>
            <Form.Label>
                Bio (optional):
                </Form.Label>
            <Form.Control type='text' placeholder='Who are you?' value={bio} onChange={event => { setBio(event.target.value) }} />
            <Form.Group>
                <Button variant='primary' type='submit'>
                    Create Account
                </Button>
            </Form.Group>
        </Form>
    );
}