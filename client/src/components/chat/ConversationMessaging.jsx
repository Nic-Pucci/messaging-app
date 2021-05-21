import React, { useRef, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import MessageCard from './MessageCard';
import ConversationSettingsModal from './modals/ConversationSettingsModal';
//import img from '../../bamboo3.jpg';

export default function ConversationMessaging(props) {
    const { conversationIndex, conversation, style, onMessageSend, token, onConversationRemove } = props;
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
    const [newMessageError, setNewMessageError] = useState(null);
    const messageEnd = useRef(null);
    const [newMessageText, setNewMessageText] = useState('');

    useEffect(() => smoothScrollToBottom(), [props]);

    useEffect(() => immediateScrollToBottom(), []);

    const immediateScrollToBottom = () => {
        messageEnd.current.scrollIntoView();
    }

    const smoothScrollToBottom = () => {
        messageEnd.current.scrollIntoView({ behavior: 'smooth' });
    }

    const handleMessageSend = event => {
        event.preventDefault();

        if (newMessageText.length === 0) {
            setNewMessageError();
            return;
        }

        onMessageSend(conversationIndex, newMessageText);
        setNewMessageText('');
    }

    const handleConversationRemove = () => {
        setOpenSettingsModal(false);
        onConversationRemove(conversation);
    }

    const messageCards = conversation.messages.map((message, index) => {
        const authorIsUser = message.authorID === token.user.id;

        const messageCardProps = {
            message: message,
            style: {
                backgroundColor: authorIsUser ? '#d6fbff' : '#f0ffb5',
                width: '50%',
                maxWidth: '50%'
            }
        };

        return (
            <Row key={index}>
                <Col xs={6}>
                    {authorIsUser && <MessageCard {...messageCardProps} />}
                </Col>
                <Col xs={6}>
                    {!authorIsUser && <MessageCard {...messageCardProps} />}
                </Col>
            </Row >
        );
    });

    return (
        <Container fluid>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
                <Col>
                    <h1 className='text-primary'>{conversation.conversationName}:</h1>
                </Col>
                <Col>
                    <Button variant='btn btn-outline-primary' onClick={() => { setOpenSettingsModal(true) }} className='float-right'>
                        Conversation Settings
                    </Button>
                    <ConversationSettingsModal show={openSettingsModal} conversation={conversation} handleClose={() => { setOpenSettingsModal(false) }} user={token.user} handleConversationRemove={handleConversationRemove} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Container fluid style={style}>
                        <Row>
                            {/* backgroundImage: `url(${img})`, backgroundImageRepeat: 'repeat',  */}
                            <Col style={{ backgroundColor: 'gray', minHeight: style.height }}>
                                {messageCards}
                                <div ref={messageEnd}></div>
                            </Col>
                        </Row>
                    </Container>
                    <Form onSubmit={handleMessageSend}>
                        <Form.Group>
                            <Form.Label><h3>Type Message:</h3></Form.Label>
                            <Form.Control as='textarea' rows='3' value={newMessageText} onChange={event => { setNewMessageText(event.target.value) }} />

                            <Button type='submit' variant='primary' className='float-right'>
                                Send
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}