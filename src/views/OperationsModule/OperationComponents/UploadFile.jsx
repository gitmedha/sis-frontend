import React from "react";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from "react-select";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { Input } from "../../../utils/Form";
import FileUploader from "../../../components/content/FileUploader";
import * as xlsx from "xlsx";
import {
  GET_ALL_BATCHES,
  GET_ALL_BATCHS,
  GET_ALL_INSTITUTES,
} from "../../../graphql";
import { queryBuilder } from "../../../apis";
import {
  getAllMedhaUsers,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import { FaFileCsv, FaFileImage, FaFileUpload } from "react-icons/fa";
import CheckValuesOpsUploadedData from "./CheckValuesOpsUploadedData";
import Papa from "papaparse";

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
  .uploader-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Center horizontally */
    justify-content: center; /* Center vertically */
  }
  
 
`;

const options = [
  { value: "feild_activity", label: "Field Activity" },
  { value: "collegePitch", label: "Pitching" },
];
const UploadFile = (props) => {
  let { onHide } = props;
  const [File, setFile] = useState(null);
  const handler = (data) => setFile(data);
  const [batchOption, setBatchOption] = useState([]);
  const [institutionOption, setInstituteOption] = useState([]);
  const [assigneOption, setAssigneeOption] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [fileType, setFileType] = useState("");
  const [uploadSuccesFully,setUploadSuccesFully]=useState('')
  const [showModal, setShowModal] = useState(false);


  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadSuccesFully(file.name);
    if (file) {
      const reader = new FileReader();
      // setUploadSuccesFully()
      reader.onload = () => {

        convertCSV(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const convertCSV = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        const formattedData = [];
  const notFoundData = [];

  results.data.forEach(item => {
    // Map each value to its corresponding header
    const newItem = {};
    Object.keys(item).forEach(key => {
      newItem[key] = item[key];
    });

    const batchId = batchOption.find(
      (batch) => batch.name === newItem["Batch Name"]
    )?.id;
    const instituteId = institutionOption.find(
      (institute) => institute.name === newItem["Educational Institution"]
    )?.id;
    const userId = assigneOption.find(
      (user) => user.name === newItem["Assigned To"]
    )?.id;
    // const startDate = (newItem["Start Date"]);
    // const endDate = convertExcelDateToJSDate(newItem["End Date"]);
    // Set donor based on condition
    const donor = newItem["Project / Funder"] && newItem["Project / Funder"].toLowerCase() === "no" ? false : true;
    const currentUser = localStorage.getItem("user_id");
    if (batchId === undefined || instituteId === undefined || userId === undefined) {
      notFoundData.push({
        institution: newItem["Educational Institution"],
        batch: newItem["Batch Name"],
        state: newItem["State"] || "",
        start_date: newItem["Start Date"],
        end_date: newItem["End Date"],
        topic: newItem["Session Topic"] || "",
        donor: newItem["Project / Funder"] || "",
        guest: newItem["Guest Name "] || "",
        designation: newItem["Guest Designation"] || "",
        organization: newItem["Organization"] || "",
        activity_type: newItem["Activity Type"] || "",
        assigned_to: newItem["Assigned To"] || "",
        area: newItem["Medha Area"] || "",
      });
    } else {
      formattedData.push({
        institution: instituteId,
        batch: batchId,
        state: newItem["State"] || "",
        start_date: newItem['Start Date'],
        end_date: newItem['End Date'],
        topic: newItem["Session Topic"] || "",
        donor: donor,
        guest: newItem["Guest Name "] || "",
        designation: newItem["Guest Designation"] || "",
        organization: newItem["Organization"] || "",
        activity_type: newItem["Activity Type"] || "",
        assigned_to: userId || "",
        area: newItem["Medha Area"] || "",
        isactive: true,
        createdby: userId,
        updatedby: currentUser,
      });
    }
  });
  setExcelData(formattedData)
  setNotuploadedData(notFoundData)
}
      
    });
  };


  

  useEffect(() => {
    const getbatch = async () => {
      await getAllBatchs();
      const instutiondata = await getAllInstitute();
      let data = await getAllMedhaUsers();
      setInstituteOption(instutiondata);
      setAssigneeOption(data);
    };

    getbatch();
  }, [props]);

  const getAllBatchs = async () => {
    try {
      let { data } = await queryBuilder({
        query: GET_ALL_BATCHES,
      });
      setBatchOption(data.batches);
    } catch (err) {}
  };

  const getAllInstitute = async () => {
    try {
      let { data } = await queryBuilder({
        query: GET_ALL_INSTITUTES,
      });
      return data.institutions;
    } catch (err) {}
  };






 

const hideShowModal =()=>{
  setShowModal(false)
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
            {/* <Select
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              name="batch"
              options={options}
              onChange={(e) => {
                setFileType(e.value);
              }}
            /> */}
           
            <div className="uploader-container">
              <div className="imageUploader">
                <p className="upload-helper-text">Click Here To Upload </p>
                <div className="upload-helper-icon">
                  <FaFileUpload size={30} color={"#257b69"} />
                </div>
                <input
                  // id={id}
                  accept=".csv"
                  type="file"
                  multiple={false}
                  name="file-uploader"
                  onChange={handleFileChange}
                  className="uploaderInput"
                />
              </div>
              <label className="text--primary latto-bold text-center">
                Upload File
              </label>
            </div>
            {uploadSuccesFully ? <div className="text-success"> {uploadSuccesFully} uploaded  </div> :""}
            
          </Modal.Body>
          {(isSRM() || isAdmin()) && (
            <div className="row mt-4 mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary px-4 mx-4"
                >
                  Next
                </button>
                <button
                  type="button"
                  // onClick={() => closeThepopup()}
                  className="btn btn-danger px-4 mx-4"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Styled>
      </Modal>

      {/* {
        showModal.dataAndEdit &&
        ( */}
          <CheckValuesOpsUploadedData
            // {...operationdata}
            show={showModal}
            onHide={hideShowModal}
            notUploadedData={notUploadedData}
            excelData={excelData}
            // refreshTableOnDataSaving={refreshTableOnDataSaving}
          />
        {/* )
      } */}
    </>
  );
};
export default UploadFile;
