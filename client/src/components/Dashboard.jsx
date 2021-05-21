import React, { useState, useEffect } from 'react';
import { Row, Col, Nav, Tab, ListGroup, Container, Form, FormControl, Button } from 'react-bootstrap';
import SentContactInvitationListItem from './User List Items/SentContactInvitationListItem';
import ReceivedContactInvitationListItem from './User List Items/ReceivedContactInvitationListItem';
import ContactInvitationListItem from './User List Items/ContactInvitationListItem';
import Profile from './Profile';
import axios from 'axios';

export default ({ token, onProfileUpdate }) => {
    const [updatedEmail, setUpdatedEmail] = useState(token.user.email);
    const [updatedUsername, setUpdatedUsername] = useState(token.user.username);
    const [contacts, setContacts] = useState([]);
    const [sentInvitations, setSentInvitations] = useState([]);
    const [receivedInvitations, setReceivedInvitations] = useState([]);

    useEffect(() => {
        axios({
            url: `http://localhost:8080/contacts`,
            method: 'GET',
            withCredentials: true,
            crossdomain: true,
        }).then(response => {
            const contactsData = [...response.data.contacts];
            const sentInvitationsData = [...response.data.sentInvitations];
            const contactInvitationsData = [...response.data.receivedInvitations];

            setContacts([...contactsData]);
            setSentInvitations([...sentInvitationsData]);
            setReceivedInvitations([...contactInvitationsData]);
        }).catch(err => {
            // setFormErr(`Error: ${JSON.stringify(err.response.data.message)}`);
            // setFormErr(`Error: ${err.message}`);
        });
    }, []);

    const handleCancelSentInventation = receiverID => {

    }

    const onSaveProfile = () => {
        //const updates
        onProfileUpdate();
    };

    const contactsList = (

        <ListGroup>
            {contacts.map(contactInvitation => {
                return <ContactInvitationListItem token={token.user} contactName={contactInvitation.username} contactEmail={contactInvitation.email} />
            })}
        </ListGroup>
    );

    const sentInvitationsList = (
        <ListGroup>
            {sentInvitations.map(contactInvitation => {
                return <SentContactInvitationListItem receiverUsername={contactInvitation.receiverUsername} receiverEmail={contactInvitation.receiverEmail} handleCancelSentInventation={handleCancelSentInventation} />
            })}
        </ListGroup>
    );

    const receivedInvitationsList = (
        <ListGroup>
            {receivedInvitations.map(contactInvitation => {
                return <ReceivedContactInvitationListItem senderUsername={contactInvitation.senderUsername} senderEmail={contactInvitation.senderEmail} />
            })}
        </ListGroup>
    );

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Tab.Container defaultActiveKey='profile' fill>
                        <Row>
                            <Col xs={3}>
                                <Row>
                                    <Col>
                                        <h5>{`Welcome Back, ${token.user.username}!`}</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Nav variant='pills' className='flex-column'>
                                            <Nav.Item>
                                                <Nav.Link eventKey='profile'>Profile</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey='contacts'>Contacts ({contacts.length})</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey='pending'>Sent Invitations ({sentInvitations.length})</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey='invitations'>Received Invitations ({receivedInvitations.length})</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey='profile'>
                                        <Profile token={token} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey='contacts'>
                                        <h1>Contacts: ({contacts.length})</h1>
                                        {contactsList}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey='pending'>
                                        <h1>Sent Invitations: ({sentInvitations.length})</h1>
                                        {sentInvitationsList}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey='invitations'>
                                        <h1>Received Invitations: ({receivedInvitations.length})</h1>
                                        {receivedInvitationsList}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    );
}

/* <Col xs={8}>

                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column xs={4}>
                            Username:
                        </Form.Label>
                        <Col xs={8}>
                            <Form.Control readOnly={!editProfile} type='text' placeholder='New Display Name' value={updatedUsername} onChange={event => { setUpdatedUsername(event.target.value) }} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column xs={4}>
                            Email:
                        </Form.Label>
                        <Col xs={8}>
                            <Form.Control readOnly={!editProfile} type='email' placeholder='New Email' value={updatedEmail} onChange={event => { setUpdatedEmail(event.target.value) }} />
                        </Col>
                    </Form.Group>
                </Form>
            </Col> */