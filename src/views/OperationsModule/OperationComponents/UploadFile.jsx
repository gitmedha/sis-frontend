import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import {
  GET_ALL_BATCHES,
  GET_ALL_INSTITUTES,
  GET_BATCHES,
  GET_INSTITUTES_COUNT,
  GET_MY_INSTITUTES,
} from "../../../graphql";
import api, { queryBuilder } from "../../../apis";
import { getAllMedhaUsers } from "../../../utils/function/lookupOptions";
import { FaFileUpload } from "react-icons/fa";
import CheckValuesOpsUploadedData from "./CheckValuesOpsUploadedData";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { isNumber } from "lodash";

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

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    --color: #257b69;
    --animation: 2s ease-in-out infinite;
  }

  .loader .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 20px;
    height: 20px;
    border: solid 2px var(--color);
    border-radius: 50%;
    margin: 0 10px;
    background-color: transparent;
    animation: circle-keys var(--animation);
  }

  .loader .circle .dot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--color);
    animation: dot-keys var(--animation);
  }

  .loader .circle .outline {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    animation: outline-keys var(--animation);
  }

  .circle:nth-child(2) {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) {
    animation-delay: 0.9s;
  }

  .circle:nth-child(5) {
    animation-delay: 1.2s;
  }

  .circle:nth-child(2) .dot {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) .dot {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) .dot {
    animation-delay: 0.9s;
  }

  .circle:nth-child(5) .dot {
    animation-delay: 1.2s;
  }

  .circle:nth-child(1) .outline {
    animation-delay: 0.9s;
  }

  .circle:nth-child(2) .outline {
    animation-delay: 1.2s;
  }

  .circle:nth-child(3) .outline {
    animation-delay: 1.5s;
  }

  .circle:nth-child(4) .outline {
    animation-delay: 1.8s;
  }

  .circle:nth-child(5) .outline {
    animation-delay: 2.1s;
  }

  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes outline-keys {
    0% {
      transform: scale(0);
      outline: solid 20px var(--color);
      outline-offset: 0;
      opacity: 1;
    }

    100% {
      transform: scale(1);
      outline: solid 0 transparent;
      outline-offset: 20px;
      opacity: 0;
    }
  }
