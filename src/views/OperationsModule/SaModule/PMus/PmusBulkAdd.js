import React from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { checkEmptyValuesandplaceNA } from "../../../../utils/function/OpsModulechecker";
import PmusBulkrow from "./PMusBulkRow.js";
import moment from "moment";
import { getAllMedhaUsers } from "../../../../utils/function/lookupOptions";

const StyledModal = styled(Modal)`
  .modal-body {
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    padding: 0;
  }

  .adddeletebtn {
    padding: 12px 16px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .table-scroll-container {
    overflow-y: auto;
    flex-grow: 1;
  }

  .table-container {
    min-width: 1000px;
  }

  .create_data_table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      min-width: 200px;
      padding: 8px 12px;
    }

    input, .react-select__control, .react-datepicker-wrapper {
      width: 100%;
      min-width: 150px;
      height: 38px;
    }

    .form-control {
      padding: 8px 12px;
      font-size: 14px;
    }
  }

  .error-border {
    border: 1px solid red !important;
    border-radius: 4px;
  }
`;

const PmusBulkAdd = (props) => {
  let { onHide, show, refreshTableOnDataSaving } = props;
  const { setAlert } = props;
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };
  
  const stateOptions = [
    "Uttar Pradesh", "Delhi", "Haryana", "Uttarakhand", "Bihar"
  ].map(state => ({ label: state, value: state }));

  const [classValue, setClassValue] = useState({});
  const [rows, setRows] = useState([{
    id: 1,
    year: "",
    pmu: "",
    State: "",
    medha_poc: ""
  }]);

  const [newRow, setNewRow] = useState({
    id: 1,
    year: "",
    pmu: "",
    State: "",
    medha_poc: ""
  });

  const [showLimit, setShowLimit] = useState(false);
  const [medhaUsers, setMedhaUsers] = useState([]);
  
  const requiredFields = [
    'year', 
    'pmu', 
    'State',
    'medha_poc'
  ];

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
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0) return true;
    return false;
  }
  
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    const emptyValues = checkEmptyValues(lastRow);
    
    const hasEmptyRequiredFields = requiredFields.some(field => 
      emptyValues[field] || lastRow[field] === ""
    );
    
    if (hasEmptyRequiredFields) {
      const errorFields = {};
      requiredFields.forEach(field => {
        if (emptyValues[field] || lastRow[field] === "") {
          errorFields[field] = true;
        }
      });
      
      setClassValue(prev => ({
        ...prev,
        [`class${rows.length - 1}`]: errorFields
      }));
      
      setAlert("Please fill all required fields before adding a new row", "error");
      return;
    }

    if (rows.length >= 10) {
      setAlert("You can't add more than 10 items.", "error");
    } else {
      const newRowWithId = { ...newRow, id: rows.length + 1 };
      setRows([...rows, newRowWithId]);
      setClassValue({});
    }
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const deleteRow = (id) => {
    if (rows.length === 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  const userId = localStorage.getItem("user_id");
  const [disableSaveButton, setDisableSaveButton] = useState(false);

  const onSubmit = async () => {
    const data = rows.map(row => {
      const formattedRow = { ...row };
      delete formattedRow.id;
      
      formattedRow.createdby = Number(userId);
      formattedRow.updatedby = Number(userId);
      formattedRow.isactive = true;
      
      if (formattedRow.year) {
        formattedRow.year = moment(formattedRow.year)
          .format("YYYY-MM-DD");
      }
      
      return checkEmptyValuesandplaceNA(formattedRow);
    });

    try {
      onHide("pmus", data);
      setRows([{ ...newRow, id: 1 }]);
    } catch (error) {
      setAlert("Failed to save data", "danger");
    }
  };

  useEffect(() => {
    const hasEmptyRequiredFields = rows.some(row => {
      return requiredFields.some(field => 
        isEmptyValue(row[field]) || row[field] === ""
      );
    });
    setDisableSaveButton(hasEmptyRequiredFields);
  }, [rows]);

  useEffect(() => {
    const fetchMedhaUsers = async () => {
      const medhaUsers = await getAllMedhaUsers();
      setMedhaUsers([...medhaUsers]);
    };
    fetchMedhaUsers();
  }, []);

  return (
    <StyledModal
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
        <Modal.Title className="d-flex align-items-center justify-content-between">
          <div className="d-flex">
            <h2 className="text--primary bebas-thick mb-0">
              {props.id ? props.id : "Add PMUs Data"}
            </h2>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-white">
        <div id="CreateOptsData" className="d-flex flex-column h-100">
          <div className="adddeletebtn d-flex justify-content-end">
            {rows.length > 1 && (
              <button className="unset" onClick={() => deleteRow(rows.length)}>
                <FaMinusCircle style={iconStyles} size={40} className="ml-2 mr-3" />
              </button>
            )}
            {rows.length < 10 && (
              <button className="unset" onClick={addRow}>
                <FaPlusCircle style={iconStyles} size={40} className="ml-2" />
              </button>
            )}
          </div>

          <div className="table-scroll-container">
            <div className="table-container">
              <table className="create_data_table">
                <thead>
                  <tr>
                    <th>Year *</th>
                    <th>PMU Name *</th>
                    <th>State *</th>
                    <th>Medha POC *</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <PmusBulkrow
                      key={row.id}
                      row={row}
                      updateRow={updateRow}
                      classValue={classValue[`class${row.id - 1}`] || {}}
                      stateOptions={stateOptions}
                      medhaPocOptions={medhaUsers.map(user => ({ label: user.name, value: user.id }))}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-end between_class bulk_add_actions" style={{bottom:-28}}>
            <Button
              variant="danger"
              className="btn-regular mr-2 bulk_add_button"
              onClick={onHide}
            >
              CLOSE
            </Button>
            <Button
              variant="primary"
              className="btn-regular mx-0 bulk_add_button"
              onClick={onSubmit}
              disabled={disableSaveButton}
            >
              SAVE
            </Button>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(PmusBulkAdd);