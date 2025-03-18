import React from "react";
import { Modal } from "react-bootstrap";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import Table from "react-bootstrap/Table";

const Check = (props) => {
  const { onHide,instituteData } = props;

const isValidContact = (contact) => {
    const pattern = /^[0-9]{10}$/; // 10-digit number
    return contact && pattern.test(contact);
  };
  

  const isValidEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email && pattern.test(email);
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
            {props?.notFoundData?.length > 0 ? (
              <>
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date of Pitching</th>
                      <th>Student Name</th>
                      <th>Course Name</th>
                      <th>Course Year</th>
                      <th>Institution</th>
                      <th>Program Name</th>
                      <th>Phone</th>
                      <th>WhatsApp Number</th>
                      <th>Email</th>
                      <th>Remarks</th>
                      <th>SRM Name</th>
                      <th>Medha Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props?.notFoundData?.map((obj, i) => (
                      <tr key={i}>
                        <td>{obj.index}</td>
                        <td className={!obj.date_of_pitching ? "text-danger" : ""}>
                          {obj.date_of_pitching || "No data"}
                        </td>
                        <td className={!obj.student_name ? "text-danger" : ""}>
                          {obj.student_name || "No data"}
                        </td>
                        <td className={!obj.course_name ? "text-danger" : ""}>
                          {obj.course_name || "No data"}
                        </td>
                        <td className={obj.course_year  ? "" : "text-danger"}>
                          {obj.course_year || "No data"}
                        </td>
                        <td className={(obj.institution) ? "" : "text-danger"}>
                          {obj.institution || "No data"}
                        </td>
                        <td className={(obj.program_name) ? "" : "text-danger"}>
                          {obj.program_name || "No data"}
                        </td>
                        <td className={!isValidContact(obj.phone) ? "text-danger" : ""}>
                          {obj.phone || "No data"}
                        </td>
                        <td className={!isValidContact(obj.whatsapp_number) ? "text-danger" : ""}>
                          {obj.whatsapp_number || "No data"}
                        </td>
                        <td className={!isValidEmail(obj.email) ? "text-danger" : ""}>
                          {obj.email || "No data"}
                        </td>
                        <td className={!obj.remarks ? "text-danger" : ""}>
                          {obj.remarks || "No data"}
                        </td>
                        <td className={!obj.srm_name ? "text-danger" : ""}>
                          {obj.srm_name || "No data"}
                        </td>
                        <td className={!obj.medha_area ? "text-danger" : ""}>
                          {obj.medha_area || "No data"}
                        </td>
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
              There are 1 or more incorrect data in the Excel. Please correct the ones shown in red and reupload the file.
            </h6>
            {(isSRM() || isAdmin()) && (
              <div className="row mb-4">
                <div className="col-md-12 d-flex justify-content-center">
                  {props?.notFoundData?.length === 0 ? (
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
