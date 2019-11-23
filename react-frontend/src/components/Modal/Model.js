import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Model.css';

const Model = (props) => {
    const toggle = () => {
        props.toggle();
    }
    return (
        <Modal isOpen={props.showModel} toggle={toggle}>
            <ModalHeader toggle={toggle}>{props.title}</ModalHeader>
            <ModalBody>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <button className="button" onClick={toggle}>Cancel</button>{' '}
                <button className="button" type="submit" onClick={props.confirm}>{props.btnName}</button>
            </ModalFooter>
        </Modal>
    )
}
export default Model;