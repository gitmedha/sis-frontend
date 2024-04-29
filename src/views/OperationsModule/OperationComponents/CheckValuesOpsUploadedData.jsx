import React from "react";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

const CheckValuesOpsUploadedData = (props) => {
  let { onHide } = props;

  return (
    <>
      <Modal
        centered
        size="xl"
        show={props.show}
        onHide={onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
        id="custom-modal"
        dialogClassName="fullscreen-modal"
      >
        <Modal.Header className="bg-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex align-items-center"
          >
            <h1 className="text--primary bebas-thick mb-0">
              Data Which needs Correction
            </h1>
          </Modal.Title>
        </Modal.Header>
        <>
          <Modal.Body className="bg-white">
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Assigned To</th>
                  <th>Activity Type</th>
                  <th>Institution</th>
                  <th>State</th>
                  <th>Medha Area</th>
                  <th>Batch Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Session Topic</th>
                  <th>Project Funder</th>
                  <th>Guest Name</th>
                  <th>Guest Designation</th>
                </tr>
              </thead>
              <tbody>
                {props.notUploadedData.map((obj, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{obj.assigned_to}</td>
                    <td>{obj.activity_type}</td>
                    <td>{obj.institution}</td>
                    <td>{obj.state}</td>
                    <td>{obj.area}</td>
                    <td>{obj.batch}</td>
                    <td>{obj.start_date}</td>
                    <td>{obj.end_date}</td>
                    <td>{obj.topic}</td>
                    <td>{obj.donor}</td>
                    <td>{obj.guest}</td>
                    <td>{obj.designation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {/* <h1> Upload SuccesFully</h1>
            <Table striped bordered hover responsive size="sm">

             
              <thead>
                <tr>
                  <th>#</th>
                  <th>Assigned To</th>
                  <th>Activity Type</th>
                  <th>Institution</th>
                  <th>State</th>
                  <th>Medha Area</th>
                  <th>Batch Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Session Topic</th>
                  <th>Project Funder</th>
                  <th>Guest Name</th>
                  <th>Guest Designation</th>
                </tr>
              </thead>
              <tbody>
                {props.excelData.map((obj, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{obj.assigned_to}</td>
                    <td>{obj.activity_type}</td>
                    <td>{obj.institution}</td>
                    <td>{obj.state}</td>
                    <td>{obj.area}</td>
                    <td>{obj.batch}</td>
                    <td>{obj.start_date}</td>
                    <td>{obj.end_date}</td>
                    <td>{obj.topic}</td>
                    <td>{obj.donor}</td>
                    <td>{obj.guest}</td>
                    <td>{obj.designation}</td>
                  </tr>
                ))}
              </tbody>
            </Table> */}
          </Modal.Body>
          {(isSRM() || isAdmin()) && (
            <div className="row mt-4 mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  type="button"
                  //   onClick={() => updatevalue()}
                  className="btn btn-primary px-4 mx-4"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => onHide()}
                  className="btn btn-danger px-4 mx-4"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      </Modal>
    </>
  );
};

export default CheckValuesOpsUploadedData;
