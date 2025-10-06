import React from "react";
import { Modal } from "react-bootstrap";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import styled from "styled-components";

const Check = (props) => {
  let { onHide } = props;

  const isValidContact = (contact) => {
    const pattern = /^[0-9]{10}$/; // Regex for 10-digit number
    return contact && pattern.test(contact);
  };
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
                      <th>Index</th>
                      <th>Assigned To</th>
                      <th>Student ID</th>
                      <th>Institution</th>
                      <th>Batch</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Course Name</th>
                      <th>Certificate Received</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>Issuing Organization</th>
                      <th>Program Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.notUploadedData.map((newItem, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {console.log(newItem)
                        }
                        <td className={ newItem.assigned_to?.notFound ?"text-danger":""}>{newItem.assigned_to?.notFound ? newItem.assigned_to.value:newItem.assigned_to}</td>
                        <td className={ newItem.student_id?.notFound || newItem?.student_id =="No Data" ?"text-danger":""}>{newItem.student_id.value || newItem.student_id || ""}</td>
                        <td className={ newItem.institution?.notFound ?"text-danger":""}>{newItem.institution?.notFound ?newItem.institution.value :newItem.institution}</td>
                        <td className={ newItem.batch?.notFound ?"text-danger":""}>{newItem.batch?.notFound ? newItem.batch.value :newItem.batch}</td>
                        <td className={newItem.start_date?.notFound ?"text-danger":""}>{newItem.start_date?.notFound ? newItem.start_date.value:newItem.start_date}</td>
                          <td className={ newItem.end_date?.notFound ?"text-danger":""}>{newItem.end_date?.notFound ?newItem.end_date.value:newItem.end_date}</td>
                          
                        <td  className={ newItem.course_name?.includes('No') ?"text-danger":""}>{newItem.course_name || ""}</td>
                        <td  className={ newItem.certificate_received.includes('No') ?"text-danger":""}>{newItem.certificate_received || ""}</td>
                        <td className={ newItem.category.includes('No') ?"text-danger":""}>{newItem.category || ""}</td>
                        <td className={ newItem.sub_category.includes('No') ?"text-danger":""}>{newItem.sub_category || ""}</td>
                        <td>{newItem.issued_org || ""}</td>
                        <td>{newItem.program_name || ""}</td>
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
