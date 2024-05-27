import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { GET_ALL_BATCHES, GET_ALL_INSTITUTES } from "../../../graphql";
import { queryBuilder } from "../../../apis";
import { getAllMedhaUsers } from "../../../utils/function/lookupOptions";
import { FaFileUpload } from "react-icons/fa";
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
    align-items: center;
    justify-content: center;
  }
`;

const options = [
  { value: "feild_activity", label: "Field Activity" },
  { value: "collegePitch", label: "Pitching" },
];

const UploadFile = (props) => {
  const { onHide } = props;
  const [file, setFile] = useState(null);
  const handler = (data) => setFile(data);
  const [batchOption, setBatchOption] = useState([]);
  const [institutionOption, setInstituteOption] = useState([]);
  const [assigneOption, setAssigneeOption] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [check, setCheck] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNextDisabled(false);
    if (file.type === "text/csv") {
      setUploadSuccesFully(`${file.name} Uploaded`);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          convertCSV(reader.result);
        };
        reader.readAsText(file);
        setNextDisabled(true);
      }
    } else {
      setUploadSuccesFully("The file type should be .csv");
    }
  };
  console.log(props);

  const convertCSV = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        const formattedData = [];
        const notFoundData = [];

        results.data.forEach((item) => {
          const newItem = {};
          Object.keys(item).forEach((key) => {
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
          const donor =
            newItem["Project / Funder"] &&
            newItem["Project / Funder"].toLowerCase() === "no"
              ? false
              : true;
          const currentUser = localStorage.getItem("user_id");
          if (
            batchId === (undefined || ' ') ||
            instituteId === undefined ||
            userId === undefined
          ) {
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
              start_date: newItem["Start Date"],
              end_date: newItem["End Date"],
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
        setExcelData(formattedData);
        setNotuploadedData(notFoundData);
      },
    });
  };

  useEffect(() => {
    const getbatch = async () => {
      await getAllBatchs();
      const instutiondata = await getAllInstitute();
      const data = await getAllMedhaUsers();
      setInstituteOption(instutiondata);
      setAssigneeOption(data);
    };

    getbatch();
  }, [props]);

  const getAllBatchs = async () => {
    try {
      const { data } = await queryBuilder({ query: GET_ALL_BATCHES });
      setBatchOption(data.batches);
    } catch (err) {}
  };

  const getAllInstitute = async () => {
    try {
      const { data } = await queryBuilder({ query: GET_ALL_INSTITUTES });
      return data.institutions;
    } catch (err) {}
  };

  function hasNullValue(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].activity_type === "" || arr[i].activity_type === undefined) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (notUploadedData.length === 1) {
      setCheck(hasNullValue(notUploadedData));
    }
  }, [notUploadedData]);

  const hideShowModal = () => {
    setShowModal(false);
  };

 

  const uploadDirect =()=>{
    console.log(notUploadedData);
    console.log("notUploadedData.length == 0 && excelData.length",notUploadedData.length, excelData.length > 0);
    if (notUploadedData.length == 1  && excelData.length > 0) {
      console.log("notUploadedData is empty and excelData has some data ");
      props.uploadExcel(excelData);

    }else{
      console.log("else block");
      setShowModal(true)
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
            <h1 className="text--primary bebas-thick mb-0">Upload Data Deild Activity</h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
          <Modal.Body className="bg-white">
            <div className="uploader-container">
              <div className="imageUploader">
                <p className="upload-helper-text">Click Here To Upload </p>
                <div className="upload-helper-icon">
                  <FaFileUpload size={30} color={"#257b69"} />
                </div>
                <input
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
            {uploadSuccesFully ? (
              <div className="text-success"> {uploadSuccesFully} </div>
            ) : (
              ""
            )}
          </Modal.Body>
          {(isSRM() || isAdmin()) && (
            <div className="row mt-4 mb-4">
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  type="button"
                  onClick={() => props.closeThepopus()}
                  className="btn btn-danger px-4 mx-4"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => uploadDirect()}
                  className="btn btn-primary px-4 mx-4"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Styled>
      </Modal>
      <CheckValuesOpsUploadedData
        show={showModal}
        onHide={hideShowModal}
        notUploadedData={!check ? notUploadedData : []}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default UploadFile;
