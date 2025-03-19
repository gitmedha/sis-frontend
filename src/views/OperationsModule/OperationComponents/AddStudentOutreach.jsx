import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import StudentOutreachRowdata from "./StudentOutreachRowdata";

const AddStudentOutreach = (props) => {
  const { onHide, show, setAlert } = props;
  const iconStyles = { color: "#257b69", fontSize: "1.5em" };
  const [rows, setRows] = useState([
    {
      id: 1,
      category: "",
      department: "",
      gender: "",
      institution_type: "",
      quarter: "",
      month: "",
      state: "",
      students: 0,
      year_fy: "",
    },
  ]);
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  // Add a new row
  const addRow = () => {
    if (rows.length >= 10) {
      setAlert("You can't add more than 10 items.", "error");
    } else {
      const newRow = {
        id: rows.length + 1,
        category: "",
        department: "",
        gender: "",
        institution_type: "",
        quarter: "",
        month: "",
        state: "",
        students: 0,
        year_fy: "",
      };
      setRows([...rows, newRow]);
    }
  };

  // Delete a row
  const deleteRow = (id) => {
    if (rows.length === 1) return; // Prevent deleting the last row
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  // Update a row
  const updateRow = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  // Validate all rows
  const validateRows = () => {
    for (const row of rows) {
      if (
        !row.category ||
        !row.department ||
        !row.gender ||
        !row.institution_type ||
        !row.quarter ||
        !row.month ||
        !row.state ||
        !row.year_fy ||
        isNaN(row.students) ||
        row.students < 0
      ) {
        return false; // Validation failed
      }
    }
    return true; // All rows are valid
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

    const payload = rows.map((row) => ({
      category: row.category,
      department: row.department,
      gender: row.gender,
      institution_type: row.institution_type,
      quarter: row.quarter,
      month: row.month,
      state: row.state,
      students: row.students,
      year_fy: row.year_fy,
    }));

    console.log("Payload for POST request:", payload);
    // Call your API here
    // Example: axios.post('/api/student-outreach', payload)

    // Reset form after submission
    setRows([
      {
        id: 1,
        category: "",
        department: "",
        gender: "",
        institution_type: "",
        quarter: "",
        month: "",
        state: "",
        students: 0,
        year_fy: "",
      },
    ]);
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
          <div className="adddeletebtn">
            {rows.length > 1 && (
              <button className="unset" onClick={() => deleteRow(rows.length)}>
                <FaMinusCircle
                  style={iconStyles}
                  size={40}
                  className="ml-2 mr-3"
                />
              </button>
            )}
            {rows.length < 10 && (
              <button className="unset" onClick={addRow}>
                <FaPlusCircle style={iconStyles} size={40} className="ml-2" />
              </button>
            )}
          </div>
          <div className="table-container">
            <table className="create_data_table">
              <thead>
                <tr>
                  <th>Financial Year *</th>
                  <th>Quarter</th>
                  <th>Month</th>
                  <th>Category</th>
                  <th>State</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Students</th>
                  <th>Institution Type</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <StudentOutreachRowdata
                    key={row.id}
                    row={row}
                    updateRow={updateRow}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end between_class bulk_add_actions">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-danger btn-regular mr-2 bulk_add_button"
            >
              CLOSE
            </button>
            <button
              className="btn btn-primary btn-regular mx-0 bulk_add_button"
              type="submit"
              onClick={onSubmit}
              disabled={disableSaveButton}
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
