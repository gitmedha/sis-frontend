import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import StudentOutreachRowdata from "./StudentOutreachRowdata";

const AddStudentOutreach = (props) => {
  const { onHide, show, setAlert } = props;
  const iconStyles = { color: "#257b69", fontSize: "1.5em" };
  const userId = localStorage.getItem("user_id");
  const [rows, setRows] = useState([
    {
      start_date: "",
      end_date: "",
      category: "",
      department: "",
      gender: "",
      institution_type: "",
      quarter: "",
      month: "",
      state: "",
      faculty: 0,
      students: 0,
      year_fy: "",
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
    }
    
    setRows(prevRows => {
      const updatedRow = { ...prevRows[0], [field]: value };
      return [updatedRow];
    });
  };

  // Validate all rows
  const validateRows = () => {
    const row = rows[0];
    
    // Base validation for all categories
    const baseValidation = 
      row.category &&
      row.department &&
      row.gender &&
      row.quarter &&
      row.month &&
      row.state &&
      row.year_fy &&
      !isNaN(row.students) &&
      row.students > 0;
      
    // For Student Outreach category, also validate faculty and institution_type
    if (row.category === "Student Outreach") {
      return baseValidation && 
        row.institution_type &&
        !isNaN(row.faculty) &&
        row.faculty > 0;
    }
    
    // For other categories, base validation is sufficient
    return baseValidation;
  };

  // Enable/disable Save button based on validation
  useEffect(() => {
    const isValid = validateRows();
    setDisableSaveButton(!isValid);
  }, [rows]);

  // Handle form submission
  const onSubmit = () => {
    if (!validateRows()) {
      setAlert("Please fill all required fields correctly.", "error");
      return;
    }

    const data = rows.map((row) => ({
      category: row.category,
      department: row.department,
      gender: row.gender,
      institution_type: row.institution_type,
      quarter: row.quarter,
      month: row.month,
      state: row.state,
      faculty: row.faculty,
      students: row.students,
      year_fy: row.year_fy,
      isactive: true,
      created_by_frontend: Number(userId),
      updated_by_frontend: null,
    }));

    // Call your API here
    // Example: axios.post('/api/student-outreach', payload)

    // Reset form after submission - clear ALL fields
    setRows([
      {
        start_date: "",
        end_date: "",
        category: "",
        department: "",
        gender: "",
        institution_type: "",
        quarter: "",
        month: "",
        state: "",
        faculty: 0,
        students: 0,
        year_fy: "",
      },
    ]);
    
    // Reset save button states
    setDisableSaveButton(true);
    setIsSaveDisabled(false);
    
    // Call onHide with data
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
        gender: "",
        institution_type: "",
        quarter: "",
        month: "",
        state: "",
        faculty: 0,
        students: 0,
        year_fy: "",
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
                  <th>Gender</th>
                  <th>Institution Type</th>
                  <th>Students</th>
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
