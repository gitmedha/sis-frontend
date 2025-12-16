import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Deletepopup = (props) => {
    const handleClose = () => props.setShowModal();

    return (
        <Modal show={true} centered>
            <Modal.Body className="text-center p-4">
            <h4 className="mb-3 fw-semibold">Delete Confirmation</h4>
                <p className="mb-4">
                Are you sure you want to delete this data permanently?
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Button 
                        variant="outline-secondary" 
                        onClick={handleClose}
                        className="px-4"
                    >
                        No, Keep It
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={props.deleteEntry}
                        className="px-4"
                    >
                        Yes, Delete!
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default Deletepopup;