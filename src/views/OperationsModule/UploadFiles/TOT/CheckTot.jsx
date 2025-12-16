import React from "react";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import { Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import styled from "styled-components";

const Style = styled.div`
  overflow-x: auto;

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

const CheckTot = (props) => {
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
                        <th>Participant Name </th>
                        <th>Email id</th>
                        <th>Age </th>
                        <th>Gender </th>
                        <th>Mobile no. </th>
                        <th>State </th>
                        <th>City </th>
                        <th>Designation </th>
                        <th>College Name</th>
                        <th>Project Name </th>
                        <th>Partner Department</th>
                        <th>Module Name</th>
                        <th>Start Date </th>
                        <th>End Date </th>
                        <th>Facilitator 1 </th>
                        <th>Facilitator 2 </th>
                        <th>Certificate Given </th>
                        <th>Project Type </th>
                        <th>New Entry </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.notUploadedData.map((obj, i) => (
                        <tr key={i}>
                          <td>{obj.index}</td>

                          <td className={obj.error?.includes("Full Name") ? "text-danger" : ""}>
                            {obj.user_name || "No data"}
                          </td>

                          <td className={obj.error?.includes("Email") ? "text-danger" : ""}>
                            {obj.email || "No data"}
                          </td>

                          <td>{obj.age || "No data"}</td>

                          <td className={obj.error?.includes("Gender") ? "text-danger" : ""}>
                            {obj.gender || "No data"}
                          </td>

                          <td className={obj.error?.includes("Contact") ? "text-danger" : ""}>
                            {obj.contact || "No data"}
                          </td>

                          <td className={obj.error?.includes("State") ? "text-danger" : ""}>
                            {obj.state || "No data"}
                          </td>

                          <td className={obj.error?.includes("City") ? "text-danger" : ""}>
                            {obj.city || "No data"}
                          </td>

                          <td>{obj.designation || "No data"}</td>

                          <td className={obj.error?.includes("College") ? "text-danger" : ""}>
                            {obj.college || "No data"}
                          </td>

                          <td className={obj.error?.includes("Project Name") ? "text-danger" : ""}>
                            {obj.project_name || "No data"}
                          </td>

                          <td className={obj.error?.includes("Government Department") ? "text-danger" : ""}>
                            {obj.partner_dept || "No data"}
                          </td>

                          <td className={obj.error?.includes("Module") ? "text-danger" : ""}>
                            {obj.module_name || "No data"}
                          </td>

                          <td className={obj.error?.includes("Start Date") ? "text-danger" : ""}>
                            {obj.start_date || "No data"}
                          </td>

                          <td className={obj.error?.includes("End Date") ? "text-danger" : ""}>
                            {obj.end_date || "No data"}
                          </td>

                          <td>{obj.trainer_1 || "No data"}</td>

                          <td>{obj.trainer_2 || "No data"}</td>

                          <td>{obj.certificate_given || "No data"}</td>

                          <td className={obj.error?.includes("Project Type") ? "text-danger" : ""}>
                            {obj.project_type || "No data"}
                          </td>

                          <td>{obj.new_entry || "No data"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <div className="d-flex justify-content-center align-content-center">
                  <h2 className="text--primary bebas-thick mb-0">No data found</h2>
                </div>
              )}
            </div>
            <div className="">
              <h6 className="text-danger text-center">
                There are 1 or more incorrect data in the excel. Please correct the ones shown in red and reupload the file
              </h6>
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

export default CheckTot;