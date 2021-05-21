import React from 'react';
import { Row, Col, ListGroupItem, Button } from 'react-bootstrap';

export default ({ senderUsername, senderEmail }) => {
    return (
        <ListGroupItem as={Row} className='d-flex align-content-center' variant='warning'>
            <Col>
                {senderUsername} | ({senderEmail})
            </Col>
            <Col>
                <div className='float-right'>
                    <Button className='mr-2' variant='success'>Accept</Button>
                    <Button className='mr-2' variant='danger'>Decline</Button>
                </div>
            </Col>
        </ListGroupItem>
    );
}