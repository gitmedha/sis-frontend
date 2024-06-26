import React from "react";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import styled from "styled-components";

const Style = styled.div`
  overflow-x: auto;
  // width: 120%;

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  td {
    width: 250px !important;
  }
  overflow: hidden;
  .border-danger{
    border-color: 5px solid red;
  }
`;

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
        className="form-modal "
        id="custom-modal"
        // dialogClassName="fullscreen-modal"
      >
        <Modal.Header className="bg-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex align-items-center"
          >
            <h1 className="text--primary bebas-thick mb-0">
              <p> Data Validation Failures</p>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Style>
          <Modal.Body className="bg-white hide-scrollbar">
            <div style={{ width: "100%", height: "450px", overflow: "scroll" }}>
              {props.notUploadedData.length > 0 ? (
                <>
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
                          <td>{obj.index}</td>
                          <td className={obj.assigned_to.notFound ?"text-danger":""}>{obj.assigned_to.value ?obj.assigned_to.value:'N/A'}</td>
                          <td>{obj.activity_type}</td>
                          <td className={obj.institution.notFound ?"text-danger":""}>{obj.institution.value ?obj.institution.value:'N/A'}</td>
                          <td>{obj.state}</td>
                          <td>{obj.area}</td>
                          <td className={obj.batch.notFound ?"text-danger":""}>{obj.batch.value ?obj.batch.value :'N/A'}</td>
                          <td className={obj.start_date.notFound ?"text-danger":""}>{obj.start_date.value ? obj.start_date.value :'N/A'}</td>
                          <td className={obj.end_date.notFound ?"text-danger":""}>{obj.end_date.value ?obj.end_date.value:'N/A'}</td>
                          <td>{obj.topic}</td>
                          <td>{obj.donor}</td>
                          <td>{obj.guest}</td>
                          <td>{obj.designation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <div className="d-flex justify-content-center align-content-center">
                  <h2 className="text--primary bebas-thick mb-0"></h2>
                </div>
              )}
              
            </div>
            <h6 className="text-danger">
              Please check Activity type, Institution, batch ,Start Date and End
              Date ,Assigned To Data
            </h6>
          </Modal.Body>
          {(isSRM() || isAdmin()) && (
            <div className="row mt-4 mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                {props.notUploadedData.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => props.uploadExcel(props.excelData)}
                    className="btn btn-primary px-4 mx-4"
                  >
                    Upload
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary px-4 mx-4"
                    onClick={() => onHide()}
                  >
                    ReUpload
                  </button>
                )}
              </div>
            </div>
          )}
        </Style>
      </Modal>
    </>
  );
};

export default CheckValuesOpsUploadedData;
