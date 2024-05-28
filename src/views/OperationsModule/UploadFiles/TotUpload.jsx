import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { GET_ALL_BATCHES, GET_ALL_INSTITUTES } from "../../../graphql";
import { queryBuilder } from "../../../apis";
import { getAllMedhaUsers } from "../../../utils/function/lookupOptions";
import { FaFileUpload } from "react-icons/fa";
// import CheckValuesOpsUploadedData from "./CheckValuesOpsUploadedData";
import Papa from "papaparse";
import { getAddressOptions, getStateDistricts } from "../../Address/addressActions";
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
  const [moduleName,setModuleName]=useState([])
  const [partnerDept,setPartnerDept]=useState([])
  const [projectName,setProjectName]=useState([])
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [showModalTOT, setShowModalTOT] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setNextDisabled(false);
    if (file.type === "text/csv") {
      setUploadSuccesFully(`${file.name} Uploaded`);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          convertCSV(reader.result);
        };
        reader.readAsText(file);
        // setNextDisabled(true);
      }
    } else {
      setUploadSuccesFully("The file type should be .csv");
    }
  };

  function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
  
    if (!regex.test(dateString)) {
      return false;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(dateString);
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month || 
      date.getDate() !== day
    ) {
      return false;
    }
  
    return true;
  }
  

  const convertCSV = (csvData) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        const formattedData = [];
        const notFoundData = [];

        results.data.forEach((item,index) => {
          const newItem = {};
          Object.keys(item).forEach((key) => {
            newItem[key] = item[key];
          });

          console.log(newItem);

          const StateCheck = stateOptions.find(
            (state) => state === newItem["State"]
          )?.id;
          const areaCheck = areaOptions.find(
            (area) => area === newItem["City"]
          )?.id;
          const moduleCheck = moduleName.find(module => module === newItem["Module Name"]);

          const departMentCheck = partnerDept.find(department => department === newItem["Partner Dept"]);
        const projectCheck = ["Internal", "External"].find(project => project === newItem["Project Type"]);

          const userId = assigneOption.find(
            (user) => user.name === newItem["Assigned To"]
          )?.id;
          const startDate =isValidDate(newItem['Start Date'])
          const endDate=isValidDate(newItem['End Date'])
          const currentUser = localStorage.getItem("user_id");
          if (
           departMentCheck === undefined || projectCheck ===undefined || startDate || endDate 
          ) {
            notFoundData.push({
              index:index+1,
                user_name: newItem["Full Name"],
                trainer_1: newItem["Trainer 1"],
                project_name: newItem['Project Name'],
                certificate_given: newItem['Certificate Given'],
                module_name: newItem['Module Name'],
                project_type: newItem['Project Type'],
                trainer_2: newItem["Trainer 2"],
                partner_dept: newItem['Partner Dept'],
                college: newItem['College'],
                city: newItem['City'],
                state: newItem['State'],
                age: newItem['Age'],
                gender: newItem['Gender'],
                contact: newItem['Contact'],
                designation: newItem['Designation'],
                start_date:newItem['Start Date'],
                end_date:newItem['End Date']
            });
          } else {
            formattedData.push({
                user_name: newItem["Full Name"],
                trainer_1: newItem["Trainer 1"],
                project_name: newItem['Project Name'],
                certificate_given: newItem['Certificate Given'],
                module_name: newItem['Module Name'],
                project_type: newItem['Project Type'],
                trainer_2: newItem["Trainer 2"],
                partner_dept: newItem['Partner Dept'],
                college: newItem['College'],
                city: newItem['City'],
                state: newItem['State'],
                age: newItem['Age'],
                gender: newItem['Gender'],
                contact: newItem['Contact'],
                designation: newItem['Designation'],
                start_date:newItem['Start Date'],
                end_date:newItem['End Date']
            });
          }
        });

        console.log("formated",formattedData);
        console.log("not format",notFoundData);
        setExcelData(formattedData);
        setNotuploadedData(notFoundData);
      },
    });
  };

  useEffect(() => {
    getTotPickList().then(data=>{
        // setModuleName(data.module_name.map(item))
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
      })
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
  };

 

  const uploadDirect =()=>{
    if (notUploadedData.length == 1  && excelData.length > 0) {
      console.log("notUploadedData is empty and excelData has some data ");
      props.uploadExcel(excelData,"tot");

    }else{
      console.log("else block");
      setShowModalTOT(true)
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
      {showModalTOT &&  <CheckTot
        show={showModalTOT}
        onHide={hideShowModal}
        notUploadedData={!check ? notUploadedData : []}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      /> }
     
    </>
  );
};

export default TotUpload;
