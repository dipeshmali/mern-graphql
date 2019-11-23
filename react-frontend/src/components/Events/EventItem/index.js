import React from 'react';

const EventItem = (props) => {
    return (
        <li className="events_list-item" key={props.id}>
            <div>
                <h1>{props.name}</h1>
                <h2>${props.price}</h2>
            </div>
            <div>
                {props.authUserId === props.creatorId
                    ? <p>You are the owener of event</p> :
                    <button onClick={props.onDetail.bind(this, props.id)}>View Details</button>
                }
            </div>
        </li>
    )
}
export default EventItem;