// import { useState } from "react";
import { Modal } from "react-bootstrap";
// import { From, Input } from "../../../utils/Form";

const UpdateDetails = (props) => {
  let { onHide, show, batch } = props;

  return (
    <Modal
      centered
      size="lg"
      {...props}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Update Batch
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="row mt-3 py-3">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-secondary btn-regular mr-2"
            >
              CLOSE
            </button>
            <div style={{ width: "20px" }} />
            <button className="btn btn-primary btn-regular" type="submit">
              UPDATE BATCH
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateDetails;
