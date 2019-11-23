import React from 'react';
import { Route, Redirect } from 'react-router-dom';
const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLogin = sessionStorage.getItem('token') ? true : false;
    return (
        <Route {...rest} render={(props) => (
            isLogin ? <Component {...props} />
                : <Redirect to='/auth' />
        )} />
    )
}
export default PrivateRoute;