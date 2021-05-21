import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default ({ conversationName }) => {

    return (
        <Row>
            <Col>
                <h3>{conversationName}</h3>
            </Col>
        </Row>
    );
}