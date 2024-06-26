import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { GET_ALL_BATCHES, GET_ALL_INSTITUTES } from "../../../graphql";
import { queryBuilder } from "../../../apis";
import { getAllSrmbyname } from "../../../utils/function/lookupOptions";
import { FaFileUpload } from "react-icons/fa";
// import CheckValuesOpsUploadedData from "./CheckValuesOpsUploadedData";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import { getTotPickList } from "../OperationComponents/operationsActions";
import CheckTot from "./CheckTot";

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

const TotUpload = (props) => {
  const { onHide } = props;
  const [file, setFile] = useState(null);
  const handler = (data) => setFile(data);
  const [assigneOption, setAssigneeOption] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [check, setCheck] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [partnerDept, setPartnerDept] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [showModalTOT, setShowModalTOT] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);
  


  useEffect(() => {
    const getdata = async () => {
      const data = await getAllSrmbyname();
      console.log(data);
      setAssigneeOption(data);
    };

    getdata();
  }, [props]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNextDisabled(false);

    if (file) {
      setUploadSuccesFully(`${file.name} Uploaded`);
      const reader = new FileReader();

      reader.onload = () => {
        const fileData = reader.result;
        convertExcel(fileData);
      };

      reader.readAsBinaryString(file);
      setNextDisabled(true);
    } else {
      setUploadSuccesFully("The file type should be .xlsx");
    }
  };

  const convertExcel = (excelData) => {
    const workbook = XLSX.read(excelData, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = results[0];
    const data = results.slice(1).map((row) => {
      const newItem = {};
      headers.forEach((header, i) => {
        newItem[header] = row[i];
      });
      return newItem;
    });
    
    processParsedData(data);
  };



  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const excelSerialDateToJSDate = (serial) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const isValidDateFormat = (dateStr) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regex for yyyy-mm-dd format
    if (datePattern.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    }
    return null;
};
  

  const processParsedData = (data) => {
    const formattedData = [];
    const notFoundData = [];
    const filteredArray = data.filter(obj => 
      Object.values(obj).some(value => value !== undefined)
    );
    console.log(filteredArray);
    filteredArray.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });
  
      const StateCheck = stateOptions.find(
        (state) => state === newItem["State"]
      )?.id;
      const areaCheck = areaOptions.find(
        (area) => area === newItem["City"]
      )?.id;
      const moduleCheck = moduleName.find(
        (module) => module.value === newItem["Module Name"]
      );
    
      const departMentCheck = partnerDept.find(
        (department) => "Higher Education" === newItem["Partner Department"]
      );
      
      const projectCheck = ["Internal", "External"].find(
        (project) => project === newItem["Project Type"]
      );
  
      const trainer_1 = assigneOption.find(
        (user) => user.label === newItem["Trainer 1"]
      )?.value;
      console.log("Trainer 1 ID:", trainer_1);
      
      const trainer_2 = assigneOption.find(
        (user) => user.label === newItem["Trainer 2"]
      )?.value;
      console.log("Trainer 2 ID:", trainer_2);
      // console.log(trainer_2);
      const startDate = excelSerialDateToJSDate(newItem["Start Date"]);
      const endDate = excelSerialDateToJSDate(newItem["End Date"]);
  
      const isStartDateValid = isValidDateFormat(startDate);
      const isEndDateValid = isValidDateFormat(endDate);
        // console.log("project_name: ", newItem["Project Name"]);
      if (
        !departMentCheck ||
        !projectCheck ||
        !moduleCheck ||
        !isStartDateValid ||
        !isEndDateValid
      ) {
        notFoundData.push({
          index: index + 1,
          user_name: newItem["Participant Name"],
          trainer_1: newItem["Trainer 1"],
          project_name: newItem["Project Name"],
          certificate_given: newItem["Certificate Given"],
          module_name: moduleCheck ? newItem["Module Name"] : { value: newItem["Module Name"], notFound: true },
          project_type: projectCheck ? newItem["Project Type"] : { value: newItem["Project Type"], notFound: true },
          trainer_2: newItem["Trainer 2"],
          partner_dept: departMentCheck ? newItem["Partner Department"] : { value: newItem["Partner Department"], notFound: true },
          college: newItem["College"],
          city: newItem["City"],
          state: newItem["State"],
          age: newItem["Age"],
          gender: newItem["Gender"],
          contact: newItem["Contact"],
          designation: newItem["Designation"],
          start_date: isStartDateValid ? startDate : { value: newItem["Start Date"], notFound: true },
          end_date: isEndDateValid ? endDate : { value: newItem["End Date"], notFound: true },
        });
      } else {
        formattedData.push({
          user_name: newItem["Participant Name"],
          trainer_1: Number(trainer_1),
          project_name: newItem["Project Name"],
          certificate_given: newItem["Certificate Given"] ,
          module_name: newItem["Module Name"],
          project_type: newItem["Project Type"],
          trainer_2: Number(trainer_2),
          partner_dept: newItem["Partner Department"],
          college: newItem["College"],
          city: newItem["City"],
          state: newItem["State"],
          age: newItem["Age"],
          gender: newItem["Gender"],
          contact: newItem["Contact"],
          designation: newItem["Designation"],
          start_date: startDate,
          end_date: endDate,
        });
      }
    });
    console.log('notFoundData',notFoundData);
    console.log("formattedData",formattedData);
    setExcelData(formattedData);
    setNotuploadedData(notFoundData);
  };
  

  useEffect(() => {
    getTotPickList().then((data) => {
      // setModuleName(data.module_name.map(item))
      console.log(data.module_name);
      setModuleName(
        data.module_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setPartnerDept(
        data.partner_dept.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setProjectName(
        data.project_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
          .map((state) => ({
            key: state?.id,
            label: state?.key,
            value: state?.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
    getStateDistricts().then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }, [props]);

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
    setShowModalTOT(false);
    setUploadSuccesFully('');
  };

  const uploadDirect = () => {
    if (notUploadedData.length == 0 && excelData.length > 0) {
      console.log("excelData",excelData);
      props.uploadExcel(excelData, "tot");
    } else {
      console.log("hello");
      setShowModalTOT(true);
    }
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
            <h1 className="text--primary bebas-thick mb-0">Upload Data TOT</h1>
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
                  disabled={!uploadSuccesFully}
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
      
        <CheckTot
          show={showModalTOT}
          onHide={()=>hideShowModal()}
          notUploadedData={  notUploadedData }
          excelData={excelData}
          uploadExcel={props.uploadExcel}
        />
      
    </>
  );
};

export default TotUpload;
