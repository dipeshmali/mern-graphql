import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner';
import BookingList from '../components/Bookings/BookingList';
import { success, error } from '../components/Toast';
import { BASE_API_URL } from '../config/apiConfig';
import PageLoader from '../components/Spinner/pageloader';

class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            bookings: [],
        }
    }
    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings()
    }

    fetchBookings = () => {
        this.setState({ loading: true });
        const requestBody = {
            query: `
                query{
                    bookings{
                        _id
                        event{
                            _id
                            name 
                            description
                            price 
                            date 
                        }
                    }
                }
             `
        }

        fetch(BASE_API_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(res => {
            return res.json();
        }).then(resData => {
            console.log('Resp =>', resData.data.bookings);
            this.setState({
                bookings: resData.data.bookings,
                loading: false,
            })
        }).catch(err => {
            this.setState({ loading: false });
            console.log('Error Fetch Booking =>', err)
        })
    }

    removeBooking = (bookingId) => {
        this.setState({ loading: true })
        console.log('bookingId =>', bookingId);
        /** Other way to make api call using variables key */
        const requestBody = {
            query: `
                mutation CancelBooking($id : ID!){
                    cancelBooking(bookingId : $id){
                        _id
                    }
                }
             `,
            variables: {
                id: bookingId
            }
        }

        fetch(BASE_API_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(res => {
            return res.json();
        }).then(resData => {
            console.log('Resp =>', resData);
            success('Your booking has been cancelled sucessfully');
            this.setState(prevState => {
                const bookings = prevState.bookings.filter(booking => {
                    return booking._id !== bookingId
                })
                return {
                    bookings: bookings,
                    loading: false,
                }
            });
        }).catch(err => {
            error('Your booking has not been cancelled');
            this.setState({ loading: false });
            console.log('Error Fetch Booking =>', err)
        })
    }

    render() {
        console.log('Loader =>', this.state.loading)
        return (
            <div className="bookings-list">
                {this.state.loading ? <PageLoader /> :
                    (this.state.bookings && this.state.bookings.length > 0) ?
                        <BookingList
                            bookings={this.state.bookings}
                            cancelBooking={this.removeBooking}
                        /> : <div>
                            <h2 className="no-data">You haven't book any event yet.</h2>
                            <span className="no-data" style={{ "fontSize": "100px" }}>&#128539;</span>
                            <NavLink to="/events"><button className="button">Lets book the events</button></NavLink>
                        </div>
                }
            </div>
        )
    }
}
export default Booking;
