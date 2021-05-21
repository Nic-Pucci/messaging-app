import React from 'react';
import { Row, Col, ListGroupItem, Button } from 'react-bootstrap';

export default ({ token, contactName, contactEmail }) => {
    return (
        <ListGroupItem as={Row} className='d-flex align-content-center' variant='primary'>
            <Col>
                {contactName} | ({contactEmail})
            </Col>
        </ListGroupItem>
    );
}