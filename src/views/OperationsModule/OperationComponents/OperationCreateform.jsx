import { Formik, Form } from "formik";
import { Modal, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, Fragment } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { urlPath } from "../../../constants";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import SweetAlert from "react-bootstrap-sweetalert";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import { connect } from "react-redux";

import { MeiliSearch } from "meilisearch";

import { RowsData } from "./RowsData";
import { createOperation } from "./operationsActions";
import api from "../../../apis";
const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
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

  // .App {
  //   margin: 2rem auto;
  //   width: 80%;
  // }

  .create_data_table {
    border-collapse: collapse !important;
    width: 100%;
    overflow: auto;
  }

  th,
  td {
    border: #6c757d;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  .table-input {
    // border: none;
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }

  button {
    margin-top: 1rem;
  }
  // .table-input:focus {
  //   outline: none;
  // }
  .adddeletebtn {
    display: flex;
    justify-content: flex-end;
  }
`;
const marginTop = {
  marginTop: "2rem",
};
const modalStyle = {
  position: "fixed",
  top: "20px", // Gap from the top
  right: "20px", // Gap from the right
  bottom: "20px", // Gap from the bottom
  left: "20px", // Gap from the left
  width: "calc(100% - 40px)", // Adjust width to account for left and right gaps
  height: "calc(100% - 40px)", // Adjust height to account for top and bottom gaps
  overflow: "auto",
};

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const OperationCreateform = (props) => {
  let { onHide, show } = props;
  const { setAlert } = props;
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };
  const [classValue, setclassValue] = useState({});

  const userId = localStorage.getItem("user_id");

  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [typeOptions, setTypeOptions] = useState([]);
  const [show1, setShow1] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showLimit, setshowLimit] = useState(false);
  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);
  const [data, setData] = useState([
    {
      id: 1,
      name: "",
      activity_type: "",
      institution: "",
      batch: "",
      state: "",
      start_date: "",
      end_date: "",
      topic: "",
      donor: "",
      guest: "",
      designation: "",
      organization: "",
      assigned_to: "",
      area: "",
      students_attended: "",
    },
    // Add more initial rows as needed
  ]);
  const [rows, setRows] = useState([
    {
      id: 1,
      assigned_to: "",
      institution: "",
      batch: "",
      activity_type: "",
      state: "",
      area: "",
      start_date: "",
      end_date: "",
      topic: "",
      donor: "",
      guest: "",
      designation: "",
      organization: "",
      students_attended: "",
    },
  ]);
  const [newRow, setNewRow] = useState({
    id: "",
    institution: "",
    batch: "",
    state: "",
    start_date: "",
    activity_type: "",
    end_date: "",
    topic: "",
    donor: "",
    guest: "",
    designation: "",
    organization: "",
    assigned_to: "",
    area: "",
    students_attended: "",
  });

  useEffect(() => {
    
    let isEmptyValuFound=false

    for (let row of rows) {

      for(let key in row){
       
        if(!(key =='designation') && !(key =='guest') && !(key =='donor') && !(key =='organization') ){
          if(isEmptyValue(row[key])){
            isEmptyValuFound=true
          }
         
        }
      }
     
    }
    setDisableSaveButton(isEmptyValuFound)
  }, [rows]);

  function checkEmptyValuesandplaceNA(obj) {
    const result = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const isEmpty = isEmptyValue(value);
        if (isEmpty) {
          result[key] = "N/A";
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

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
    setclassValue({});
    if (
      value.state ||
      value.area ||
      value.topic ||
      value.start_date ||
      value.end_date ||
      value.institution ||
      value.batch ||
      value.assigned_to ||
      value.students_attended
    ) {
      let obj = { [`class${[rows.length - 1]}`]: value };
      return setclassValue(obj);
    }

    if (rows.length >= 10) {
      setAlert("You can't Add more than 10 items.", "error");
    } else {
      const newRowWithId = { ...newRow, id: rows.length + 1 };
      setRows([...rows, newRowWithId]);
    }
    // setclassValue({state:false,area:false,topic:false})
  };

  const handleChange = (options, key, rowid) => {
    if (key == "state") {
      getStateDistricts().then((data) => {
        setAreaOptions([]);
        setAreaOptions(
          data?.data?.data?.geographiesConnection.groupBy.area
            .map((area) => ({
              key: area.id,
              label: area.key,
              value: area.key,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      });
    }
    updateRow(rowid, key, options?.value);
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
  }, []);

  const onStateChange = (value) => {
    getStateDistricts(value).then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  };

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
      delete row["name"];
      row.createdby = Number(userId);
      row.updatedby = Number(userId);
      row.batch = Number(row.batch);
      row.assigned_to = Number(row.assigned_to);
      row.institution = Number(row.institution);
      row.students_attended = Number(row.students_attended);
      row.donor = row.donor ? true : false;
      row.isActive = true;
      let value = checkEmptyValuesandplaceNA(row);
      return value;
    });
    try {
  

      onHide('feilddata',data)
      setRows([
        {
          id: 1,
          name: "",
          activity_type: "",
          institution: "",
          batch: "",
          state: "",
          start_date: "",
          end_date: "",
          topic: "",
          donor: "",
          guest: "",
          designation: "",
          organization: "",
          assigned_to: "",
          area: "",
          students_attended: "",
        }
      ])
    } catch (error) {
      setAlert("Data is not created yet", "danger");
    }
  };

  useEffect(() => {
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
          .map((state) => ({
            key: state.id,
            label: state.key,
            value: state.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }, []);

  const handleRowData = (rowData) => {
    // Do something with the row data
  };

  useEffect(() => {
    filterInstitution().then((data) => {
      setInstitutionOptions(data);
    });

    filterBatch().then((data) => {
      setBatchOptions(data);
    });
  }, []);

  const filterInstitution = async (filterValue) => {
    return await meilisearchClient
      .index("institutions")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        let filterData = data.hits.map((institution) => {
          return {
            ...institution,
            label: institution.name,
            value: Number(institution.id),
          };
        });

        return filterData;
      });
  };

  const filterBatch = async (filterValue) => {
    return await meilisearchClient
      .index("batches")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        let filterData = data.hits.map((batch) => {
          return {
            ...batch,
            label: batch.name,
            value: Number(batch.id),
          };
        });
        return filterData;
      });
  };

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
                {props.id ? props.full_name : "Add New Field Activity"}
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
            {rows.length == 10 ? (
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
            {/* <button onClick={handleSubmit}>Submit</button> */}

            {/* {rows.length > 0 && <button onClick={deleteTable}>Delete Table</button>} */}
          </div>
          <div className="table-container">
            <table className="create_data_table">
              <thead>
                <tr>
                  {/* <th className='id'>ID</th> */}
                  <th>Assigned To *</th>
                  <th>Activity Type *</th>
                  <th>Institution *</th>
                  <th>State *</th>
                  <th>Medha Area *</th>
                  <th>Program Name *</th>
                  <th>Batch Name *</th>

                  <th>Start Date *</th>
                  <th>End Date *</th>
                  <th>Session Topic *</th>
                  <th>Project Funder</th>
                  <th>Guest Name</th>
                  <th>Guest Designation</th>
                  <th>Organization</th>
                  <th>No. Of Participants *</th>
                </tr>
              </thead>
              <tbody className="mb-4">
                {rows.map((row, id) => (
                  <tr key={id} className="mt-4">
                    <RowsData
                      key={id}
                      handleInputChange={handleInputChange}
                      handleChange={handleChange}
                      row={row}
                      endDate={endDate}
                      startDate={startDate}
                      setStartdate={setStartDate}
                      institutiondata={institutionOptions}
                      batchbdata={batchOptions}
                      updateRow={updateRow}
                      statedata={stateOptions}
                      areaOptions={areaOptions}
                      classValue={classValue}
                      style={{ marginTop: 5 }}
                      filterInstitution={filterInstitution}
                      filterBatch={filterBatch}
                      setInstitutionOptions={setInstitutionOptions}
                      setBatchOptions={setBatchOptions}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end between_class">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-danger btn-regular mr-5"
            >
              CLOSE
            </button>
            <button
              className="btn btn-primary btn-regular mx-0 text-light"
              type="submit"
              onClick={onSubmit}
              disabled={disableSaveButton}
            >
              SAVE
            </button>
          </div>
        </div>
      </Modal.Body>

      {/* {showLimit ? <SweetAlert title="You can't dd more than 10 items!" onConfirm={onConfirm} onCancel={()=>onCancel()} /> :""} */}
    </Modal>
  );
};

// export default OperationCreateform;

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(OperationCreateform);





 // if (isEmptyValue(rows[ele].activity_type )) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].activity_type )) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].institution)) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].batch) ) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].state)) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].start_date)) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].end_date) ) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].topic) ) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].end_date) ) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].assigned_to) ) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } else if (isEmptyValue(rows[ele].area )) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // } 
      // else if (isEmptyValue(rows[ele].students_attended) ) {
      //   // isRequiredEmpty = true;
      //   setDisableSaveButton(false)
      //   break;
      // }