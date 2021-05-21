import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export const checkCredentials = (done) => {
    const token = getCookieToken();
    if (!token) {
        return done(null, null);
    }

    // token automatically sent with POST as cookie
    axios({
        url: 'http://localhost:8080/authentication/signin',
        method: 'POST',
        withCredentials: true,
        crossdomain: true,
        data: {}
    }).then(response => {
        const token = getCookieToken();
        return done(null, token);
    }).catch(err => {
        return done(err, null);
    });
}

export const hasCredentials = () => {
    const token = getCookieToken();
    if (token) {
        return true;
    }

    return false;
}

export const getCookieToken = () => {
    const token = Cookies.get('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        decodedToken.encoded = token;
        return decodedToken;
    }

    return null;
}

export const deleteCookieToken = () => {
    Cookies.remove('token');
}