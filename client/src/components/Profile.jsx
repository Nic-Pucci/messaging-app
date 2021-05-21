import React, { Component, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export default ({ token }) => {
    const [username, setUsername] = useState(token.user.username);
    const [email, setEmail] = useState(token.user.email);
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState(token.user.bio);
    const [editProfile, setEditProfile] = useState(false);

    const handleSubmit = event => {
        event.preventDefault();
    };

    const handleCancel = event => {
        event.preventDefault();
        setUsername(token.user.username);
        setEmail(token.user.email);
        setPassword('');
        setBio(token.user.bio);
        setEditProfile(false);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Row className='d-flex align-items-center'>
                    <Col>
                        <h1>Profile:</h1>
                    </Col>
                    <Col>
                        <div className='float-right'>
                            <Button disabled={editProfile} className='mr-2' variant={editProfile ? 'outline-secondary' : 'outline-primary'} onClick={event => setEditProfile(true)}>
                                Edit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    Username:
                </Form.Label>
                <Form.Control readOnly={!editProfile} type='text' placeholder={editProfile ? 'Enter a Username' : ''} value={username} onChange={event => { setUsername(event.target.value) }} />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    Email:
                </Form.Label>
                <Form.Control readOnly={!editProfile} type='email' placeholder={editProfile ? 'Enter Email' : ''} value={email} onChange={event => { setEmail(event.target.value) }} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Label value='Password'>
                    Password:
                </Form.Label>
                <Form.Control readOnly={!editProfile} type='password' placeholder={editProfile ? 'Enter a password' : ''} value={password} onChange={event => { setPassword(event.target.value) }} />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    Bio (optional):
                </Form.Label>
                <Form.Control readOnly={!editProfile} as='textarea' rows='7' placeholder={editProfile ? 'Who are you?' : ''} value={bio} onChange={event => { setBio(event.target.value) }} />
            </Form.Group>
            <Form.Group>
                <div className='float-right'>
                    {editProfile &&
                        <Button className='mr-2' variant='danger' onClick={handleCancel}>
                            Cancel
                            </Button>}
                    {editProfile &&
                        <Button type='submit' className='mr-2' variant='success'>
                            Save
                            </Button>}
                </div>
            </Form.Group>

        </Form>
    );
}