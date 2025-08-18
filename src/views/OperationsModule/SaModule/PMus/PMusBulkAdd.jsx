import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { getAllMedhaUsers } from "../../../../utils/function/lookupOptions";
import moment from "moment";

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
    min-width: 900px;
  }
  .create_data_table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      min-width: 150px;
      padding: 8px 12px;
    }
    input, .react-select__control, .react-datepicker-wrapper {
      width: 100%;
      min-width: 120px;
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

const PMusBulkAdd = (props) => {
  let { onHide, show } = props;
  const { setAlert } = props;
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };

  const [rows, setRows] = useState([
    {
      id: 1,
      year: "",
      pmu: "",
      State: "",
      medha_poc: ""
    }
  ]);
  const [newRow, setNewRow] = useState({
    id: 1,
    year: "",
    pmu: "",
    State: "",
    medha_poc: ""
  });
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);
  const requiredFields = ["year", "pmu", "State", "medha_poc"];

  useEffect(() => {
    const fetchOptions = async () => {
      const medhaUsers = await getAllMedhaUsers();
      setMedhaPocOptions(medhaUsers.map(user => ({ label: user.name, value: user.id })));
    };
    fetchOptions();
  }, []);

  const addRow = () => {
    if (rows.length >= 10) {
      setAlert("You can't add more than 10 items.", "error");
    } else {
      const newRowWithId = { ...newRow, id: rows.length + 1 };
      setRows([...rows, newRowWithId]);
    }
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const deleteRow = (id) => {
    if (rows.length === 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  const onSubmit = async () => {
    // TODO: Implement submit logic
    onHide("pmus", rows);
    setRows([{ ...newRow, id: 1 }]);
  };

  return (
    <StyledModal
      centered
      size="xl"
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
              Add PMus Data
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
                <FaPlusCircle style={iconStyles} size={40} className="ml-2 mr-3" />
              </button>
            )}
          </div>
          <div className="table-scroll-container">
            <div className="table-container">
              <table className="create_data_table">
                <thead>
                  <tr>
                    <th>Year *</th>
                    <th>PMU *</th>
                    <th>State *</th>
                    <th>Medha POC *</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={row.year}
                          onChange={e => updateRow(row.id, "year", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.pmu}
                          onChange={e => updateRow(row.id, "pmu", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.State}
                          onChange={e => updateRow(row.id, "State", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={row.medha_poc}
                          onChange={e => updateRow(row.id, "medha_poc", e.target.value)}
                        >
                          <option value="">Select...</option>
                          {medhaPocOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
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
            >
              SAVE
            </Button>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default PMusBulkAdd; 