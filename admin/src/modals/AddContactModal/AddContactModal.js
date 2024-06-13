import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddContactModal({ show, onHide, newContact, handleInputChange, handleSubmit }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <div className="d-flex justify-content-between">
              <div className="w-50 pr-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  className="w-100"
                  value={newContact.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="w-50 pl-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  className="w-100"
                  value={newContact.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="contact"
              value={newContact.contact}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contact Type</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={newContact.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="broker">Broker</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="lawyer">Lawyer</option>
              <option value="accountant">Accountant</option>
              <option value="job applicant">Job Applicant</option>
              <option value="title company">Title Company</option>
              <option value="3rd party contact">3rd Party Contact</option>
              <option value="service provider">Service Provider</option>
            </Form.Control>
          </Form.Group>
          <Button type="submit" className='mt-2 w-100' >Submit</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default AddContactModal;
