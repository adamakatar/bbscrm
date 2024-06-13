import React from 'react'
import Alert from 'react-bootstrap/Alert';

export function AlertDismissibleExample({ show, changeStatus }) {

    if (show) {
      return (
        <Alert variant="danger" onClose={() => changeStatus(!show)} dismissible>
          <Alert.Heading>Oh snap! Please register contacts</Alert.Heading>
          <p>
            You can call only registered numbers.
          </p>
        </Alert>
      );
    }
}