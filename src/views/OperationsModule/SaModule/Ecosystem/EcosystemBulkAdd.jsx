import React from "react";
import { Modal, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import SweetAlert from "react-bootstrap-sweetalert";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { checkEmptyValuesandplaceNA } from "../../../../utils/function/OpsModulechecker";
import EcosystemBulkrow from "./EcosystemBulkrow";
import moment from "moment";

const EcosystemBulkAdd = (props) => {
  let { onHide, show } = props;
  const { setAlert } = props;
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };
  
  // Options for dropdowns
  const activityTypeOptions = [
    "Workshop",
    "Seminar",
    "Training",
    "Meeting",
    "Conference",
    "Networking Event",
    "Other"
  ].map(type => ({
    label: type,
    value: type
  }));

  const partnerTypeOptions = [
    "Government",
    "Employer",
    "NGO",
    "Educational Institution",
    "Other"
  ].map(type => ({
    label: type,
    value: type
  }));

  const [classValue, setclassValue] = useState({});
  const [data, setData] = useState([
    {
      id: 1,
      activity_type: "",
      date_of_activity: "",
      topic: "",
      govt_dept_partner_with: "",
      type_of_partner: "",
      employer_name_external_party_ngo_partner_with: "",
      attended_students: "",
      male_participants: "",
      female_participants: "",
      medha_poc_1: "",
      medha_poc_2: ""
    },
  ]);
  
  const [rows, setRows] = useState([
    {
      id: 1,
      activity_type: "",
      date_of_activity: "",
      topic: "",
      govt_dept_partner_with: "",
      type_of_partner: "",
      employer_name_external_party_ngo_partner_with: "",
      attended_students: "",
      male_participants: "",
      female_participants: "",
      medha_poc_1: "",
      medha_poc_2: ""
    },
  ]);
  
  const [newRow, setNewRow] = useState({
    id: 1,
    activity_type: "",
    date_of_activity: "",
    topic: "",
    govt_dept_partner_with: "",
    type_of_partner: "",
    employer_name_external_party_ngo_partner_with: "",
    attended_students: "",
    male_participants: "",
    female_participants: "",
    medha_poc_1: "",
    medha_poc_2: ""
  });

  const [showLimit, setshowLimit] = useState(false);
  
  function checkEmptyValues(obj) {
    const result = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const isEmpty = isEmptyValue(value);
        result[key] = isEmpty;
      }
    }

    return result;
  }

  function isEmptyValue(value) {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === "string" && value.trim() === "") {
      return true;
    }

    if (Array.isArray(value) && value.length === 0) {
      return true;
    }

    if (typeof value === "object" && Object.keys(value).length === 0) {
      return true;
    }

    return false;
  }
  
  const addRow = () => {
    let value = checkEmptyValues(rows[rows.length - 1]);
    if (value) {
      let obj = { ...classValue, [`class${[rows.length - 1]}`]: value };

      setclassValue({});
      if (
        value.activity_type ||
        value.date_of_activity ||
        value.topic ||
        value.type_of_partner
      ) {
        let obj = { [`class${[rows.length - 1]}`]: value };
        setclassValue(obj);
        return;
      }

      if (rows.length >= 10) {
        setAlert("You can't Add more than 10 items.", "error");
      } else {
        const newRowWithId = { ...newRow, id: rows.length + 1 };
        setRows([...rows, newRowWithId]);
      }
      return setclassValue(obj);
    }

    if (rows.length >= 10) {
      setAlert("You can't Add more than 10 items.", "error");
    } else {
      const newRowWithId = { ...newRow, id: rows.length + 1 };
      setRows([...rows, newRowWithId]);
    }
  };

  const updateRow = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const deleteRow = (id) => {
    if (rows.length == 1) {
      return rows;
    }
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const userId = localStorage.getItem("user_id");
  const [disableSaveButton, setDisableSaveButton] = useState(false);

  const handleInputChange = (e, index, field) => {
    const { value } = e;
    setData((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const onSubmit = async () => {
    let data = rows.map((row) => {
      delete row["id"];
      row.createdby = Number(userId);
      row.updatedby = Number(userId);
      row.isActive = true;
      
      // Format date properly before sending
      if (row.date_of_activity) {
        row.date_of_activity = moment(row.date_of_activity).format("YYYY-MM-DD");
      }
      
      let value = checkEmptyValuesandplaceNA(row);
      return value;
    });

    try {
      onHide("ecosystem", data);
      setRows([
        {
          id: 1,
          activity_type: "",
          date_of_activity: "",
          topic: "",
          govt_dept_partner_with: "",
          type_of_partner: "",
          employer_name_external_party_ngo_partner_with: "",
          attended_students: "",
          male_participants: "",
          female_participants: "",
          medha_poc_1: "",
          medha_poc_2: ""
        },
      ]);
    } catch (error) {
      setAlert("Data is not created yet", "danger");
    }
  };

  useEffect(() => {
    let isEmptyValuFound = false;
  
    for (let row of rows) {
      for (let key in row) {
        if (
          !(key === "govt_dept_partner_with" || 
            key === "employer_name_external_party_ngo_partner_with" ||
            key === "medha_poc_2")
        ) {
          if (isEmptyValue(row[key])) {
            isEmptyValuFound = true;
          }
        }
      }
    }
    setDisableSaveButton(isEmptyValuFound);
  }, [rows]);

  const onConfirm = () => {
    setshowLimit(true);
  };
  
  const onCancel = () => {
    setshowLimit(false);
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
          id="contained-modal-title-vcenter "
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex ">
              <h2 className="text--primary bebas-thick mb-0">
                {props.id ? props.id : " Add Ecosystem Activity Data"}
              </h2>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <div id="CreateOptsData">
          <div className="adddeletebtn">
            {rows.length > 1 ? (
              <button className="unset" onClick={() => deleteRow(rows.length)}>
                <FaMinusCircle
                  style={iconStyles}
                  width="15"
                  size={40}
                  color="#000"
                  className="ml-2 mr-3"
                />
              </button>
            ) : (
              ""
            )}
            {rows.length === 10 ? (
              ""
            ) : (
              <button className="unset" onClick={addRow}>
                <FaPlusCircle
                  style={iconStyles}
                  width="15"
                  size={40}
                  color="#000"
                  className="ml-2"
                />
              </button>
            )}
          </div>
          <div className="table-container">
            <table className="create_data_table">
              <thead>
                <tr>
                  <th>Activity Type *</th>
                  <th>Date of Activity *</th>
                  <th>Topic *</th>
                  <th>Government Department Partner</th>
                  <th>Type of Partner *</th>
                  <th>Employer/External Party/NGO Partner</th>
                  <th>Total Attended Students *</th>
                  <th>Male Participants *</th>
                  <th>Female Participants *</th>
                  <th>Primary POC *</th>
                  <th>Secondary POC</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <EcosystemBulkrow
                    key={row.id}
                    handleInputChange={handleInputChange}
                    row={row}
                    updateRow={updateRow}
                    classValue={classValue}
                    activityTypeOptions={activityTypeOptions}
                    partnerTypeOptions={partnerTypeOptions}
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

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(EcosystemBulkAdd);