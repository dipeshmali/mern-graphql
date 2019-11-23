import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './MainNavigation.css';
import AuthContext from '../../context/auth-context';

const mainNavigation = (props) => {
    const token = sessionStorage.getItem('token');
    console.log('Token =>', token);

    const logout = () => {
        sessionStorage.clear();
        props.history.push('/');
    }

    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="main-navigation">
                        <div className="main-navigation_logo">
                            <h1>Easy Event</h1>
                        </div>
                        <div className="header-spaccer"></div>
                        <nav className="main-navigation_item">
                            <ul>
                                {!token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                                <li><NavLink to="/events">Events</NavLink></li>
                                {token &&
                                    <React.Fragment>
                                        <li><NavLink to="/bookings">Bookings</NavLink></li>
                                        <li>
                                            {/* <button onClick={context.logout}>Logout</button> */}
                                            <button onClick={logout}>Logout</button>
                                        </li>
                                    </React.Fragment>
                                }
                            </ul>
                        </nav>
                    </header>
                )
            }}
        </AuthContext.Consumer>
    )
}

export default withRouter(mainNavigation);