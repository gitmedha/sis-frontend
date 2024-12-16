import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import {
  FaEdit,
  FaFileUpload,
  FaCheckCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
import { isAdmin, isSRM } from "src/common/commonFunctions";
import {
  getAllMedhaUsers,
  getAllSrmbyname,
} from "src/utils/function/lookupOptions";
import {
  getAddressOptions,
  getStateDistricts,
} from "src/views/Address/addressActions";
import * as XLSX from "xlsx";
import Check from "./Check";
import moment from "moment";
import {
  getAllBatchs,
  getAllInstitute,
  getStudent,
  getStudentstuId,
  searchStudents,
} from "../../OperationComponents/operationsActions";
import api from "src/apis";
import { GET_STUDENT } from "src/graphql";
const expectedColumns = [
  "Assigned To",
  "Student ID",
  "Institution",
  "Batch Name",
  "Program Name",
  "Certificate Course Name",
  "Category",
  "Sub Category",
  "Start Date",
  "End Date",
  "Certificate Received",
  "Issuing Organization",
];

const UpskillingUpload = (props) => {
  const { onHide } = props;
  const [showForm, setShowForm] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [fileName, setFileName] = useState("");
  const [nextDisabled, setNextDisabled] = useState(false);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [notuploadSuccesFully, setNotUploadSuccesFully] = useState("");
  const [assigneOption, setAssigneeOption] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadNew, setUploadNew] = useState(false);
  const [showModalUpskill, setShowModalUpskill] = useState(false);
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [batchOption, setBatchOption] = useState([]);
  const [programOption, setProgramOption] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
    const incompleteColumns = expectedColumns.filter((col) =>
      data.every(
        (row) => row[col] === null || row[col] === "" || row[col] === undefined
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
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Updated to match YYYY-MM-DD format
    if (datePattern.test(dateStr)) {
      const [year, month, day] = dateStr.split("-");
      return `${year}-${month}-${day}`; // Return the same format since it's already valid
    }
    return null;
  };


  const processParsedData = async (data) => {
    const formattedData = [];
    const notFoundData = [];
    const userId = localStorage.getItem("user_id");
  
    for (const [index, item] of data.entries()) {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });
  
      const currentUser = localStorage.getItem("user_id");
      const batch = batchOption.find((batch) => batch.name === newItem["Batch Name"]);
      const institute = instituteOptions.find((institute) => institute.name === newItem["Institution"]);
      const user = assigneOption.find((user) => user.name === newItem["Assigned To"]);
  
      const batchId = batch ? batch.id : null;
      const instituteId = institute ? institute.id : null;
      const assignedUserId = user ? user.id : null;
  
      const startDate = excelSerialDateToJSDate(newItem["Start Date"]);
      const endDate = excelSerialDateToJSDate(newItem["End Date"]);
  
      const isStartDateValid = isValidDateFormat(startDate);
      const isEndDateValid = isValidDateFormat(endDate);
      let parseDate = false;
  
      if (startDate && endDate) {
        const parsedDate1 = moment(new Date(startDate)).unix();
        const parsedDate2 = moment(new Date(endDate)).unix();
        if (parsedDate2 < parsedDate1) {
          parseDate = true;
        }
      } else {
        parseDate = true;
      }
  
      const studentId = newItem["Student ID"];
      let studentExists = false;
  
      if (studentId) {
        try {
          const student = await searchStudents(studentId);
          studentExists = student.data.studentsConnection.values.length > 0;
        } catch (err) {
          console.error(`Error fetching student with ID: ${studentId}`, err);
        }
      }
  
      if (
        !assignedUserId ||
        !studentExists ||
        !newItem["Program Name"] ||
        !batchId ||
        !isStartDateValid ||
        !isEndDateValid ||
        parseDate
      ) {
        notFoundData.push({
          index: index + 1,
          assigned_to: user
            ? user.name
            : {
                value: newItem["Assigned To"] ? newItem["Assigned To"] : "Please select from dropdown",
                notFound: true,
              },
          student_id: studentExists
            ? newItem["Student ID"]
            : { value: newItem["Student ID"], notFound: true } || "No Data",
          institution: institute
            ? institute.name
            : {
                value: newItem["Institution"] ? newItem["Institution"] : "Please select from dropdown",
                notFound: true,
              },
          batch: batch
            ? batch.name
            : {
                value: newItem["Batch Name"] ? newItem["Batch Name"] : "Please select from dropdown",
                notFound: true,
              },
          start_date: parseDate
            ? { value: startDate, notFound: true }
            : isStartDateValid
            ? startDate
            : { value: startDate ? startDate : "No data", notFound: true },
          end_date: parseDate
            ? { value: endDate, notFound: true }
            : isEndDateValid
            ? endDate
            : { value: endDate ? endDate : "no data", notFound: true },
          course_name: newItem["Certificate Course Name"] || "",
          certificate_received: newItem["Certificate Received"] || "",
          category: newItem["Category"] || "",
          sub_category: newItem["Sub Category"] || "",
          issued_org: newItem["Issuing Organization"] || "",
          program_name: newItem["Program Name"] || "",
        });
      } else {
        formattedData.push({
          assigned_to: assignedUserId || "",
          student_id: newItem["Student ID"] || "",
          institution: newItem["Institution"] || "",
          batch: batchId || "",
          start_date: newItem["Start Date"] || "",
          end_date: newItem["End Date"] || "",
          course_name: newItem["Certificate Course Name"] || "",
          certificate_received: newItem["Certificate Received"] || "",
          category: newItem["Category"] || "",
          sub_category: newItem["Sub Category"] || "",
          issued_org: newItem["Issuing Organization"] || "",
          program_name: newItem["Program Name"] || "",
        });
      }
    }
  
    console.log("Formatted Data:", formattedData);
    console.log("Not Found Data:", notFoundData);
    setExcelData(formattedData);
    setNotuploadedData(notFoundData);
  };
  

  const proceedData = async () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setUploadNew(true);
      props.uploadExcel(excelData, "mentorship");
    }
  };

  const uploadNewData = () => {
    setShowForm(true);
    setUploadNew(!uploadNew);
    setFileName("");
    setNextDisabled(false);
    setUploadSuccesFully("");
  };

  const hideShowModal = () => {
    setShowModalUpskill(false);
    setUploadSuccesFully("");
    setShowForm(true);
    setFileName(""); // Reset the file name display
    setNextDisabled(false); // Optionally disable the next button
    setUploadSuccesFully("");
  };

  const uploadDirect = () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setShowForm(false);
    } else {
      setShowModalUpskill(true);
    }
  };

  useEffect(() => {
    const getbatch = async () => {
      let batchData = await getAllBatchs();
      setBatchOption(batchData);
      let instituteData = await getAllInstitute();
      setInstituteOptions(instituteData);
      const data = await getAllMedhaUsers();
      setAssigneeOption(data);
    };

    getbatch();
  }, [props]);
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
              Upload Student Upskilling Data
            </h1>
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
                            //   disabled={!nextDisabled}
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
        </>
      </Modal>

      <Check
        show={showModalUpskill}
        onHide={() => hideShowModal()}
        notUploadedData={notUploadedData}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default UpskillingUpload;
