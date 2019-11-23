import React from 'react';
import './booking.css';
const BookingList = (props) => {
    return (
        <ul className="bookings_list">
            {
                props.bookings.map((booking) => {
                    const { event } = booking;
                    console.log('DAte =>', event.date)
                    return (
                        <li className="bookings_item">
                            <div className="bookings_item-data">
                                {event.name}{' '}{new Date(parseInt(event.date)).toLocaleDateString()}
                            </div>
                            <div className="bookings_item-actions">
                                <button className="button" onClick={props.cancelBooking.bind(this, booking._id)}>Cancel Booking</button>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default BookingList;