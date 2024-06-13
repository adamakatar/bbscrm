import React from "react";
import { Modal, Button } from "react-bootstrap";

function CallingModal({ show, onHide, phoneNumber, muted, toggleMute }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{`Calling...`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{`Connecting to ${phoneNumber}`}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={toggleMute}>
          {muted ? "Unmute" : "Mute"}
        </Button>
        <Button variant="danger" onClick={onHide}>
          Hang Up
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CallingModal;
