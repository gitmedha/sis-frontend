import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import { GET_ALL_BATCHES, GET_ALL_INSTITUTES } from "../../../../graphql";
import { queryBuilder } from "../../../../apis";
import { getAllSrmbyname } from "../../../../utils/function/lookupOptions";
import {
  FaEdit,
  FaFileUpload,
  FaCheckCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
// import CheckValuesOpsUploadedData from "./CheckValuesOpsUploadedData";
import * as XLSX from "xlsx";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../../Address/addressActions";
import {
  bulkCreateUsersTots,
  getAllInstitute,
  getTotPickList,
} from "../../OperationComponents/operationsActions";
import checkQuery from "./checkQuery";
import { isNumber, set } from "lodash";
import { setAlert } from "src/store/reducers/Notifications/actions";
import moment from "moment";
import { searchStudents } from "src/views/Batches/batchActions";
import CheckQuery from "./checkQuery";

const expectedColumns = [
  "Student ID",
  "Query Start date",
  "Full Name",
  "Father's Name",
  "Email ID",
  "Mobile No.",
  "Medha Area",
  "Query Type",
  "Query Description",
  "Conclusion",
  "Status",
  "Query End Date"
];

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

const QueryUpload = (props) => {
  const { onHide } = props;
  const [file, setFile] = useState(null);
  const handler = (data) => setFile(data);
  const [assigneOption, setAssigneeOption] = useState([]);
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [check, setCheck] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [partnerDept, setPartnerDept] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [notuploadSuccesFully, setNotUploadSuccesFully] = useState("");
  const [showModalTOT, setShowModalTOT] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [uploadNew, setUploadNew] = useState(false);

  // useEffect(() => {
  //   const getdata = async () => {
  //     const data = await getAllSrmbyname();
  //     setAssigneeOption(data);

  //     const instituteData = await getAllInstitute();
  //     console.log(instituteData);

  //     setInstituteOptions(instituteData)


  //   };

  //   getdata();
  // }, [props]);

  const handleFileChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    setShowForm(true);
    setFileName(""); // Reset the file name display
    setNextDisabled(false); // Optionally disable the next button
    setUploadSuccesFully("");
    setNotUploadSuccesFully("");

    if (file) {
      setFileName(`${file.name} Uploaded`);

      const reader = new FileReader();

      reader.onload = () => {
        const fileData = reader.result;
        try {
          convertExcel(fileData);
        } catch (error) {
          setNotUploadSuccesFully(error?.message);
        }
      };

      reader.readAsBinaryString(file);
      fileInput.value = "";
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
        newItem[header.trim()] = row[i];
      });
      return newItem;
    });
    processFileData(data);
  };

  const processFileData = (jsonData) => {
    const validRecords = [];
    const invalidRecords = [];
    for (const row of jsonData) {
      const isRowEmpty = Object.values(row).every(
        (value) => value === null || value === ""
      );

      if (isRowEmpty) {
        break;
      }
      validRecords.push(row);
    }
    const filteredArray = validRecords.filter((obj) =>
      Object.values(obj).some((value) => value !== undefined)
    );
    if (filteredArray.length == 0) {
      setNotUploadSuccesFully(
        "File is empty please select file which has data in it"
      );
      return;
    }
    if (validateColumns(filteredArray, expectedColumns)) {
      setUploadSuccesFully(`File Uploaded`);
      setNextDisabled(true);
      processParsedData(filteredArray);
    }
  };

  

  const excelSerialDateToJSDate = (serial) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const isValidDateFormat = (dateStr) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regex for yyyy-mm-dd format
    if (datePattern.test(dateStr)) {
      const [year, month, day] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  useEffect(() => {
 
    getStateDistricts().then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            value: area.key
          }))
          // .sort((a, b) => a.label.localeCompare(b.label))
      );
      // console.log(data?.data?.data?.geographiesConnection.groupBy);
      
    });
  }, [props]);

  const capitalize = (s) => {
    return String(s)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateColumns = (data, expectedColumns) => {
    const fileColumns = Object.keys(data[0]);
    // if(!data){
    //   setUploadSuccesFully("No Data")
    // }
    if (data.length == 0) {
      setNotUploadSuccesFully(
        "File is empty please select file which has data in it"
      );
      return false;
    }
    if (!data) {
      setNotUploadSuccesFully(
        "Some data fields are empty or not properly initialized"
      );
      return false;
    }
    const missingColumns = expectedColumns.filter((col) => {
      return !fileColumns.includes(col.trim());
    });
    const extraColumns = fileColumns.filter(
      (col) => !expectedColumns.includes(col.trim())
    );
    const exemptColumns = ["Age", "Contact Number"];
    const incompleteColumns = expectedColumns.filter(
      (col) =>
        !exemptColumns.includes(col) &&
        data.every(
          (row) =>
            row[col] === null || row[col] === "" || row[col] === undefined
        )
    );

    if (incompleteColumns.length > 0) {
      setNotUploadSuccesFully(
        `Columns with missing data: ${incompleteColumns.join(", ")}`
      );
      return false;
    }

    if (data.length > 0 && data.length > 200) {
      setNotUploadSuccesFully(`Number of rows should be less than 200`);
    }

    if (missingColumns.length > 0) {
      console.error(`Missing columns: ${missingColumns.join(", ")}`);
      setNotUploadSuccesFully(`Missing columns: ${missingColumns.join(", ")}`);
      return false;
    }

    if (extraColumns.length > 0) {
      console.error(`Extra columns: ${extraColumns.join(", ")}`);
      setNotUploadSuccesFully(`Extra columns: ${extraColumns.join(", ")}`);
      return false;
    }
    return true;
  };
const processParsedData = async (data) => {
  const formattedData = [];
  const notFoundData = [];
  const userId = localStorage.getItem("user_id");

  // Process each row sequentially to ensure proper async handling
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const newItem = {};
    
    Object.keys(item).forEach((key) => {
      newItem[key] = item[key];
    });

    const currentUser = localStorage.getItem("user_id");
    const StateCheck = stateOptions.find(
      (state) => state === newItem["State"]
    )?.id;

    console.log("areaOptions", areaOptions);

    const areaCheck = areaOptions.find(
      (area) => area.value.toLowerCase() === newItem["Medha Area"].toLowerCase()
    );
    
    const studentId = newItem["Student ID"];
    let studentExists = false;
    let studentIdNum;

    // Check if student exists (only if studentId is provided)
    if (studentId) {
      try {
        // Use await properly in the for loop
        console.log(studentId);
        
        const student = await searchStudents(studentId);
        studentIdNum = parseInt(
          student.data?.studentsConnection.values[0]?.id,
          10
        );
        console.log(student);
        
        studentExists = student?.data?.studentsConnection?.values.length > 0;

      } catch (err) {
        console.error(`Error fetching student with ID: ${studentId}`, err);
        // If there's an error, assume student doesn't exist
        studentExists = false;
      }
    }

    const startDate = excelSerialDateToJSDate(newItem["Query Start date"]);
    const endDate = excelSerialDateToJSDate(newItem["Query End Date"]);

    const isStartDateValid = isValidDateFormat(startDate);
    const isEndDateValid = isValidDateFormat(endDate);
    const createdby = Number(userId);
    let parseDate;
    
    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      const parsedDate1 = moment(new Date(startDate)).unix();
      const parsedDate2 = moment(new Date(endDate)).unix();
      if (parsedDate2 < parsedDate1) {
        parseDate = true;
      }
    }
    
    const isValidContact = (contact) => {
      const pattern = /^[0-9]{10}$/; // 10-digit number regex
      return contact && pattern.test(contact);
    };
    
    const isValidEmail = (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email regex
      return email && pattern.test(email);
    };

    if (
      !isStartDateValid ||
      !isEndDateValid ||
      parseDate || 
      !areaCheck || // Changed this condition - if areaCheck is falsy, it should go to notFoundData
      !studentExists || // If student doesn't exist, it should go to notFoundData
      !isValidContact(newItem["Mobile No."]) ||
      !isValidEmail(newItem["Email ID"])
    ) {
      notFoundData.push({
        father_name: newItem["Father's Name"] || "",
        email: isValidEmail(newItem["Email ID"]) ? newItem["Email ID"] : { value: newItem["Email ID"], notFound: true } || "No Data",
        phone: isValidContact(newItem["Mobile No."]) ? newItem["Mobile No."] : { value: newItem["Mobile No."], notFound: true } || "No Data",
        location: areaCheck ? newItem["Medha Area"] : { value: newItem["Medha Area"], notFound: true } || "No Data",
        query_type: newItem["Query Type"] || "",
        query_desc: newItem["Query Description"] || "",
        conclusion: newItem["Conclusion"] || "",
        status: newItem["Status"] || "",
        query_start: parseDate
          ? { value: startDate, notFound: true }
          : isStartDateValid
            ? startDate
            : {
                value: newItem["Query Start date"]
                  ? newItem["Query Start date"]
                  : "No data",
                notFound: true,
              },
        query_end: parseDate
          ? { value: endDate, notFound: true }
          : isEndDateValid
            ? endDate
            : {
                value: newItem["Query End Date"] ? newItem["Query End Date"] : "no data",
                notFound: true,
              },
        student_name: studentExists
          ? newItem["Full Name"]
          : { value: newItem["Full Name"], notFound: true } || "No Data",
      });
    } else {
      formattedData.push({
        start_date: startDate,
        end_date: endDate,
        student_id: studentIdNum || "",
        student_name: capitalize(newItem["Full Name"]) || "",
        father_name: newItem["Father's Name"] || "",
        email: newItem["Email ID"] || "",
        phone: newItem["Mobile No."] || "",
        location: newItem["Medha Area"] || "",
        query_type: newItem["Query Type"] || "",
        query_desc: newItem["Query Description"] || "",
        conclusion: newItem["Conclusion"] || "",
        status: newItem["Status"] || "",
        createdby: createdby,
        updatedby: currentUser,
      });
    }
  }

  setExcelData(formattedData);
  setNotuploadedData(notFoundData);
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
    setShowModalTOT(false);
    setUploadSuccesFully("");
    setShowForm(true);
    setFileName(""); // Reset the file name display
    setNextDisabled(false); // Optionally disable the next button
    setUploadSuccesFully("");
  };

  const uploadDirect = () => {
    console.log("notUploadedData", notUploadedData);
    console.log(excelData);
    
    
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setShowForm(false);
    } else {
      setShowModalTOT(true);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const uploadNewData = () => {
    setShowForm(true);
    setUploadNew(!uploadNew);
    setFileName("");
    setNextDisabled(false);
    setUploadSuccesFully("");
  };

  const proceedData = async () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setUploadNew(true);
      props.uploadExcel(excelData, "alumniQuery");
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
            <h1 className="text--primary bebas-thick mb-0">Upload Alumni Query</h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
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
                  <div className="uploader-container">
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
                        onChange={handleFileChange}
                        className="uploaderInput"
                      />
                    </div>
                    <label className="text--primary latto-bold text-center">
                      Upload File
                    </label>
                  </div>
                  <div className="d-flex  flex-column  ">
                    {notuploadSuccesFully ? (
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
                  {!uploadNew ? (
                    <>
                      <FaEdit size={20} color="#31B89D" /> {excelData.length}{" "}
                      row(s) of data will be uploaded.
                    </>
                  ) : (
                    <>
                      <FaRegCheckCircle size={20} color="#31B89D" />{" "}
                      {excelData.length} row(s) of data uploaded successfully!
                    </>
                  )}
                </p>
              </div>
              <div className="col-md-12 d-flex justify-content-center">
                <button
                  type="button"
                  onClick={() => props.closeThepopus()}
                  className="btn btn-danger px-4 mx-4 mt-2"
                  style={{ height: "2.5rem" }}
                >
                  Close
                </button>

                {!uploadNew ? (
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
                )}
              </div>
            </Modal.Body>
          )}
        </Styled>
      </Modal>
{console.log(showModalTOT)
}
console.log(notUploadedData);

      <CheckQuery
        show={showModalTOT}
        onHide={() => hideShowModal()}
        notUploadedData={notUploadedData}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default QueryUpload;
