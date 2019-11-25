import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
// import AuthPage from './pages/Auth';
// import Event from './pages/Events';
// import Booking from './pages/Bookings';
// import MainNavigation from './components/Navigation/MainNavigation';
// import PrivateRoute from './components/PrivateRoutes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from './context/auth-context';
import PageLoader from './components/Spinner/pageloader';

const AuthPage = lazy(() => import('./pages/Auth'));
const Event = lazy(() => import('./pages/Events'));
const Booking = lazy(() => import('./pages/Bookings'));
const MainNavigation = lazy(() => import('./components/Navigation/MainNavigation'));
const PrivateRoute = lazy(() => import('./components/PrivateRoutes'));

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId) => {
    this.setState({ token: token, userId: userId })
  }

  logout = () => {
    this.setState({ token: null, userId: null })
  }

  render() {
    console.log('Environment :', process.env.NODE_ENV);
    return (
      <div className="App" >
        <Suspense fallback={
          <>
            <PageLoader />
          </>
        }>
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                <Route exact path="/" component={AuthPage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/events" component={Event} />
                <PrivateRoute path="/bookings" component={Booking} />
                <Redirect to="/auth" exact />
              </Switch>
              <ToastContainer />
            </main>
          </AuthContext.Provider>
        </Suspense>
      </div>
    );
  }
}

export default App;
