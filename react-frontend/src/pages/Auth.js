import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import { success, error } from '../components/Toast';
// import Authform from '../components/Forms/auth';

class AuthPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogin: true
        }
        this.email = React.createRef();
        this.password = React.createRef();
    }

    static contextType = AuthContext;

    switchHandler = () => {
        this.setState({
            isLogin: !this.state.isLogin
        })
    }


    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.email.current.value;
        const password = this.password.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        console.log(email, password);

        let requestBody = {
            query: `
                query{
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        /** If user in singup form then */
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                mutation{
                    createUser(userInput:{email:"${email}", password:"${password}"}){
                        _id
                        email
                    }
                }
             `
            }
        }

        fetch('http://localhost:8080/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(resData => {
            console.log('Resp =>', resData);
            document.getElementById("authform").reset();
            if (resData.data && resData.data.login && resData.data.login.token) {
                success('You are login successfully');
                const { token, userId, tokenExpiration } = resData.data.login
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userId', userId);
                this.context.login(token, userId, tokenExpiration);
                this.props.history.push('/events');
            }
            if (resData.data && resData.data.createUser) {
                success('You are Register successfully');
            }
            if (resData.data === null) {
                error(resData.errors[0].message); // login  error
            }
            else if (resData.data.createUser === null) { // sign up error
                error(resData.errors[0].message);
            }
        }).catch(err => {
            console.log('Error =>', err)
        })
    }

    render() {
        return (
            <div className="container">
                <form id="authform" onSubmit={this.handleSubmit} className="cover-caption">
                    <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto">
                        <caption className="caption">{this.state.isLogin ? 'Login' : 'Sign Up'}</caption>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" name="email" ref={this.email} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Password</label>
                            <input type="password" className="form-control" name="password" ref={this.password} required />
                        </div>
                        <div>
                            <button type="submit" className="button">Submit</button> &nbsp; &nbsp;
                            <button type="button" onClick={this.switchHandler} className="button">Switch to {this.state.isLogin ? 'SignUp' : 'Login'}</button>
                        </div>
                        {/* <Authform submitData={this.handleSubmit} /> */}
                    </div>
                </form>
            </div>
        )
    }
}
export default AuthPage;
