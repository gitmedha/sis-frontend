import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
// import StudentOutreachRowdata from "./StudentOutreachRowdata";
import StudentOutreachRowdata from "./StudentOutreachRowdata";
const AddStudentOutreach = (props) => {
  const { onHide, show, setAlert } = props;
  const userId = localStorage.getItem("user_id");
  const [rows, setRows] = useState([
    {
      start_date: "",
      end_date: "",
      category: "",
      department: "",
      institution_type: "",
      quarter: "",
      month: "",
      state: "",
      faculty: 0,
      students: 0,
      year_fy: "",
      male: 0,
      female: 0,
    },
  ]);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  // Update a row
  const updateRow = (field, value) => {
    // Track category changes
    if (field === "category") {
      setCurrentCategory(value);
      // If changing to a non-Student Outreach category, make sure save button isn't disabled
      if (value !== "Student Outreach") {
        setIsSaveDisabled(false);
      }
    }
    
    setRows(prevRows => {
      const updatedRow = { ...prevRows[0], [field]: value };
      return [updatedRow];
    });
  };

  // Validate all rows
  const validateRows = () => {
    const row = rows[0];
    
    // Check if we have dates filled
    const areDatesValid = row.start_date && row.end_date;
    
    // Base validation for all categories
    let baseValidation = 
      areDatesValid &&
      row.category &&
      row.department &&
      row.quarter &&
      row.month &&
      row.state &&
      row.year_fy;
      
    // For Student Outreach category
    if (row.category === "Student Outreach") {
      return baseValidation && 
        row.institution_type &&
        !isNaN(row.faculty) &&
        row.faculty > 0 &&
        !isNaN(row.students) &&
        row.students > 0;
    }
    
    // For other categories, also validate male and female counts
    return baseValidation && 
      row.institution_type &&
      !isNaN(row.male) &&
      !isNaN(row.female) &&
      (row.male > 0 || row.female > 0); // At least one must be greater than 0
  };

  // Enable/disable Save button based on validation
  useEffect(() => {
    const isValid = validateRows();
    console.log("Validation result:", isValid, rows[0]);
    setDisableSaveButton(!isValid);
  }, [rows]);

  // Effect to reset isSaveDisabled when category changes
  useEffect(() => {
    // Only apply the faculty=0 condition for Student Outreach
    if (rows[0].category !== "Student Outreach") {
      setIsSaveDisabled(false);
    }
  }, [rows[0].category]);

  // Handle form submission
  const onSubmit = () => {
    if (!validateRows()) {
      setAlert("Please fill all required fields correctly.", "error");
      return;
    }

    const data = rows.map((row) => ({
      category: row.category,
      department: row.department,
      institution_type: row.institution_type,
      quarter: row.quarter,
      month: row.month,
      state: row.state,
      faculty: row.faculty,
      students: row.students,
      year_fy: row.year_fy,
      male: row.male,
      female: row.female,
      isactive: true,
      created_by_frontend: Number(userId),
      updated_by_frontend: null,
    }));

    // Reset form after submission - clear ALL fields
    setRows([
      {
        start_date: "",
        end_date: "",
        category: "",
        department: "",
        institution_type: "",
        quarter: "",
        month: "",
        state: "",
        faculty: 0,
        students: 0,
        year_fy: "",
        male: 0,
        female: 0,
      },
    ]);
    
    // Reset save button states
    setDisableSaveButton(true);
    setIsSaveDisabled(false);
    
    // Call onHide with data to make the api call
    onHide("studentOutreach", data);
  };

  // Create a function to handle the close button click
  const handleClose = () => {
    // Reset form 
    setRows([
      {
        start_date: "",
        end_date: "",
        category: "",
        department: "",
        institution_type: "",
        quarter: "",
        month: "",
        state: "",
        faculty: 0,
        students: 0,
        year_fy: "",
        male: 0,
        female: 0,
      },
    ]);
    
    // Reset save button states
    setDisableSaveButton(true);
    setIsSaveDisabled(false);
    
    // Close the modal
    onHide();
  };

  return (
    <Modal
      centered
      size="xl"
      responsive
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      id="custom-modal"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center justify-content-between"
        >
          <h2 className="text--primary bebas-thick mb-0">
            {props.id ? props.full_name : "Add New Student Outreach Data"}
          </h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <div id="CreateOptsData">
          <div className="table-container">
            <table className="create_data_table">
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Financial Year *</th>
                  <th>Quarter</th>
                  <th>Month</th>
                  <th>Category</th>
                  <th>State</th>
                  <th>Department</th>
                  {currentCategory === "Student Outreach" && <th>Faculty</th>}
                  <th>Male</th>
                  <th>Female</th>
                  <th>Institution Type</th>
                  {currentCategory === "Student Outreach" && <th>Students</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <StudentOutreachRowdata
                    key={index}
                    row={row}
                    setRows={setRows}
                    updateRow={updateRow}
                    setIsSaveDisabled={setIsSaveDisabled}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end between_class bulk_add_actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-danger btn-regular mr-2 bulk_add_button"
            >
              CLOSE
            </button>
            <button
              className="btn btn-primary btn-regular mx-0 bulk_add_button"
              type="submit"
              onClick={onSubmit}
              disabled={disableSaveButton || isSaveDisabled}
            >
              SAVE
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapActionsToProps = {
  setAlert,
};

export default connect(null, mapActionsToProps)(AddStudentOutreach);