`;

const loaderStyle = styled.div``;

const options = [
  { value: "feild_activity", label: "Field Activity" },
  { value: "collegePitch", label: "Pitching" },
];
const expectedColumns = [
  "Assigned To",
  "Activity Type",
  "Institution",
  "Medha Area",
  "State",
  "Student Type",
  "Program Name",
  "Batch Name",
  "Start Date",
  "End Date",
  "Session Topic",
  "Project / Funder",
  "Guest Name",
  "Guest Designation",
  "Organization",
  "No. Of Participants",
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
  const [notuploadSuccesFully, setNotUploadSuccesFully] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [check, setCheck] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const validateColumns = (data, expectedColumns) => {
    const fileColumns = Object.keys(data[0]);
    const missingColumns = expectedColumns.filter(
      (col) => !fileColumns.includes(col)
    );
    const extraColumns = fileColumns.filter(
      (col) => !expectedColumns.includes(col)
    );
    if (data.length > 0 && data.length > 200) {
      setNotUploadSuccesFully(`Number of rows should be less than 200`);
    }
    if (missingColumns.length > 0) {
      setNotUploadSuccesFully(`Missing columns: ${missingColumns.join(", ")}`);
      return false;
    }

    if (extraColumns.length > 0) {
      setNotUploadSuccesFully(`Extra columns: ${extraColumns.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNextDisabled(false);

    if (file) {
      setFileName(`${file.name} Uploaded`);

      const reader = new FileReader();

      reader.onload = () => {
        const fileData = reader.result;
        convertExcel(fileData);
      };

      reader.readAsBinaryString(file);
      // setNextDisabled(true);
    } else {
      setUploadSuccesFully("The file type should be .xlsx");
    }
  };

  useEffect(() => {
    const getbatch = async () => {
      getAllBatchs();
      getAllInstitute();
      const data = await getAllMedhaUsers();
      setAssigneeOption(data);
    };

    getbatch();
  }, [props]);

  const convertExcel = (excelData) => {
    const workbook = XLSX.read(excelData, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const results = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      blankRows: false,
    });
    //
    const headers = results[0];
    const data = results.slice(1).map((row) => {
      const newItem = {};
      headers.forEach((header, i) => {
        newItem[header] = row[i];
      });
      return newItem;
    });

    processFileData(data);
  };

  const excelSerialDateToJSDate = (serial) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const isValidDateFormat = (dateStr) => {
    const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
    if (datePattern.test(dateStr)) {
      const [year, month, day] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }

    return null;
  };

  const processFileData = (jsonData) => {
    const validRecords = [];
    const invalidRecords = [];
    jsonData.forEach((row) => {
      if (Object.values(row).some((value) => value === null || value === "")) {
        return;
      } else {
        validRecords.push(row);
      }
    });

    if (validateColumns(validRecords, expectedColumns)) {
      setUploadSuccesFully(`File Uploaded`);
      setNextDisabled(true);
      processParsedData(validRecords);
    }
  };

  const capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1);
  };

  const processParsedData = (data) => {
    const formattedData = [];
    const notFoundData = [];

    data.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });

      const batch = batchOption.find(
        (batch) => batch.name === newItem["Batch Name"]
      );
      const institute = institutionOption.find(
        (institute) => institute.name === newItem["Institution"]
      );
      const user = assigneOption.find(
        (user) => user.name === newItem["Assigned To"]
      );

      const batchId = batch ? batch.id : null;
      const instituteId = institute ? institute.id : null;
      const userId = user ? user.id : null;

      const donor =
        newItem["Project / Funder"] &&
        newItem["Project / Funder"].toLowerCase() === "no"
          ? false
          : true;
      const currentUser = localStorage.getItem("user_id");

      const startDate = excelSerialDateToJSDate(newItem["Start Date"]);
      // let date=excelSerialDateToJSDate(dateStr)
      const endDate = excelSerialDateToJSDate(newItem["End Date"]);

      const isStartDateValid = isValidDateFormat(startDate);
      const isEndDateValid = isValidDateFormat(endDate);

      if (
        !batchId ||
        !instituteId ||
        !userId ||
        !isStartDateValid ||
        !isEndDateValid ||
        !isNumber(newItem["No. Of Participants"])
      ) {
        notFoundData.push({
          index: index + 1,
          institution: institute
            ? institute.name
            : { value: newItem["Institution"], notFound: true },
          batch: batch
            ? batch.name
            : { value: newItem["Batch Name"], notFound: true },
          state: newItem["State"] || "",
          start_date: isStartDateValid
            ? startDate
            : { value: newItem["Start Date"], notFound: true },
          end_date: isEndDateValid
            ? endDate
            : { value: newItem["End Date"], notFound: true },
          topic: newItem["Session Topic"] || "",
          donor: newItem["Project / Funder"] || "",
          guest: newItem["Guest Name "] || "",
          designation: newItem["Guest Designation"] || "",
          organization: newItem["Organization"] || "",
          students_attended: newItem["No. Of Participants"],
          activity_type: newItem["Activity Type"] || "",
          assigned_to: user
            ? user.name
            : { value: newItem["Assigned To"], notFound: true },
          area: newItem["Medha Area"] || "",
        });
      } else {
        formattedData.push({
          institution: instituteId,
          batch: batchId,
          state: newItem["State"] ? capitalize(newItem["State"]) : "" || "",
          start_date: isStartDateValid,
          end_date: isEndDateValid,
          topic: newItem["Session Topic"]
            ? capitalize(newItem["Session Topic"])
            : "" || "",
          donor: donor,
          guest: newItem["Guest Name "]
            ? capitalize(newItem["Guest Name "])
            : "" || "",
          designation: newItem["Guest Designation"]
            ? capitalize(newItem["Guest Designation"])
            : "" || "",
          organization: newItem["Organization"]
            ? capitalize(newItem["Organization"])
            : "" || "",
          activity_type: newItem["Activity Type"]
            ? capitalize(newItem["Activity Type"])
            : "" || "",
          assigned_to: userId || "",
          area: newItem["Medha Area"]
            ? capitalize(newItem["Medha Area"])
            : "" || "",
          isactive: true,
          createdby: currentUser,
          updatedby: currentUser,
          students_attended: newItem["No. Of Participants"],
        });
      }
    });
    setExcelData(formattedData);
    setNotuploadedData(notFoundData);
  };

  const getAllBatchs = async () => {
    try {
      let count = 0;
      let batchData = [];

      // First API call to get the count of batches
      const countResponse = await api.post("/graphql", {
        query: GET_BATCHES,
      });

      count = countResponse.data.data.batchesConnection.aggregate.count;

      for (let i = 0; i < count; i += 500) {
        const variables = {
          limit: 500,
          start: i,
        };

        const batchResponse = await api.post("/graphql", {
          query: GET_ALL_BATCHES,
          variables,
        });

        batchData = [
          ...batchData,
          ...batchResponse.data.data.batchesConnection.values,
        ];

        setBatchOption(batchData);
      }
    } catch (err) {
      console.error(err); // Add error handling as needed
    }
  };

  const getAllInstitute = async () => {
    try {
      let count = 0;
      let instituteData = [];

      // First API call to get the count of batches
      const countResponse = await api.post("/graphql", {
        query: GET_INSTITUTES_COUNT,
      });
      count = countResponse.data.data.institutionsConnection.aggregate.count;

      // Loop to fetch all batches in increments of 500
      for (let i = 0; i < count; i += 500) {
        const variables = {
          limit: 500,
          start: i,
        };

        const batchResponse = await api.post("/graphql", {
          query: GET_ALL_INSTITUTES,
          variables,
        });
        
        instituteData = [
          ...instituteData,
          ...batchResponse.data.data.institutionsConnection.values,
        ];
        setInstituteOption(instituteData);
      }
    } catch (err) {
      console.error(err);
    }
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
    setUploadSuccesFully("");
  };

  const uploadDirect = () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setNextDisabled(!nextDisabled);
      props.uploadExcel(excelData, "my_data");
    } else {
      setShowModal(true);
    }
  };
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
            <h1 className="text--primary bebas-thick mb-0">
              Upload Data Field Activity
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
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
                <div className="uploader-container">
                  <div className="imageUploader">
                    <p className="upload-helper-text">Click Here To Upload </p>
                    <div className="upload-helper-icon">
                      <FaFileUpload size={30} color={"#257b69"} />
                    </div>
                    <input
                      accept=".xlsx"
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
                <div className="d-flex  flex-column  ">
                  {uploadSuccesFully ? (
                    <div
                      className={` text-success d-flex justify-content-center `}
                    >
                      {" "}
                      {fileName}{" "}
                    </div>
                  ) : (
                    <div
                      className={`text-danger d-flex justify-content-center `}
                    >
                      {" "}
                      {notuploadSuccesFully}{" "}
                    </div>
                  )}
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
                          disabled={!nextDisabled}
                          onClick={() => uploadDirect()}
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
                          Note : Maximum recomended number of records is 100 per
                          excel
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
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
