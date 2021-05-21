import React from 'react';
import { Row, Col, ListGroupItem, Button } from 'react-bootstrap';

export default ({ receiverUsername, receiverEmail, handleCancelSentInventation }) => {
    return (
        <ListGroupItem as={Row} className='d-flex align-content-center' variant='warning'>
            <Col>
                {receiverUsername} | ({receiverEmail})
            </Col>
            <Col>
                <div className='float-right'>
                    <Button className='mr-2' variant='danger' onClick={handleCancelSentInventation}>Cancel</Button>
                </div>
            </Col>
        </ListGroupItem>
    );
}