import React from 'react';
import { Row, Col, ListGroupItem, Button } from 'react-bootstrap';

export default ({ username, email, handleContactInvitation }) => {
    return (
        <ListGroupItem as={Row} className='d-flex align-content-center' variant=''>
            <Col>
                {username} | ({email})
            </Col>
            <Col>
                <div className='float-right'>
                    <Button className='mr-2' variant='primary' onClick={handleContactInvitation}>Invite</Button>
                </div>
            </Col>
        </ListGroupItem>
    );
}