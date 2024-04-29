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

  // useEffect(() => {
  //   setUploadSuccesFully(true)
  // }, [excelData]);

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

  const convertExcelDateToJSDate = (excelDate) => {
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const date = new Date(
      (excelDate - 1) * millisecondsInDay + Date.parse("1899-12-31")
    );
    return date.toISOString().split("T")[0];
  };

  const readUploadFile = (e) => {
    const fileName=e.target.files[0].name;
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);

        const formattedData = [];
        const notFoundData = [];

        json.forEach((item) => {
          const batchId = batchOption.find(
            (batch) => batch.name === item["Batch Name"]
          )?.id;
          const instituteId = institutionOption.find(
            (institute) => institute.name === item["Educational Institution"]
          )?.id;
          const userId = assigneOption.find(
            (user) => user.name === item["Assigned To"]
          )?.id;
          const startDate = convertExcelDateToJSDate(item["Start Date"]);
          const endDate = convertExcelDateToJSDate(item["End Date"]);
          // Set donor based on condition
          const donor =
            item["Project / Funder"].toLowerCase() === "no" ? false : true;
          const currentUser = localStorage.getItem("user_id");

          // Check if batchId or instituteId or userId is  not defined
          if (
            batchId === undefined ||
            instituteId === undefined ||
            userId === undefined
          ) {
            notFoundData.push({
              institution: item["Educational Institution"],
              batch: item["Batch Name"],
              state: item["State"] || "",
              start_date: item["Start Date"] || "",
              end_date: item["End Date"] || "",
              topic: item["Session Topic"] || "",
              donor: item["Project / Funder"] || "",
              guest: item["Guest Name "] || "",
              designation: item["Guest Designation"] || "",
              organization: item["Organization"] || "",
              activity_type: item["Activity Type"] || "",
              assigned_to: item["Assigned To"] || "",
              area: item["Medha Area"] || "",
            });
          } else {
            formattedData.push({
              institution: instituteId,
              batch: batchId,
              state: item["State"] || "",
              start_date: startDate,
              end_date: endDate,
              topic: item["Session Topic"] || "",
              donor: donor,
              guest: item["Guest Name "] || "",
              designation: item["Guest Designation"] || "",
              organization: item["Organization"] || "",
              activity_type: item["Activity Type"] || "",
              assigned_to: userId || "",
              area: item["Medha Area"] || "",
              isactive: true,
              createdby: userId,
              updatedby: currentUser,
            });
          }
        });
        console.log(formattedData);
        if(formattedData.length >0){
          setUploadSuccesFully(fileName)
        }
        setExcelData(formattedData);
        setNotuploadedData(notFoundData);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const updatevalue = () => {
    // if(notUploadedData.length == 0){
    //   props.uploadExcel(excelData,fileType)

    // }else{
    //   props.alertForNotuploadedData(notUploadedData,fileType)
    // }

    props.uploadExcel(excelData, fileType);
  };

  const closeThepopup = () => {
    props.alertForNotuploadedData("");
  };

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
                setFileType(e.value);
              }}
            />
           
            <div className="uploader-container">
              <div className="imageUploader">
                <p className="upload-helper-text">Click Here To Upload </p>
                <div className="upload-helper-icon">
                  <FaFileUpload size={30} color={"#257b69"} />
                </div>
                <input
                  // id={id}
                  accept=".pdf, .docx, .xls"
                  type="file"
                  multiple={false}
                  name="file-uploader"
                  onChange={readUploadFile}
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
                  onClick={() => updatevalue()}
                  className="btn btn-primary px-4 mx-4"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => closeThepopup()}
                  className="btn btn-danger px-4 mx-4"
                >
                  Close
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
