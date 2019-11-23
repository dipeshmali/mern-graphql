import React from 'react';

import EventItem from '../EventItem';

const EventList = (props) => {
    const events = props.events.map(event => {
        return <EventItem
            id={event._id}
            name={event.name}
            price={event.price}
            date={event.date}
            authUserId={props.authUserId}
            creatorId={event.creator._id}
            onDetail={props.onViewDetail}
        />
    })
    return (
        <ul className="events__list">
            {events}
        </ul>
    )
}
export default EventList;