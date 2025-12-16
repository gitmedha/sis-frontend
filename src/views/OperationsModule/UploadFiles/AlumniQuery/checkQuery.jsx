import React from "react";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import styled from "styled-components";
import { isNumber } from "lodash";

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
`;

const CheckQuery = (props) => {
    let { onHide } = props;
    const pattern = /^[0-9]{10}$/;
    console.log(props.notUploadedData);

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
                                                <th>Student Name</th>
                                                {/* <th>Student ID</th> */}
                                                <th>Father Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Location</th>
                                                <th>Query Type</th>
                                                <th>Query Start Date</th>
                                                <th>Query End Date</th>
                                                <th>Query Description</th>
                                                <th>Conclusion</th>
                                                <th>Status</th>
                                                {/* <th>New Entry</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {props.notUploadedData.map((obj, i) => (
                                                <tr key={i}>
                                                    {/* # */}
                                                    <td>{obj.index}</td>

                                                    {/* Student Name */}
                                                    <td className={obj.student_name?.notFound ? "text-danger" : ""}>
                                                        {obj.student_name?.value
                                                            ? obj.student_name.value
                                                            : obj.student_name || "Please select from dropdown"}
                                                    </td>

                                                    {/* Student ID */}
                                                    {/* <td className={obj.student_id?.notFound ? "text-danger" : ""}>
                                                        {obj.student_id?.value
                                                            ? obj.student_id.value
                                                            : obj.student_id || "Please provide Student ID"}
                                                    </td> */}

                                                    {/* Father Name */}
                                                    <td className={obj.father_name?.notFound ? "text-danger" : ""}>
                                                        {obj.father_name?.value
                                                            ? obj.father_name.value
                                                            : obj.father_name || "Please provide Father Name"}
                                                    </td>

                                                    {/* Email */}
                                                    <td className={obj.email?.notFound ? "text-danger" : ""}>
                                                        {obj.email?.value
                                                            ? obj.email.value
                                                            : obj.email || "Please provide Email"}
                                                    </td>

                                                    {/* Phone */}
                                                    <td className={obj.phone?.notFound ? "text-danger" : ""}>
                                                        {obj.phone?.value
                                                            ? obj.phone.value
                                                            : obj.phone || "Please provide Phone"}
                                                    </td>

                                                    {/* Location */}
                                                    <td className={obj.location?.notFound ? "text-danger" : ""}>
                                                        {obj.location?.value
                                                            ? obj.location.value
                                                            : obj.location || "Please provide Location"}
                                                    </td>

                                                    {/* Query Type */}
                                                    <td className={obj.query_type?.notFound ? "text-danger" : ""}>
                                                        {obj.query_type?.value
                                                            ? obj.query_type.value
                                                            : obj.query_type || "Please select Query Type"}
                                                    </td>

                                                    {/* Query Start Date */}
                                                    <td className={obj.query_start?.notFound ? "text-danger" : ""}>
                                                        {obj.query_start?.value
                                                            ? obj.query_start.value
                                                            : obj.query_start || "Please provide Start Date"}
                                                    </td>

                                                    {/* Query End Date */}
                                                    <td className={obj.query_end?.notFound ? "text-danger" : ""}>
                                                        {obj.query_end?.value
                                                            ? obj.query_end.value
                                                            : obj.query_end || "Please provide End Date"}
                                                    </td>

                                                    {/* Query Description */}
                                                    <td className={obj.query_desc?.notFound ? "text-danger" : ""}>
                                                        {obj.query_desc?.value
                                                            ? obj.query_desc.value
                                                            : obj.query_desc || "Please provide Query Description"}
                                                    </td>

                                                    {/* Conclusion */}
                                                    <td className={obj.conclusion?.notFound ? "text-danger" : ""}>
                                                        {obj.conclusion?.value
                                                            ? obj.conclusion.value
                                                            : obj.conclusion || "Please provide Conclusion"}
                                                    </td>

                                                    {/* Status */}
                                                    <td className={obj.status?.notFound ? "text-danger" : ""}>
                                                        {obj.status?.value
                                                            ? obj.status.value
                                                            : obj.status || "Please provide Status"}
                                                    </td>

                                                    {/* New Entry */}
                                                    {/* <td>{obj.new_entry}</td> */}
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
                            <h6 className="text-danger text-center">There are 1 or more incorrect data in the excel. Please correct the ones shown in red and reupload the file</h6>
                            {(isSRM() || isAdmin()) && (
                                <div className="row mb-4">
                                    <div className="col-md-12 d-flex justify-content-center">
                                        {props.notUploadedData.length === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => props.uploadExcel(props.excelData)}
                                                className="btn btn-primary px-4 "
                                            >
                                                Upload
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-primary px-4 "
                                                onClick={() => onHide()}
                                            >
                                                ReUpload
                                            </button>
                                        )}
                                    </div>
                                </div>

                            )}
                            <div />
                        </div>

                    </Modal.Body>

                </Style>
            </Modal>
        </>
    );
};

export default CheckQuery;