import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, Form, ListGroup, ListGroupItem } from 'react-bootstrap';

export default ({ show, conversation, handleClose, handleConversationRemove, user }) => {
    const [key, setKey] = useState('members');

    const contactsList = conversation.contacts.map((contact, index) => {
        return (
            <ListGroupItem key={index}>
                {contact.userName}
                <Button variant='danger' onClick={() => console.log(`delete ${index}`)} className='float-right'>
                    Remove
                </Button>
            </ListGroupItem >
        );
    });

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Settings - {conversation.conversationName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs onSelect={key => setKey(key)}>
                    <Tab eventKey='members' title='Members'>
                        <Form onSubmit={() => { }}>
                            <Form.Group>
                                <Form.Label>
                                    <h3>Add new member:</h3>
                                </Form.Label>
                                <Form.Control type='text' placeholder='Eg. "user@email.com"' value={() => { }} onChange={event => { }} />
                            </Form.Group>
                        </Form>
                        <ListGroup>
                            {contactsList}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey='group' title='Group Options' >
                        {/* <Button variant='warning' onClick={handleClose} block>
                            Archive Group
                        </Button> */}
                        <Button variant='danger' onClick={handleConversationRemove} block>
                            {conversation.creatorID === user.id && `Delete Group`}
                            {conversation.creatorID !== user.id && `Leave Group`}
                        </Button>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    Cancel
                </Button>
                {/* <Button variant='primary' onClick={handleClose}>
                    Save
                </Button> */}
            </Modal.Footer>
        </Modal>
    );
}