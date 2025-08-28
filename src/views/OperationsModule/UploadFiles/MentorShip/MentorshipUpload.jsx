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

const expectedColumns = [
  "Mentor Name",
  "Contact",
  "Email ID",
  "Mentor's Domain",
  "Designation/Title",
  "Mentor's Company Name",
  "Mentor's Area",
  "Mentor's State",
  "Outreach (Offline/Online)",
  "Specify Others (If Mentor's domain is 'others')",
  "Onboarding Date",
  "Social Media Profile Link",
  "Medha Area",
  "Medha Program Name",
  "Status",
  "Additional Comments",
  "Assigned To",
];

const requiredColumns = [
  "Mentor Name",
  "Contact",
  "Email ID",
  "Mentor's Domain",
  "Mentor's Area",
  "Assigned To",
];

const MentorshipUpload = (props) => {
  const { onHide } = props;
  const [showForm, setShowForm] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [fileName, setFileName] = useState("");
  const [nextDisabled, setNextDisabled] = useState(false);
  const [uploadSuccesFully, setUploadSuccesFully] = useState("");
  const [notuploadSuccesFully, setNotUploadSuccesFully] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [assigneOption, setAssigneeOption] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [notUploadedData, setNotuploadedData] = useState([]);
  const [uploadNew, setUploadNew] = useState(false);
  const [showModalMentor, setShowModalMentor] = useState(false);

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
    const missingColumns = requiredColumns.filter((col) => {
      console.log(col);

      return !fileColumns.includes(col.trim());
    });
    const extraColumns = fileColumns.filter(
      (col) => !expectedColumns.includes(col.trim())
    );
    const incompleteColumns = requiredColumns.filter((col) =>
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

  useEffect(() => {
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
    const getdata = async () => {
      const data = await getAllSrmbyname();
      setAssigneeOption(data);
    };

    getdata();
  }, [props]);

  const processParsedData = (data) => {
    const formattedData = [];
    const notFoundData = [];
    const userId = localStorage.getItem("user_id");

    // Function to validate phone numbers (must be exactly 10 digits)
    const isValidContact = (contact) => {
      const pattern = /^[0-9]{10}$/; // 10-digit number regex
      return contact && pattern.test(contact);
    };

    // Function to validate email addresse
    const isValidEmail = (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email regex
      return email && pattern.test(email);
    };

    data.forEach((item, index) => {
      const newItem = {};
      Object.keys(item).forEach((key) => {
        newItem[key] = item[key];
      });

      const currentUser = localStorage.getItem("user_id");

      const StateCheck = stateOptions.find(
        (state) => state === newItem["State"]
      )?.id;
      const areaCheck = areaOptions.find(
        (area) => area === newItem["City"]
      )?.id;

      const srmcheck = assigneOption.find(
        (user) => user.label === newItem["Assigned To"]
      )?.value;

      const onboardingDate = excelSerialDateToJSDate(
        newItem["Onboarding Date"]
      );
      const mentorDomainCheck = newItem["Mentor's Domain"] == 'Others'

      const createdby = Number(userId);
      const updatedby = Number(userId);

      if (
        !srmcheck ||
        !newItem["Mentor Name"] ||
        !newItem["Email ID"] ||
        !newItem["Mentor's Domain"] ||
        !isValidContact(newItem["Contact"]) || // Phone number validation
        !isValidEmail(newItem["Email ID"]) || // Email validation
        !newItem["Mentor's Company Name"] ||
        !newItem["Designation/Title"] || 
        (newItem["Mentor's Domain"] =="Others" && !newItem["Specify Others (If Mentor's domain is 'others')"] )
      ) {
        notFoundData.push({
          index: index + 1,
          assigned_to: newItem["Assigned To"] || "",
          mentor_name: newItem["Mentor Name"] || "",
          email: newItem["Email ID"] || "",
          mentor_domain: newItem["Mentor's Domain"] || "",
          mentor_company_name: newItem["Mentor's Company Name"] || "",
          designation: newItem["Designation/Title"] || "",
          mentor_area: newItem["Mentor's Area"] || "",
          mentor_state: newItem["Mentor's State"] || "",
          outreach: newItem["Outreach (Offline/Online)"] || "",
          onboarding_date: onboardingDate || "",
          social_media_profile_link: newItem["Social Media Profile Link"] || "",
          medha_area: newItem["Medha Area"] || "",
          status: newItem["Status"] || "",
          program_name: newItem["Medha Program Name"] || "",
          specify_other: mentorDomainCheck ? newItem["Specify Others (If Mentor's domain is 'others')"] || "" : "",
          contact: newItem["Contact"] || "",
          isAssignedToInvalid: !srmcheck,
          isMentorNameInvalid: !newItem["Mentor Name"],
          isEmailInvalid: !newItem["Email ID"] || !isValidEmail(newItem["Email ID"]),
          isDomainInvalid: !newItem["Mentor's Domain"],
          isContactInvalid: !isValidContact(newItem["Contact"]),
          isCompanyNameInvalid: !newItem["Mentor's Company Name"],
          isDesignationInvalid: !newItem["Designation/Title"]
        });
      } else {
        formattedData.push({
          assigned_to: srmcheck,
          mentor_name: newItem["Mentor Name"] || "",
          email: newItem["Email ID"] || "",
          mentor_domain: newItem["Mentor's Domain"] || "",
          mentor_company_name: newItem["Mentor's Company Name"] || "",
          designation: newItem["Designation/Title"] || "",
          mentor_area: newItem["Mentor's Area"] || "",
          mentor_state: newItem["Mentor's State"] || "",
          outreach: newItem["Outreach (Offline/Online)"] || "",
          onboarding_date: onboardingDate || "",
          social_media_profile_link: newItem["Social Media Profile Link"] || "",
          medha_area: newItem["Medha Area"] || "",
          specify_other: newItem["Specify Others (If Mentor's domain is 'others')"] || "",
          status: newItem["Status"] || "",
          program_name: newItem["Medha Program Name"] || "",
          contact: newItem["Contact"] || "",
          createdby: createdby,
          updatedby: currentUser,
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
      setShowModalMentor(true);
    }
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
    setShowModalMentor(false);
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
              Upload Mentorship Data
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
                  onClick={() => props.closeThepopus()}
                  className="btn btn-danger px-4 mx-4 mt-2"
                  style={{ height: "2.5rem" }}
                >
                  Close
                </button>

                {!uploadNew ? (
                  <button
                    type="button"
                    disabled={!nextDisabled}
                    onClick={() => proceedData()}
                    className="btn btn-primary px-4 mx-4 mt-2"
                    style={{ height: "2.5rem" }}
                  >
                    Proceed
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!nextDisabled}
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
        show={showModalMentor}
        onHide={() => hideShowModal()}
        notUploadedData={notUploadedData}
        excelData={excelData}
        uploadExcel={props.uploadExcel}
      />
    </>
  );
};

export default MentorshipUpload;
