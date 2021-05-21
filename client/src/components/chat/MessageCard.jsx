import React from 'react';
import { Card, } from 'react-bootstrap';
// import img from '../../wood1.jpg';

export default ({ message, style }) => {
    return (
        <Card className="mb-2 mx-auto" style={{ ...style, minWidth: '140px' }}>
            {/* <Card.Img src={img} alt="Card image" style={{ height: style.height }} />
            <Card.ImgOverlay> */}
            <Card.Header className='text-muted' style={{ fontFamily: 'Caveat, cursive' }}>
                <h5>{message.authorUsername}</h5>
            </Card.Header>
            <Card.Body>
                <Card.Text>{message.messageText}</Card.Text>
            </Card.Body>
            <Card.Footer>
                <Card.Text className='text-muted'>
                    <small>
                        {`${message.timeStamp.toLocaleTimeString()}, `}
                        <span style={{ display: 'inline-block' }}>{message.timeStamp.toDateString()}</span>
                    </small>
                </Card.Text>
            </Card.Footer>
            {/* </Card.ImgOverlay> */}
        </Card >
    );
}