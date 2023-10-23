import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Deletepopup = (props) => {
    console.log("props");
    const handleClose = () => props.setShowModal();

  return (
    <>
      <Modal show={true} >
        <Modal.Header >
          <Modal.Title>Are you sure</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure, You want to delete this</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={()=>props.deleteEntry()} >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Deletepopup
