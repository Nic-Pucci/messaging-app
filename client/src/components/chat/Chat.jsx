import React, { useState, useEffect } from 'react';
import { Row, Col, Tab, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Message from '../../models/Message';
import ConversationMessaging from './ConversationMessaging';
import CreateConversationModal from './modals/CreateConversationModal';
import io from 'socket.io-client';

export default ({ token }) => {
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messageHistoryHeight, setMessageHistoryHeight] = useState(0);
    const [openSettingsModal, setOpenNewConversationModal] = useState(false);

    useEffect(() => {
        setSocket(io('http://localhost:8080/', { query: `token=${token.encoded}` }));
    }, [token]);

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('connected client');
        });

        socket.on('new message', ({ message }) => {
            if (!message) {
                console.log('Received Invalid Message');
                return;
            }

            message.timeStamp = new Date(message.timeStamp);

            const updatedConversations = [...conversations];
            conversations.map(conversation => {
                if (conversation.id === message.conversationID) {
                    conversation.messages.push(message);
                }
            });

            setConversations(updatedConversations);
            updateMessageHistoryHeight();
        });

        socket.on('new conversation', ({ conversation }) => {
            if (!conversation) {
                console.log('Received Invalid Conversation');
                return;
            }

            conversation.messages = [];
            conversation.contacts = [];
            const updatedConversations = [...conversations, conversation];
            setConversations(updatedConversations);
        });

        socket.on('deleted conversation', ({ conversation }) => {
            if (!conversation) {
                console.log('Received Invalid Conversation');
                return;
            }

            const updatedConversations = conversations.filter(item => item.id !== conversation.id);

            setConversations(updatedConversations);
        });

        socket.on('disconnect', () => { console.log('disconnected client'); });

        return () => {
            socket.off('new message');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket, conversations]);

    useEffect(() => {
        axios({
            url: `http://localhost:8080/conversations?userID=${token.user.id}`,
            method: 'GET',
            withCredentials: true,
            crossdomain: true,
        }).then(response => {
            const newConversations = [...response.data.conversations];
            newConversations.forEach(conversation => {
                const fixDate = message => message.timeStamp = new Date(message.timeStamp);
                conversation.messages.forEach(fixDate);
                conversation.contacts = [];
            });

            setConversations([...newConversations]);
            // console.log('conversations = ' + JSON.stringify(conversationsArray));
        }).catch(err => {
            //setFormErr(`Error: ${JSON.stringify(err.response.data.message)}`);
            // setFormErr(`Error: ${err.message}`);
        });
    }, []);

    const updateMessageHistoryHeight = () => {
        const newMessageHistoryViewHeight = window.innerHeight - 350;
        setMessageHistoryHeight(newMessageHistoryViewHeight);
    }

    useEffect(() => {
        window.addEventListener('resize', updateMessageHistoryHeight);
        updateMessageHistoryHeight();

        return () => window.removeEventListener('resize', updateMessageHistoryHeight);
    }, []);

    const onMessageSend = (conversationIndex, newMessageText) => {
        const conversation = conversations[conversationIndex];
        const message = new Message(
            conversation.id,
            token.user.id,
            token.user.username,
            newMessageText,
            new Date()
        );

        socket.emit('create message', { message });
    }

    const onCreateConversation = conversation => {
        socket.emit('create conversation', { conversation });
    };

    const onConversationRemove = conversation => {
        const removeConversation = { ...conversation };
        removeConversation.messages = []; // don't need to send messages!

        if (removeConversation.creatorID === token.user.id) {
            socket.emit('delete conversation', { conversation: removeConversation });
        }

        if (removeConversation.creatorID !== token.user.id) {
            socket.emit('leave conversation', { removeConversation });
        }
    }

    const conversationItems = conversations.map((conversation, index) => {
        return (
            <ListGroup.Item key={index} action href={`#${index}`}>
                <h3>{conversation.conversationName}</h3>
            </ListGroup.Item>
        );
    });

    const conversationTabs = conversations.map((conversation, conversationIndex) => {
        const tabStyle = {
            backgroundColor: '#f5f5f5',
            height: `${messageHistoryHeight}px`,
            maxHeight: `${messageHistoryHeight}px`,
            overflowY: 'auto'
        };

        return (
            <Tab.Pane key={conversationIndex} eventKey={`#${conversationIndex}`}>
                <ConversationMessaging conversationIndex={conversationIndex} conversation={conversation} style={tabStyle} onMessageSend={onMessageSend} token={token} onConversationRemove={onConversationRemove} />
            </Tab.Pane>
        );
    });

    const conversationListStyle = {
        maxHeight: `${messageHistoryHeight}px`,
        overflowY: 'auto'
    };

    return (
        <Tab.Container defaultActiveKey='#0'>
            <Row>
                <Col xs={3}>
                    <Row>
                        <Col>
                            <Button variant='btn btn-outline-primary m-2' onClick={() => { setOpenNewConversationModal(true) }}>
                                New Conversation
                            </Button>
                            <CreateConversationModal show={openSettingsModal} onCreateConversation={onCreateConversation} handleClose={() => { setOpenNewConversationModal(false) }} user={token.user} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ListGroup as='ul' style={conversationListStyle}>
                                {conversationItems}
                            </ListGroup>
                        </Col>
                    </Row>
                </Col>
                <Col xs={9}>
                    <Tab.Content>
                        {conversationTabs}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}