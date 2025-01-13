import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import {
  FaEdit,
  FaFileUpload,
  FaCheckCircle,
  FaRegCheckCircle,
} from "react-icons/fa";
import { isAdmin, isSRM } from "src/common/commonFunctions";
import { getAllSrmbyname } from "src/utils/function/lookupOptions";
import {
  getAddressOptions,
  getStateDistricts,
} from "src/views/Address/addressActions";
import * as XLSX from "xlsx";
import Check from "./Check";
import { isValidContact, isValidEmail } from "src/common/commonFunctions";
import { GET_INSTITUTE_NAME } from "src/graphql";
import api from "src/apis";
import {
  getAllInstitute,
  searchPrograms,
} from "../../OperationComponents/operationsActions";

const expectedColumns = [
  "Date of Pitching",
  "Student Name",
  "Course Name",
  "Course Year",
  "Institution",
  "Program name",
  "Phone",
  "WhatsApp Number",
  "Email ID",
  "SRM Name",
  "Medha Area",
];

const PitchingUpload = (props) => {
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
  const [showModalPitching, setShowModalPitching] = useState(false);
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [programOption, setProgramOption] = useState([]);

  useEffect(async () => {
    let instituteData = await getAllInstitute();
    // console.log(instituteData);
    setInstituteOptions(instituteData);
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

  const filterProgram = async (filterValue) => {
    try {
      const { data } = await searchPrograms(filterValue);
      return data.programsConnection.values.map((program) => {
        return program.name;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const processParsedData = async (data) => {
    const formattedData = [];
    const notFoundData = [];
    const userId = localStorage.getItem("user_id");
    let validProgramNames = await filterProgram();
    setProgramOption(validProgramNames);
    data.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });

      const currentUser = localStorage.getItem("user_id");

      const srmcheck = assigneOption.find(
        (user) => user.label === newItem["Assigned To"]
      )?.value;

      const onboardingDate = excelSerialDateToJSDate(
        newItem["Onboarding Date"]
      );

      // const isStartDateValid = isValidDateFormat(startDate);

      const createdby = Number(userId);
      const updatedby = Number(userId);
      const normalizeString = (str) =>
        str.replace(/\s+/g, " ").replace(/\n/g, "").trim();
      // getThisInstitution(normalizeString(newItem["Institution"]))

      const institute = instituteOptions.find(
        (institute) =>
          institute.name === normalizeString(newItem["Institution"])
      );
      const instituteId = institute ? institute.id : null;
      const isValidProgramName = (programName) => {
        return validProgramNames.includes(programName);
      };
      const Date = excelSerialDateToJSDate(newItem["Date of Pitching"]);

      if (
        !newItem["Student Name"] ||
        !newItem["Course Name"] ||
        !newItem["Phone"] ||
        !instituteId ||
        !newItem["Email ID"] ||
        !isValidProgramName(newItem["Program name"])
      ) {
        notFoundData.push({
          index: index + 1,
          date_of_pitching: Date || "",
          student_name: newItem["Student Name"] || "",
          course_name: newItem["Course Name"] || "",
          course_year: newItem["Course Year"] || "",
          institution: newItem["Institution"] || "",
          program_name: newItem["Program name"] || "",
          phone: newItem["Phone"] || "",
          whatsapp_number: newItem["WhatsApp Number"] || "",
          email: newItem["Email ID"] || "",
          remarks: newItem["Remarks"] || "",
          srm_name: newItem["SRM Name"] || "",
          medha_area: newItem["Medha Area"] || "",
        });
      } else {
        formattedData.push({
          date_of_pitching: Date || "",
          student_name: newItem["Student Name"] || "",
          course_name: newItem["Course Name"] || "",
          course_year: newItem["Course Year"] || "",
          institution: newItem["Institution"] || "",
          program_name: newItem["Program name"] || "",
          phone: newItem["Phone"] || "",
          whatsapp_number: newItem["WhatsApp Number"] || "",
          email: newItem["Email ID"] || "",
          remarks: newItem["Remarks"] || "",
          srm_name: srmcheck, // Ensure `srmcheck` is validated
          medha_area: newItem["Medha Area"] || "",
        });
      }
    });

    setExcelData(formattedData);
    setNotuploadedData(notFoundData);
  };

  const uploadDirect = () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setShowForm(false);
    } else {
      setShowModalPitching(true);
    }
  };

  const proceedData = async () => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      setUploadNew(true);
      props.uploadExcel(excelData, "pitching");
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
    setShowModalPitching(false);
    setUploadSuccesFully("");
    setShowForm(true);
    setFileName(""); // Reset the file name display
    setNextDisabled(false); // Optionally disable the next button
    setUploadSuccesFully("");
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
            <h1 className="text--primary bebas-thick mb-0">
              Upload Pitching Data
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
                  onClick={() => console.log("Check")}
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
        show={showModalPitching}
        onHide={() => hideShowModal()}
        instituteData={instituteOptions}
        programOption={programOption}
        notFoundData={notUploadedData}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default PitchingUpload;
