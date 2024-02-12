import React from "react";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { Input } from "../../../utils/Form";
import FileUploader from "../../../components/content/FileUploader";
import * as xlsx from "xlsx";

const Styled = styled.div`
  .icon-box {
    display: flex;
    padding: 5px;
    justify-content: center;
  }
  .cv-icon {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 50%;

    &:hover {
      background-color: #eee;
      box-shadow: 0 0 0 1px #c4c4c4;
    }
  }
  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const options = [
  { value: "feild_activity", label: "Feild Activity" },
  { value: "feild_activity", label: "CollegePitches" },
];
const UploadFile = (props) => {
  let { onHide } = props;
  const [File, setFile] = useState(null);
  const handler = (data) => setFile(data);

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // console.log("worksheet",worksheet);
            const json = xlsx.utils.sheet_to_json(worksheet);
            console.log(json);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
}

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
            <h1 className="text--primary bebas-thick mb-0">Upload Data</h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
          <Modal.Body className="bg-white">
            <Select
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              name="batch"
              options={options}
              onChange={(e) => {
                console.log(e, "program_name");
              }}
            />
            <form>
              <label htmlFor="upload">Upload File</label>
              <input
                type="file"
                name="upload"
                id="upload"
                onChange={readUploadFile}
              />
            </form>
          </Modal.Body>
          {(isSRM() || isAdmin()) && (
            <div className="row mt-4 mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  type="button"
                  // onClick={() => updatevalue()}
                  className="btn btn-primary px-4 mx-4"
                >
                  EDIT
                </button>
                <button
                  type="button"
                  // onClick={() => closeThepopup()}
                  className="btn btn-danger px-4 mx-4"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Styled>
      </Modal>
    </>
  );
};
export default UploadFile;