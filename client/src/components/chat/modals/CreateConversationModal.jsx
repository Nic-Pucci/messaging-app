import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default ({ show, onCreateConversation, handleClose, user }) => {
    const [conversationName, setConversationName] = useState('');

    const handleCreateConversation = event => {
        event.preventDefault();

        onCreateConversation({
            creatorID: user.id,
            conversationName: conversationName
        });
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Create New Conversation Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleCreateConversation}>
                    <Form.Group>
                        <Form.Label>
                            <h3>Conversation Name:</h3>
                        </Form.Label>
                        <Form.Control type='text' placeholder='Eg. "Best Group Ever!"' value={conversationName} onChange={event => { setConversationName(event.target.value) }} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            <h3>Invite Contacts</h3>
                        </Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Button variant='danger' onClick={handleClose} className='mr-2'>
                            Cancel
                        </Button>
                        <Button type='submit' variant='primary' className='mr-2'>
                            Create
                        </Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    );
}