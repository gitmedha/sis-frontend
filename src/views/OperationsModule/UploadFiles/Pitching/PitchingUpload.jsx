import React, { useState, useEffect, useCallback } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { FaFileUpload, FaCheckCircle, FaRegCheckCircle, FaEdit } from "react-icons/fa";
import { getAllMedhaUsers } from "src/utils/function/lookupOptions";
import * as XLSX from "xlsx";
import Check from "./Check";
import { getAllInstitute, searchPrograms } from "../../OperationComponents/operationsActions";
import PropTypes from 'prop-types';
import { isAdmin, isSRM } from "src/common/commonFunctions";

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
  "Remarks",
];

const requiredColumns = [
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

const PitchingUpload = ({ onHide, uploadExcel }) => {
  const [state, setState] = useState({
    showForm: true,
    showSpinner: true,
    fileName: "",
    nextDisabled: false,
    errorMessage: "",
    excelData: [],
    notUploadedData: [],
    uploadNew: false,
    showModalPitching: false,
  });

  const [data, setData] = useState({
    assigneeOptions: [],
    instituteOptions: [],
    programOptions: [],
  });

  const { showForm, showSpinner, fileName, nextDisabled, errorMessage, excelData, notUploadedData, uploadNew, showModalPitching } = state;
  const { assigneeOptions, instituteOptions, programOptions } = data;

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateData = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const showError = useCallback((message) => {
    updateState({ errorMessage: message });
  }, [updateState]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [users, institutes] = await Promise.all([
          getAllMedhaUsers(),
          getAllInstitute()
        ]);
        updateData({ 
          assigneeOptions: users || [],
          instituteOptions: institutes || [] 
        });
      } catch (error) {
        showError('Failed to load initial data. Please refresh the page.');
      } finally {
        const timer = setTimeout(() => updateState({ showSpinner: false }), 1000);
        return () => clearTimeout(timer);
      }
    };

    fetchInitialData();
  }, [updateData, updateState, showError]);

  const isValidDateFormat = (dateStr) => {
    const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
    if (datePattern.test(dateStr)) {
      const [year, month, day] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }

    return null;
  };

  const validateColumns = useCallback((data, expectedColumns) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      showError("File is empty or invalid. Please select a valid file with data.");
      return false;
    }

    const fileColumns = Object.keys(data[0] || {});
    
    const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col.trim()));
    const extraColumns = fileColumns.filter(col => !expectedColumns.includes(col.trim()));
    
    const incompleteColumns = requiredColumns.filter(col => 
      data.every(row => !row[col] && row[col] !== 0)
    );

    if (incompleteColumns.length > 0) {
      showError(`Required columns are missing data: ${incompleteColumns.join(", ")}`);
      return false;
    }

    if (data.length > 200) {
      showError("Maximum 200 rows allowed per upload");
      return false;
    }

    if (missingColumns.length > 0) {
      showError(`Missing required columns: ${missingColumns.join(", ")}`);
      return false;
    }

    if (extraColumns.length > 0) {
      showError(`Unexpected columns found: ${extraColumns.join(", ")}`);
      return false;
    }
    
    return true;
  }, [showError]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    
    updateState({
      showForm: true,
      fileName: "",
      nextDisabled: false,
      errorMessage: ""
    });

    if (!file) {
      showError("No file selected");
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showError("Only Excel (.xlsx, .xls) files are allowed");
      return;
    }

    updateState({ fileName: `${file.name} Uploaded` });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        convertExcel(e.target.result);
      } catch (error) {
        showError(error?.message || "Error processing the file");
      }
    };
    reader.onerror = () => showError("Error reading the file");
    reader.readAsBinaryString(file);
    
    // Reset file input
    event.target.value = "";
  }, [showError, updateState]);

  const convertExcel = useCallback((excelData) => {
    try {
      const workbook = XLSX.read(excelData, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (results.length < 2) {
        throw new Error("The file is empty or has no data");
      }

      const headers = results[0].map(header => header?.toString().trim() || '');
      const data = [];

      for (let i = 1; i < results.length; i++) {
        const row = results[i];
        if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) continue;
        
        const newItem = {};
        headers.forEach((header, index) => {
          if (header) {
            newItem[header] = row[index] !== undefined ? row[index] : "";
          }
        });
        data.push(newItem);
      }

      processFileData(data);
    } catch (error) {
      throw new Error(`Error parsing Excel file: ${error.message}`);
    }
  }, []);

  const processFileData = useCallback((jsonData) => {
    if (!jsonData || !Array.isArray(jsonData)) {
      showError("Invalid data format");
      return;
    }

    const validRecords = jsonData.filter(row => 
      row && Object.values(row).some(value => 
        value !== null && value !== undefined && value !== ""
      )
    );

    if (validRecords.length === 0) {
      showError("No valid data found in the file");
      return;
    }

    if (validateColumns(validRecords, expectedColumns)) {
      updateState({ nextDisabled: true });
      processParsedData(validRecords);
    }
  }, [showError, updateState, validateColumns]);

  const excelSerialDateToJSDate = useCallback((serial) => {
    try {
      if (!serial && serial !== 0) return "";
      
      // If it's already a date string, return it
      if (typeof serial === 'string' && !isNaN(Date.parse(serial))) {
        const date = new Date(serial);
        return date.toISOString().split('T')[0];
      }
      
      // Handle Excel serial date
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(excelEpoch.getTime() + (serial - 1) * 86400000);
      
      // Handle Excel's leap year bug (1900 is not a leap year)
      if (serial >= 60) {
        date.setDate(date.getDate() - 1);
      }
      
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "";
    }
  }, []);

  const filterProgram = useCallback(async (filterValue = '') => {
    try {
      const { data } = await searchPrograms(filterValue);
      const programs = data?.programsConnection?.values?.map(program => program.name) || [];
      updateData({ programOptions: programs });
      return programs;
    } catch (error) {
      showError('Failed to load program data. Please try again.');
      return [];
    }
  }, [showError, updateData]);

  const processParsedData = async (data) => {
    const formattedData = [];
    const notFoundData = [];
    
    try {
      const userId = localStorage.getItem("user_id") || '';
      const validProgramNames = await filterProgram();
      updateData({ programOptions: validProgramNames });
    
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex = /^\d{10}$/;
  
    data.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });
  
      const currentUser = localStorage.getItem("user_id");
      const srmcheck = assigneeOptions.find(
        (user) => user.name === newItem["SRM Name"]
      )?.id || '';
  
      const onboardingDate = excelSerialDateToJSDate(newItem["Onboarding Date"]);
      const createdby = Number(userId);
      const updatedby = Number(userId);
  
      const normalizeString = (str) =>
        str && typeof str === 'string' ? str.replace(/\s+/g, " ").replace(/\n/g, "").trim() : '';
  
      const institute = instituteOptions.find(
        (institute) => institute.name === normalizeString(newItem["Institution"])
      );
      const instituteId = institute ? institute.id : null;
  
      const isValidProgramName = (programName) => {
        return validProgramNames.includes(programName);
      };
      // let pitchdate = isValidDateFormat(Date);
      const Date = excelSerialDateToJSDate(newItem["Date of Pitching"]);
      
      const phoneValid = phoneRegex.test(newItem["Phone"]);
      const whatsappValid = phoneRegex.test(newItem["WhatsApp Number"]);
      const emailValid = emailRegex.test(newItem["Email ID"]);
      
      if (
  !newItem["Student Name"] ||
  !newItem["Course Name"] ||
  !phoneValid ||
  !instituteId ||
  Date.includes("NaN") ||
  !isValidProgramName(newItem["Program name"]) ||
  (newItem["WhatsApp Number"] && !whatsappValid) ||
  (newItem["Email ID"] && !emailValid)
) {
        
        const errors = [];
        if (!newItem["Student Name"]) errors.push("Student Name is required");
        if (!newItem["Course Name"]) errors.push("Course Name is required");
        if (!phoneValid) errors.push("Phone number must be 10 digits");
        if (!newItem["Institution"] || typeof newItem["Institution"] !== 'string') errors.push("Invalid or empty Institution name");
        else if (!instituteId) errors.push("Institution name not found");
        if (!emailValid) errors.push("Invalid Email format");
        if (!isValidProgramName(newItem["Program name"])) errors.push("Invalid Program name");
        if (Date.includes("NaN")) errors.push("Invalid Date of Pitching, expected YYYY/MM/DD");
        if (newItem["WhatsApp Number"] && !whatsappValid) errors.push("WhatsApp number must be 10 digits");
        notFoundData.push({
          index: index + 1,
          date_of_pitching: newItem['Date of Pitching'] || "",
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
          error: errors.join(", ")
        });
      } else {
        formattedData.push({
          pitch_date: Date || "",
          student_name: newItem["Student Name"] || "",
          course_name: newItem["Course Name"] || "",
          course_year: newItem["Course Year"] || "",
          college_name: newItem["Institution"] || "",
          program_name: newItem["Program name"] || "",
          phone: newItem["Phone"] || "",
          whatsapp: newItem["WhatsApp Number"] || "",
          email: newItem["Email ID"] || "",
          remarks: newItem["Remarks"] || "",
          srm_name: srmcheck || "",
          area: newItem["Medha Area"] || "",
          createdby: createdby,
          updatedby: updatedby
        });
      }
    });
    
      updateState({
        excelData: formattedData,
        notUploadedData: notFoundData
      });
    } catch (error) {
      showError('An error occurred while processing the file. Please try again.');
    }
  };
  

  const uploadDirect = useCallback(() => {
    if (notUploadedData.length === 0 && excelData.length > 0) {
      updateState({ showForm: false });
    } else {
      updateState({ showModalPitching: true });
    }
  }, [notUploadedData.length, excelData.length, updateState]);

  const proceedData = useCallback(() => {
    if (notUploadedData.length === 0 && excelData.length > 0 && !uploadNew) {
      updateState({ uploadNew: true });
      uploadExcel(excelData, "pitching");
    }
  }, [notUploadedData.length, excelData.length, uploadNew, uploadExcel]);

  const resetForm = useCallback(() => {
    updateState({
      showForm: true,
      fileName: "",
      nextDisabled: false,
      excelData: [],
      notUploadedData: [],
      errorMessage: ""
    });
  }, [updateState]);

  const uploadNewData = useCallback(() => {
    updateState({ uploadNew: false });
    resetForm();
  }, [resetForm, updateState]);

  const hideShowModal = useCallback(() => {
    updateState({ showModalPitching: false });
    resetForm();
  }, [resetForm, updateState]);
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
                    {errorMessage ? (
                      <div className="text-danger d-flex justify-content-center">
                        {errorMessage}
                      </div>
                    ) : (
                      <div className="text-success d-flex justify-content-center">
                        {fileName}
                      </div>
                    )}
                    {(isSRM() || isAdmin()) && (
                      <div className="row mb-4 mt-2">
                        <div className="col-md-12 d-flex justify-content-center">
                          <button
                            type="button"
                            onClick={onHide}
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
                  onClick={onHide}
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
        onHide={hideShowModal}
        instituteData={instituteOptions}
        programOption={programOptions}
        notFoundData={notUploadedData}
        excelData={excelData}
        uploadExcel={uploadExcel}
      />
    </>
  );
};

PitchingUpload.propTypes = {
  onHide: PropTypes.func.isRequired,
  uploadExcel: PropTypes.func.isRequired
};

export default React.memo(PitchingUpload);
