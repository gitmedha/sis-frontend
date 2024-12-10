import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import {FaEdit, FaFileUpload,FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { isAdmin, isSRM } from "src/common/commonFunctions";


const UpskillingUpload = (props) => {
    const { onHide } = props;
    const [showForm, setShowForm] = useState(true);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowSpinner(false);
        }, 3000);
        return () => clearTimeout(timer);
      }, []);
  return (
    <>
    <Modal
      centered
      size="lg"
      show={true}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">Upload Student Upskilling Data</h1>
        </Modal.Title>
      </Modal.Header>
      <>
        {showForm ? (
          <Modal.Body className="bg-white">
            {showSpinner ? (
              <div
                className="bg-white d-flex align-items-center justify-content-center "
                style={{ height: "40vh" }}
              >
                <Spinner animation="border" variant="success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <div className="uploader-container d-flex flex-column justify-content-center align-items-center ">
                  <div className="imageUploader">
                    <p className="upload-helper-text">
                      Click Here To Upload{" "}
                    </p>
                    <div className="upload-helper-icon">
                      <FaFileUpload size={30} color={"#257b69"} />
                    </div>
                    <input
                      accept=".xlsx"
                      type="file"
                      multiple={false}
                      name="file-uploader"
                    //   onChange={handleFileChange}
                      className="uploaderInput"
                    />
                  </div>
                  <label className="text--primary latto-bold text-center">
                    Upload File
                  </label>
                </div>
                <div className="d-flex  flex-column  ">
                  {/* {notuploadSuccesFully ? (
                    <div
                      className={`text-danger  d-flex justify-content-center `}
                    >
                      {" "}
                      {notuploadSuccesFully}{" "}
                    </div>
                  ) : (
                    <div
                      className={`text-success d-flex justify-content-center `}
                    >
                      {" "}
                      {fileName}{" "}
                    </div>
                  )} */}
                  {(isSRM() || isAdmin()) && (
                    <div className="row mb-4 mt-2">
                      <div className="col-md-12 d-flex justify-content-center">
                        <button
                          type="button"
                          onClick={() => props.closeThepopus()}
                          className="btn btn-danger px-4 mx-4 mt-2"
                          style={{ height: "2.5rem" }}
                        >
                          Close
                        </button>

                        <button
                          type="button"
                        //   disabled={!nextDisabled}
                        //   onClick={() => uploadDirect()}
                          className="btn btn-primary px-4 mx-4 mt-2"
                          style={{ height: "2.5rem" }}
                        >
                          Next
                        </button>
                      </div>
                      <div className="d-flex justify-content-center ">
                        <p
                          className="text-gradient-warning"
                          style={{ color: "#B06B00" }}
                        >
                          Note : Maximum recomended number of records is 100
                          per excel
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
        ) : (
          <Modal.Body style={{ height: "15rem" }}>
            <div className="mb-5">
              <p
                className="text-success text-center"
                style={{ fontSize: "1.3rem" }}
              >
                {/* <FaEdit size={20} color="#31B89D"  />{" "} */}
                {/* {!uploadNew ? `${<FaEdit size={20} color="#31B89D"  />}${excelData.length} row(s) of data will be uploaded` :`${<FaRegCheckCircle size={20} color="#31B89D"  />} ${excelData.length} row(s) of data uploaded successfully` } */}
                {/* {!uploadNew ? (
                  <>
                    <FaEdit size={20} color="#31B89D" /> {excelData.length}{" "}
                    row(s) of data will be uploaded.
                  </>
                ) : (
                  <>
                    <FaRegCheckCircle size={20} color="#31B89D" />{" "}
                    {excelData.length} row(s) of data uploaded successfully!
                  </>
                )} */}
              </p>
            </div>
            <div className="col-md-12 d-flex justify-content-center">
              <button
                type="button"
                onClick={ ()=>console.log("heheehhehe")}
                className="btn btn-danger px-4 mx-4 mt-2"
                style={{ height: "2.5rem" }}
              >
                Close
              </button>

              {/* {!uploadNew ? (
                <button
                  type="button"
                  // disabled={!nextDisabled}
                  onClick={() => proceedData()}
                  className="btn btn-primary px-4 mx-4 mt-2"
                  style={{ height: "2.5rem" }}
                >
                  Proceed
                </button>
              ) : (
                <button
                  type="button"
                  // disabled={!nextDisabled}
                  onClick={() => uploadNewData()}
                  className="btn btn-primary px-4 mx-4 mt-2"
                  style={{ height: "2.5rem" }}
                >
                  Upload New
                </button>
              )} */}
            </div>
          </Modal.Body>
        )}
      </>
    </Modal>

    {/* <CheckTot
      show={showModalTOT}
      onHide={() => hideShowModal()}
      notUploadedData={notUploadedData}
      excelData={excelData}
      uploadExcel={props.uploadExcel}
    /> */}
  </>
  )
}

export default UpskillingUpload
