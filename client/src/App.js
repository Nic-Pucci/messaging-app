import React, {
  useState,
  useEffect,
  useCallback,
  Fragment
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import NavHeader from './components/NavHeader';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Chat from './components/chat/Chat';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Search from './components/Search';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import {
  getCookieToken,
  deleteCookieToken
} from './utils/Utils';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App(props) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const sessionToken = getCookieToken();
    setToken(sessionToken);
  }, []);

  const onAuth = useCallback((sessionToken) => {
    setToken(sessionToken);
  }, []);

  const onProfileUpdate = useCallback(user => {
    //setToken(sessionToken);
  }, []);

  const onLogout = () => {
    deleteCookieToken();
    setToken(null);
  };

  return (
    <Fragment>
      <Router>
        <NavHeader token={token} onLogout={onLogout} />
        <Switch >
          <Route exact path='/' render={() => <Home />} />
          <Route path='/home' render={() => <Home />} />
          <Route path='/login' render={props => <Login {...props} redirectPath='/dashboard' />} />
          <Route path='/signup' render={props => <Signup {...props} redirectPath='/dashboard' />} />

          <PrivateRoute path='/chat' component={Chat} redirectPath='/login' onAuth={onAuth} token={token} />
          <PrivateRoute path='/search' component={Search} redirectPath='/login' onAuth={onAuth} token={token} />
          <PrivateRoute path='/dashboard' component={Dashboard} redirectPath='/login' onAuth={onAuth} onProfileUpdate={onProfileUpdate} token={token} />
          <PrivateRoute path='/profile' component={Profile} redirectPath='/login' onAuth={onAuth} token={token} />

          <Route path='*' component={NotFound} />
        </Switch>
      </Router>
    </Fragment>
  );
}