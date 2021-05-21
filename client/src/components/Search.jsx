import React, { useState, useEffect } from 'react';
import { Container, Form, FormControl, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import SentContactInvitationListItem from './User List Items/SentContactInvitationListItem';
import ReceivedContactInvitationListItem from './User List Items/ReceivedContactInvitationListItem';
import ContactInvitationListItem from './User List Items/ContactInvitationListItem';
import NonContactInvitationListItem from './User List Items/NonContactInvitationListItem';
import io from 'socket.io-client';
import axios from 'axios';

export default ({ token }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io('http://localhost:8080/', { query: `token=${token.encoded}` }));
    }, [token]);

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('connected client');
        });

        socket.on('search users results', ({ users }) => {
            setSearchResults(users);
        });

        socket.on('disconnect', () => { console.log('disconnected client'); });

        return () => {
            socket.off('search results');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket]);

    const handleSearchChange = event => {
        const searchInput = event.target.value;
        setSearchQuery(prevSearchQuery => {
            socket.emit('search users', { searchQuery: searchInput });
            return searchInput;
        });
    }

    const handleContactInvitation = userID => {
        axios({
            url: 'http://localhost:8080/contacts/invitation/send',
            method: 'POST',
            withCredentials: true,
            crossdomain: true,
            data: {
                user: {
                    id: userID
                }
            }
        }).then(response => {
            console.log('received');// update list
        }).catch(err => {
            console.log(`${JSON.stringify(err)}`)
            //setFormErr(`Error: ${JSON.stringify(err.response.data.message)}`);
            // setFormErr(`Error: ${err.message}`);
        });
    }

    const searchList = (
        <ListGroup>
            {searchResults &&
                searchResults.map((contactInvitation, index) => {
                    const isContact = contactInvitation.status === 'accepted';
                    const sentInvitationToUser = contactInvitation.status === 'pending' && contactInvitation.senderID === token.user.id; // 1 = pending
                    const receivedInvitationFromUser = contactInvitation.status === 'pending' && contactInvitation.receiverID === token.user.id;; // 1 = pending
                    if (isContact) {
                        return <ContactInvitationListItem key={index} token={token} contactName={contactInvitation.username} contactEmail={contactInvitation.email} />
                    }
                    else if (sentInvitationToUser) {
                        return <SentContactInvitationListItem key={index} receiverUsername={contactInvitation.username} receiverEmail={contactInvitation.email} />
                    }
                    else if (receivedInvitationFromUser) {
                        return <ReceivedContactInvitationListItem key={index} senderUsername={contactInvitation.username} senderEmail={contactInvitation.email} />
                    }
                    else {
                        return <NonContactInvitationListItem key={index} username={contactInvitation.username} email={contactInvitation.email} handleContactInvitation={event => handleContactInvitation(contactInvitation.id)} />
                    }
                })}
        </ListGroup>
    );

    return (
        <Container fluid>
            <Form inline>
                <h1>Search For New Contacts:</h1>
                <FormControl className='ml-2' value={searchQuery} onChange={handleSearchChange} placeholder='Username/Email' aria-label='Search' aria-describedby='basic-addon1' />
            </Form>

            {searchResults && <h3>Results: ({searchResults.length})</h3>}
            {searchResults && searchList}
        </Container>
    );
}