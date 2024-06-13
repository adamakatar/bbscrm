import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { useSelector } from "react-redux";

function ContactsModal({ show, onHide }) {
  const { addedContacts } = useSelector(
    (state) => state?.conversationReducer
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          You added contacts from CSV file. Please check this
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {addedContacts?.map((contact, index) => (
              <tr key={`index`}>
                <td>{index + 1}</td>
                <td>{contact.firstName}</td>
                <td>{contact.lastName}</td>
                <td>{contact.contact}</td>
                <td>{contact.email}</td>
                <td>{contact.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <span>
          <b> Warning: </b>Some contacts were ignored due to missing required fields
        </span>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ContactsModal;
