import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
export default ({ token, onLogout }) => {
    const history = useHistory();

    const logoutHandler = () => {
        history.push('/home');
        onLogout();
    };

    return (
        <Navbar bg='light' expand='md'>
            <Nav className="container-fluid">
                <Nav.Item className='mr-auto'>
                    <Navbar.Brand href='home'>Messenger</Navbar.Brand>
                </Nav.Item>
                <Nav.Item >
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                </Nav.Item>
                <Navbar.Collapse id='basic-navbar-nav'>
                    {token &&
                        <Nav.Item>
                            <Nav.Link href='dashboard'>Dashboard</Nav.Link>
                        </Nav.Item>}
                    {token &&
                        <Nav.Item>
                            <Nav.Link href='chat'>Chat</Nav.Link>
                        </Nav.Item>}
                    {token &&
                        <Nav.Item>
                            <Nav.Link href='search'>Search</Nav.Link>
                        </Nav.Item>}
                    {token &&
                        <Nav.Item className='ml-auto'>
                            <Nav.Link onClick={logoutHandler}>Logout ({token.user.username})</Nav.Link>
                        </Nav.Item>}
                    {!token &&
                        <Nav.Item className='ml-auto'>
                            <Nav.Link href='/login'>Login</Nav.Link>
                        </Nav.Item>}
                </Navbar.Collapse>
            </Nav>
        </Navbar>
    );
}