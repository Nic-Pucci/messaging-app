import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Message from './Message';

export default ({ onSend }) => {
    const [messageText, setMessageText] = useState('');



    return (
        <Form>
            <Form.Group>
                <Form.Label><h3>Type Message:</h3></Form.Label>
                <Form.Control as='textarea' rows='3' value={messageText} onChange={event => { setMessageText(event.target.value) }} />
                <Button type='submit' variant='primary'>
                    Send
                </Button>
            </Form.Group>
        </Form>
    );
}