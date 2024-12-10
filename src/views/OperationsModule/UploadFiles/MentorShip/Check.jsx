import React from "react";
import { Modal } from "react-bootstrap";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import styled from "styled-components";

const Check = (props) => {
  let { onHide } = props;

  const isValidContact=(contact) =>{
    const pattern = /^[0-9]{10}$/; // Regex for 10-digit number
    return contact && pattern.test(contact);
  }
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
      >
        <Modal.Header className="bg-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex align-items-center"
          >
            <h1 className="text--primary bebas-thick mb-0">
              <p>Data Validation Failures</p>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white hide-scrollbar">
          <div style={{ width: "100%", height: "450px", overflow: "scroll" }}>
            {props.notUploadedData.length > 0 ? (
              <>
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Assigned To</th>
                      <th>Mentor Name</th>
                      <th>Email</th>
                      <th>Mentor Domain</th>
                      <th>Mentor Company Name</th>
                      <th>Designation</th>
                      <th>Mentor Area</th>
                      <th>Mentor State</th>
                      <th>Outreach</th>
                      <th>Onboarding Date</th>
                      <th>Social Media Profile</th>
                      <th>Medha Area</th>
                      <th>Status</th>
                      <th>Program Name</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.notUploadedData.map((obj, i) => (
                      <tr key={i}>
                        <td>{obj.index}</td>
                        <td className={!obj.assigned_to ? "text-danger" : ""}>
                          {obj.assigned_to || "No data"}
                        </td>
                        <td className={!obj.mentor_name ? "text-danger" : ""}>
                          {obj.mentor_name || "No data"}
                        </td>
                        <td className={!obj.email ? "text-danger" : ""}>
                          {obj.email || "No data"}
                        </td>
                        <td className={!obj.mentor_domain ? "text-danger" : ""}>
                          {obj.mentor_domain || "No data"}
                        </td>
                        <td
                          className={
                            !obj.mentor_company_name ? "text-danger" : ""
                          }
                        >
                          {obj.mentor_company_name || "No data"}
                        </td>
                        <td className={!obj.designation ? "text-danger" : ""}>
                          {obj.designation || "No data"}
                        </td>
                        <td className={!obj.mentor_area ? "text-danger" : ""}>
                          {obj.mentor_area || "No data"}
                        </td>
                        <td className={!obj.mentor_state ? "text-danger" : ""}>
                          {obj.mentor_state || "No data"}
                        </td>
                        <td className={!obj.outreach ? "text-danger" : ""}>
                          {obj.outreach || "No data"}
                        </td>
                        <td
                          className={!obj.onboarding_date ? "text-danger" : ""}
                        >
                          {obj.onboarding_date || "No data"}
                        </td>
                        <td>
                          {obj.social_media_profile_link || "No data"}
                        </td>
                        <td className={!obj.medha_area ? "text-danger" : ""}>
                          {obj.medha_area || "No data"}
                        </td>
                        <td className={!obj.status ? "text-danger" : ""}>
                          {obj.status || "No data"}
                        </td>
                        <td className={!obj.program_name ? "text-danger" : ""}>
                          {obj.program_name || "No data"}
                        </td>
                        <td className={!isValidContact(obj.contact) ? "text-danger" : ""}>
                          {obj.contact || "No data"}
                        </td>
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
          <div className="">
            <h6 className="text-danger text-center">
              There are 1 or more incorrect data in the Excel. Please correct
              the ones shown in red and reupload the file.
            </h6>
            {(isSRM() || isAdmin()) && (
              <div className="row mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                  {props.notUploadedData.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => props.uploadExcel(props.excelData)}
                      className="btn btn-primary px-4"
                    >
                      Upload
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary px-4"
                      onClick={() => onHide()}
                    >
                      ReUpload
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Check;
