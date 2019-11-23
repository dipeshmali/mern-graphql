import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Model from '../components/Modal/Model';
import './Auth.css'
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner';
import { success, error } from '../components/Toast';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModel: false,
            createEventModel: false,
            viewEventModel: false,
            events: [],
            selectedEvent: null,
            loading: false
        }
        this.name = React.createRef();
        this.price = React.createRef();
        this.date = React.createRef();
        this.description = React.createRef();
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchEvents()
    }

    handleModal = (modelName) => {
        if (modelName === 'createEvent') {
            this.setState({
                showModel: !this.state.showModel,
                createEventModel: !this.state.createEventModel
            })
        }
        else if (modelName === 'viewEvent') {
            this.setState({
                showModel: !this.state.showModel,
                viewEventModel: !this.state.viewEventModel
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const name = this.name.current.value;
        const price = +this.price.current.value;
        const date = this.date.current.value;
        const description = this.description.current.value;
        const event = { name, price, date, description }
        console.log(event);
        const token = this.context.token;
        const requestBody = {
            query: `
                mutation{
                    createEvent(eventInput: {name:"${name}",price:${price} ,date:"${date}",description:"${description}"}){
                        _id
                        name
                        description
                        price
                        date
                        creator {
                            _id
                        }
                    }
                }
             `
        }

        fetch(`http://${window.location.host}/graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(res => {
            return res.json();
        }).then(resData => {
            this.fetchEvents();
            success('You have created new event');
            this.setState({ showModel: false, createEventModel: !this.state.createEventModel });
            console.log('Resp =>', resData);
        }).catch(err => {
            error('Something went wrong while create an event');
            this.setState({ showModel: false, createEventModel: !this.state.createEventModel });
            console.log('Error Create Event =>', err)
        })

    }

    fetchEvents = () => {
        this.setState({ loading: true });
        const requestBody = {
            query: `
                query{
                    events{
                        _id
                        name
                        description
                        price
                        date
                        creator{
                            _id
                            email
                        }
                    }
                }
             `
        }

        fetch(`http://${window.location.host}/graphql`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            return res.json();
        }).then(resData => {
            console.log('Resp =>', resData);
            this.setState({
                events: resData.data.events,
                loading: false,
            })
        }).catch(err => {
            this.setState({ loading: false });
            console.log('Error Fetch Event =>', err)
        })
    }

    showEventDetails = (eventId) => {
        this.handleModal('viewEvent');
        console.log('eventId=>', eventId, this.state.events)
        this.setState((prevState) => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return {
                selectedEvent: selectedEvent
            }
        }, () => {
            console.log('selectedEvent =>', this.state.selectedEvent);
        })
    }

    bookEventHandler = (eventId) => {
        // if (!this.context.token) {
        if (!sessionStorage.getItem('token')) {
            this.setState({ showModel: false })
            return
        }

        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId : "${eventId}"){
                        _id
                        createdAt
                        updatedAt
                    }
                }
             `
        }

        fetch(`http://${window.location.host}/graphql`, {
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
            success('Your booking has been accepted');
            this.setState({ showModel: false, viewEventModel: !this.state.viewEventModel });
        }).catch(err => {
            console.log('Error Fetch Event =>', err)
            error('Something wen wrong while book an event');
            this.setState({ showModel: false, viewEventModel: !this.state.viewEventModel });
        })
    }


    render() {
        return (
            <div className="container">
                {/* <Spinner /> */}
                <React.Fragment>
                    {/* {this.context.token ? */}
                    {sessionStorage.getItem('token') ?
                        <div className="create-event col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto">
                            <p style={{ "fontsize": "15px" }}>&#128516; Start Sharing your own events &#128516;</p>
                            <button onClick={() => this.handleModal('createEvent')}>Create Event</button>
                        </div> : ''
                    }

                    {this.state.loading ? <Spinner /> :
                        <EventList
                            events={this.state.events}
                            // authUserId={this.context.userId}
                            authUserId={sessionStorage.getItem('userId')}
                            onViewDetail={(eventId) => this.showEventDetails(eventId)}
                        />
                    }
                    {this.state.createEventModel ?
                        <div className="event-modal">
                            <Model
                                showModel={this.state.showModel}
                                title="Create Event"
                                toggle={() => this.handleModal('createEvent')}
                                confirm={this.handleSubmit}
                                btnName="Confim"
                            >
                                <form id="eventform" onSubmit={this.handleSubmit} className="cover-caption">
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="title">Title</label>
                                            <input type="text" className="form-control" name="name" ref={this.name} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Price</label>
                                            <input type="number" className="form-control" name="price" ref={this.price} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="date">Date</label>
                                            <input type="datetime-local" className="form-control" name="date" ref={this.date} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <textarea rows="3" cols="50" className="form-control" name="description" ref={this.description} required></textarea>
                                        </div>
                                    </div>
                                </form>
                            </Model>
                        </div> : null}

                    {this.state.viewEventModel ?
                        <div className="event-details-modal">
                            <Model
                                showModel={this.state.showModel}
                                title="Event Details"
                                toggle={() => this.handleModal('viewEvent')}
                                confirm={() => this.bookEventHandler(this.state.selectedEvent._id)}
                                // btnName={this.context.token ? 'Book' : 'Confirm'}
                                btnName={sessionStorage.getItem('token') ? 'Book' : 'Confirm'}
                            >
                                <h3>{this.state.selectedEvent.name}</h3>
                                <h4>${this.state.selectedEvent.price} - {new Date(parseInt(this.state.selectedEvent.date)).toLocaleDateString()}</h4>
                                <h5>{this.state.selectedEvent.description}</h5>
                            </Model>
                        </div> : null}
                </React.Fragment>
            </div>
        )
    }
}
export default Event;
