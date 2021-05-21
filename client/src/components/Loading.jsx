import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

export default () => {
    return (
        <Container fluid className='h-100'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation='border' role='status' variant='primary'>
                    <span className='sr-only'>Loading...</span>
                </Spinner>
            </div>
        </Container>
    );
}