import React, { memo, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { checkCredentials } from '../utils/Utils';
import Loading from './Loading';

export default memo(({ component: Component, onAuth, token, ...rest }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(
        () => {
            checkCredentials((err, token) => {
                if (token) {
                    onAuth(token);
                }
                else {
                    onAuth(null);
                }

                setIsLoading(false);
            });
        }, [onAuth]);

    return (
        <Route {...rest} render={
            props => {
                if (isLoading) {
                    return (
                        <Loading />
                    );
                }
                else if (!isLoading && !token) {
                    return <Redirect to={{ pathname: rest.redirectPath, state: { from: props.location } }} />;
                }
                else if (!isLoading && token) {
                    return (<Component token={token} {...rest} />);
                }
            }
        } />
    );
});