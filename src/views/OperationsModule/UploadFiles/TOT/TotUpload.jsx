import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../../common/commonFunctions";
import { GET_ALL_BATCHES, GET_ALL_INSTITUTES } from "../../../../graphql";
import Select from "react-select";
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
  UpdatePicklist,
  useUpdatePicklist,
} from "../../OperationComponents/operationsActions";
import CheckTot from "./CheckTot";
import { isNumber, set } from "lodash";
import { setAlert } from "src/store/reducers/Notifications/actions";
import moment from "moment";
import { uploadFile } from "src/components/content/Utils";

const expectedColumns = [
  "Full Name",
  "Trainer 1",
  "Project Name",
  "Certificate Provided",
  "Program/Module Name",
  "Project Type",
  "Trainer 2",
  "Government Department partnered with",
  "College Name",
  "District where training took place",
  "State",
  "Age",
  "Gender",
  "Contact Number",
  "Designation",
  "Start Date",
  "End Date",
  "New Entry",
  "Email id",
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

const options = [
  { value: "feild_activity", label: "Field Activity" },
  { value: "collegePitch", label: "Pitching" },
];
const filteypeoptions = [
  { value: "newFileUpload", label: "New File Upload" },
  { value: "newData", label: "New Data Entry" }
];

const TotUpload = (props) => {
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
  const [uploadType, setUploadType] = useState("newData");

  useEffect(() => {
    const getdata = async () => {
      const data = await getAllSrmbyname();
      setAssigneeOption(data);


      const instituteData = await getAllInstitute();
      setInstituteOptions(instituteData)


    };

    getdata();
  }, [props]);

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

    processFileData(data, "Fileupload");
  };

  const processFileData = (jsonData, field = "Fileupload") => {
    if (field == "fileUpload") {
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
    } else {
      return;
    }

  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
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
    getTotPickList().then((data) => {


      // setModuleName(data.module_name.map(item))
      setInstituteOptions(data.TOT_college)
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
      setProjectName(data.project_name.map((item) => item));
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

  const processParsedData = (data) => {
    const formattedData = [];
    const notFoundData = [];
    const userId = localStorage.getItem("user_id");

    data.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });

      const currentUser = localStorage.getItem("user_id");
      const errors = [];

      // 🔍 Validate dropdowns / references
      const StateCheck = stateOptions.find((state) => state === newItem["State"])?.id;

      const targetCollege = newItem["College Name"]?.trim()?.toLowerCase();
      const instituteCheck = instituteOptions.find(
        (i) => i.name.trim().toLowerCase() === targetCollege
      );

      const areaCheck = areaOptions.find((area) => area === newItem["City"])?.id;
      const moduleCheck = moduleName.find((module) => module.value === newItem["Program/Module Name"]);
      const departMentCheck = partnerDept.find(
        (department) => department.value === newItem["Government Department partnered with"]
      );
      const projectCheck = ["Internal", "External"].find(
        (project) => project === newItem["Project Type"]
      );
      const projectNameCheck = projectName.find(
        (project) => project === newItem["Project Name"]
      );

      const trainer_1 = assigneOption.find((user) => user.label === newItem["Trainer 1"])?.value;
      const trainer_2 = assigneOption.find((user) => user.label === newItem["Trainer 2"])?.value;

      // 🔍 Validate dates
      const startDate = excelSerialDateToJSDate(newItem["Start Date"]);
      const endDate = excelSerialDateToJSDate(newItem["End Date"]);
      const isStartDateValid = isValidDateFormat(startDate);
      const isEndDateValid = isValidDateFormat(endDate);

      let parseDate = false;
      if (isStartDateValid && isEndDateValid) {
        const parsedDate1 = moment(new Date(startDate)).unix();
        const parsedDate2 = moment(new Date(endDate)).unix();
        if (parsedDate2 < parsedDate1) {
          parseDate = true;
          errors.push("End Date cannot be earlier than Start Date");
        }
      }

      // 🔍 Collect validation errors
      if (!departMentCheck) errors.push("Government Department is invalid or missing");
      if (!projectCheck) errors.push("Project Type is invalid or missing");
      if (!moduleCheck) errors.push("Program/Module Name is invalid or missing");
      if (!isStartDateValid) errors.push("Start Date is invalid or missing");
      if (!isEndDateValid) errors.push("End Date is invalid or missing");
      if (!projectNameCheck) errors.push("Project Name is invalid or missing");
      if (!newItem["Full Name"]) errors.push("Full Name is missing");
      if (!newItem["College Name"] || !instituteCheck)
        errors.push("College Name is invalid or missing");

      if (errors.length > 0) {
        // ❌ Push invalid data
        notFoundData.push({
          index: index + 1,
          user_name: newItem["Full Name"] ? capitalize(newItem["Full Name"]) : "",
          trainer_1: newItem["Trainer 1"] || "",
          trainer_2: newItem["Trainer 2"] || "",
          email: newItem["Email id"] || "",
          project_name: newItem["Project Name"] || "",
          certificate_given: newItem["Certificate Provided"] || "",
          module_name: newItem["Program/Module Name"] || "",
          project_type: newItem["Project Type"] || "",
          partner_dept: newItem["Government Department partnered with"] || "",
          college: newItem["College Name"] || "",
          city: newItem["District where training took place"] || "",
          state: newItem["State"] || "",
          age: newItem["Age"] || "",
          gender: newItem["Gender"] || "",
          contact: newItem["Contact Number"] || "",
          designation: newItem["Designation"] || "",
          start_date: startDate.includes('NaN') ? newItem["Start Date"] : startDate || "",
          end_date: endDate.includes('NaN') ? newItem["End Date"] : endDate || "",
          new_entry: newItem["New Entry"] || "",
          error: errors.join(", "), // 🔑 unified error messages
        });
      } else {
        // ✅ Push valid data
        formattedData.push({
          user_name: newItem["Full Name"] ? capitalize(newItem["Full Name"]) : "",
          trainer_1: Number(trainer_1),
          trainer_2: Number(trainer_2),
          project_name: newItem["Project Name"],
          certificate_given: newItem["Certificate Provided"],
          module_name: newItem["Program/Module Name"],
          project_type: newItem["Project Type"],
          partner_dept: newItem["Government Department partnered with"],
          college: newItem["College Name"] ? capitalize(newItem["College Name"]) : "",
          city: newItem["District where training took place"]
            ? capitalize(newItem["District where training took place"])
            : "",
          state: newItem["State"] ? capitalize(newItem["State"]) : "",
          age: newItem["Age"],
          gender: newItem["Gender"] ? capitalize(newItem["Gender"]) : "",
          contact: newItem["Contact Number"],
          designation: newItem["Designation"]
            ? capitalize(newItem["Designation"])
            : "",
          start_date: startDate,
          end_date: endDate,
          email: newItem["Email id"],
          createdby: Number(userId),
          updatedby: currentUser,
          new_entry: newItem["New Entry"],
        });
      }
    });

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
      props.uploadExcel(excelData, "tot");
    }
  };
  // const [notUploadedData_newfile, setnotUploadedData_newfile] = useState(false);
  // const [fileName_new, setFileName_new] = useState("")
  const [notUploadSuccesFully_newfile, setNotUploadSuccesFully_newfile] = useState('')
  // const [UploadSuccesFully_newfile,setUploadSuccesFully_newfile]=useState('')
  const [validationResult, setValidationResult] = useState({
    isValid: false,
    message: "",
    headers: []
  });
  const [fileForUpload, setFileForUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [fileNameError, setFileNameError] = useState("");

  // Create refs for file inputs at the top with your other refs
  const fileInputRef = useRef(null);
  const fileInputRefNew = useRef(null);

  // ... your existing code
  const expectedFileName = "ToT-Template.xlsx";

  // ... your existing code

  // Add this function to reset the new file input
  const resetNewFileInput = () => {
    if (fileInputRefNew.current) {
      fileInputRefNew.current.value = "";
    }
    setValidationResult({
      isValid: false,
      message: "",
      headers: [],
      fileName: ""
    });
    setFileForUpload(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus("");
    setUploadResult(null);
    setFileNameError("");
  };

  // Function to validate file name
  const validateFileName = (fileName) => {
    if (fileName !== expectedFileName) {
      setFileNameError(`File name must be "${expectedFileName}"`);
      return false;
    }
    setFileNameError("");
    return true;
  };

  const handleFileChangeNewFile = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) {
      setValidationResult({
        isValid: false,
        message: "Please select a valid .xlsx file",
        headers: [],
        fileName: ""
      });
      setFileForUpload(null);
      setFileNameError("");
      return;
    }

    // Validate file name first
    const isFileNameValid = validateFileName(file.name);
    if (!isFileNameValid) {
      setValidationResult({
        isValid: false,
        message: "Invalid file name",
        headers: [],
        fileName: file.name
      });
      setFileForUpload(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target.result;
      try {
        const workbook = XLSX.read(fileData, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = results[0];

        // Reset file input to allow re-uploading the same file
        if (fileInputRefNew.current) {
          fileInputRefNew.current.value = "";
        }

        // Your validation logic
        if (headers.length !== expectedColumns.length) {
          const message = `Array length mismatch. Headers has ${headers.length} items, expected ${expectedColumns.length} items.`;
          setValidationResult({ isValid: false, message, headers: [], fileName: file.name });
          setFileForUpload(null);
          return;
        }

        // Check if all expected columns are present in headers
        const missingColumns = expectedColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          const message = `Missing columns: ${missingColumns.join(', ')}`;
          setValidationResult({ isValid: false, message, headers: [], fileName: file.name });
          setFileForUpload(null);
          return;
        }

        // Check for extra columns
        const extraColumns = headers.filter(header => !expectedColumns.includes(header));
        if (extraColumns.length > 0) {
          const message = `Unexpected columns found: ${extraColumns.join(', ')}`;
          setValidationResult({ isValid: false, message, headers: [], fileName: file.name });
          setFileForUpload(null);
          return;
        }

        // Check order
        const orderMismatch = headers.some((header, index) => header !== expectedColumns[index]);
        if (orderMismatch) {
          const message = "All columns are present but order doesn't match expected order.";
          setValidationResult({ isValid: true, message, headers, fileName: file.name });
          setFileForUpload(file); // Store the file for upload
          return;
        }

        // Perfect match
        const message = "Headers perfectly match expected columns!";
        setValidationResult({ isValid: true, message, headers, fileName: file.name });
        setFileForUpload(file); // Store the file for upload

      } catch (error) {
        // Reset file input on error too
        if (fileInputRefNew.current) {
          fileInputRefNew.current.value = "";
        }
        setValidationResult({
          isValid: false,
          message: error?.message || "Error processing file",
          headers: [],
          fileName: file.name
        });
        setFileForUpload(null);
      }
    };

    reader.onerror = () => {
      // Reset file input on error
      if (fileInputRefNew.current) {
        fileInputRefNew.current.value = "";
      }
      setValidationResult({
        isValid: false,
        message: "Error reading file",
        headers: [],
        fileName: file.name
      });
      setFileForUpload(null);
    };

    reader.readAsBinaryString(file);
  };

  // Function to upload file using your existing GraphQL mutation
  // Function to upload file using your existing GraphQL mutation
  const uploadFileToServer = async () => {
    if (!fileForUpload) return;

    setIsUploading(true);
    setUploadStatus("Uploading file...");
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // Use your existing uploadFile function
      const result = await uploadFile(fileForUpload);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Based on your example response: { data: { data: { upload: { id: "28316", url: "https://..." } } } }
      if (result.data && result.data.data && result.data.data.upload) {
        const uploadData = result.data.data.upload;

        if (uploadData.id && uploadData.url) {
          setUploadStatus("File successfully uploaded!");
          setUploadResult(uploadData);

          // console.log("Uploaded file ID:", uploadData.id);
          // console.log("Uploaded file URL:", uploadData.url);

          // Store the file info in your database or state as needed
          props.updateToturl(uploadData.url)
          UpdatePicklist(56,[uploadData.url])
          storeFileInfoInDatabase(uploadData);
        } else {
          throw new Error('Upload failed: Missing id or url in response');
        }
      } else {
        console.error("Unexpected response structure:", result);
        throw new Error('Upload failed: Unexpected response structure from server');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Function to store file info in your database
  const storeFileInfoInDatabase = async (fileInfo) => {
    try {
      // Here you would make another API call to store the file information
      // in your database along with any metadata you need

      // Example: You might want to associate this file with the current user,
      // add timestamps, or link it to specific data
      // await yourApiCallToStoreFileInfo(fileInfo);

    } catch (error) {
      console.error('Database storage error:', error);
    }
  };

  const isUploadButtonEnabled = validationResult.isValid &&
    !fileNameError &&
    fileForUpload &&
    !isUploading;

  const cancelNewfileupload = () => {
    // Reset all state values related to file upload
    setValidationResult({
      isValid: false,
      message: "",
      headers: [],
      fileName: ""
    });
    setFileForUpload(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus("");
    setUploadResult(null);
    setFileNameError("");

    // Clear the file input
    if (fileInputRefNew.current) {
      fileInputRefNew.current.value = "";
    }

    // Switch back to new data entry mode
    setUploadType('newData');
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
        <div className="mb-4  col-3" style={{ marginLeft: '2rem' }}>
          <label htmlFor="uploadType" className="text--primary bebas-normal">
            Select Upload Type
          </label>
          <Select
            id="uploadType"
            className="basic-single"
            classNamePrefix="select"
            value={options.find((option) => option.value === uploadType)}
            onChange={(selectedOption) => {
              setUploadType(selectedOption.value);
            }}
            options={filteypeoptions}
            placeholder="Choose upload type..."
          />
        </div>
        {uploadType == "newData" && <Styled>
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
        </Styled>}

        {uploadType !== "newData" && (
          <Styled>
            <Modal.Body className="bg-white">
              <div className="uploader-container">
                <div className="imageUploader">
                  <p className="upload-helper-text">Click Here To Upload</p>
                  <div className="upload-helper-icon">
                    <FaFileUpload size={30} color={"#257b69"} />
                  </div>
                  <input
                    ref={fileInputRefNew}
                    accept=".xlsx"
                    type="file"
                    multiple={false}
                    name="file-uploader"
                    onChange={handleFileChangeNewFile}
                    className="uploaderInput"
                  />
                </div>
                <label className="text--primary latto-bold text-center">
                  Upload File
                </label>
              </div>
              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant="btn btn-danger "
                  onClick={() => cancelNewfileupload()}

                >
                  {/* <i className="fas fa-cloud-upload-alt me-2"></i> */}
                  Cancel
                </Button>

                <Button
                  variant="success"
                  onClick={uploadFileToServer}
                  disabled={!isUploadButtonEnabled}
                >
                  {/* <i className="fas fa-cloud-upload-alt me-2"></i> */}
                  Upload File
                </Button>
              </div>


              {validationResult.fileName && (
                <div className="mt-3 ">
                  <h6 className="text--primary text-center">File: {validationResult.fileName}</h6>

                  {/* Show file name error if exists */}
                  {/* Combined error display */}
                  {(fileNameError || validationResult.message) && (
                    <div className={`alert ${fileNameError ? 'alert-danger' : validationResult.isValid ? 'alert-success' : 'alert-danger'}`}>
                      <i className={`fas ${fileNameError || !validationResult.isValid ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
                      {fileNameError || validationResult.message}
                    </div>
                  )}

                  {/* Show upload button only when file is valid AND name is correct */}

                  {validationResult.isValid && !isUploading && !uploadResult && (
                    <div className="text-center mt-3">

                      {!isUploadButtonEnabled && !fileNameError && (
                        <p className="text-muted small mt-2">
                          Please fix all validation issues before uploading
                        </p>
                      )}
                    </div>
                  )}

                  {/* Show progress when uploading */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {uploadProgress}%
                        </div>
                      </div>
                      <p className="text-center mt-2">{uploadStatus}</p>
                    </div>
                  )}

                  {/* Show success message after upload */}
                  {uploadResult && (
                    <div className="alert alert-success mt-3">
                      <i className="fas fa-check-circle"></i>
                      File successfully uploaded!
                      <div className="mt-2">
                        <small>File ID: {uploadResult.id}</small>
                        <br />
                        {/* <small>
                        File URL:{" "}
                        <a href={uploadResult.url} target="_blank" rel="noopener noreferrer">
                          {uploadResult.url}
                        </a>
                      </small> */}
                      </div>
                    </div>
                  )}

                  {/* Show error message if upload failed */}
                  {uploadStatus.includes('failed') && (
                    <div className="alert alert-danger mt-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {uploadStatus}
                    </div>
                  )}

                  <button
                    className="btn btn-secondary mt-2"
                    onClick={resetNewFileInput}
                    disabled={isUploading}
                  >
                    <i className="fas fa-redo"></i> Upload Different File
                  </button>
                </div>
              )}
            </Modal.Body>
          </Styled>
        )}


      </Modal>

      <CheckTot
        show={showModalTOT}
        onHide={() => hideShowModal()}
        notUploadedData={notUploadedData}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default TotUpload;
