import React from "react";
import { Modal, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
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
import {
  bulkCreateStudentsUpskillings,
  createOperation,
} from "./operationsActions";
import api from "../../../apis";
import StudentupskilingBulk from "./StudentupskilingBulk";
import { checkEmptyValuesandplaceNA, isEmptyValue } from "../../../utils/function/OpsModulechecker";

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const StudentUpkillingBulkcreate = (props) => {
  let { onHide, show } = props;
  const { setAlert } = props;
  let iconStyles = { color: "#257b69", fontSize: "1.5em" };
  const [data, setData] = useState([
    {
      id: 1,
      assigned_to: "",
      student_id: "",
      institution: "",
      batch: "",
      start_date: "",
      end_date: "",
      course_name: "",
      certificate_received: "",
      category: "",
      sub_category: "",
      issued_org: "",
      program_name:""
    },
    // Add more initial rows as needed
  ]);
  const [rows, setRows] = useState([
    {
      id: 1,
      assigned_to: "",
      student_id: "",
      institution: "",
      batch: "",
      start_date: "",
      end_date: "",
      course_name: "",
      certificate_received: "",
      category: "",
      sub_category: "",
      issued_org: "",
      program_name:""
    },
  ]);
  const [newRow, setNewRow] = useState({
    id: 1,
    assigned_to: "",
    student_id: "",
    institution: "",
    batch: "",
    start_date: "",
    end_date: "",
    course_name: "",
    certificate_received: "",
    category: "",
    sub_category: "",
    issued_org: "",
    program_name:""
  });
  const [showLimit, setshowLimit] = useState(false);
  const [classValue, setclassValue] = useState({});

  // const addRow = () => {
  //   let value = checkEmptyValuesandplaceNA(rows[rows.length - 1]);

  //   if (value.student_name || value.gender) {
  //     let obj = { ...classValue, [`class${[rows.length - 1]}`]: value };

  //     setclassValue({});
  //     if (
  //       value.student_id
  //     ) {
  //       let obj = { [`class${[rows.length - 1]}`]: value };
  //       setclassValue(obj);
  //       return;
  //     }

  //     if (rows.length >= 10) {
  //       setAlert("You can't Add more than 10 items.", "error");
  //     } else {
  //       const newRowWithId = { ...newRow, id: rows.length + 1 };
  //       setRows([...rows, newRowWithId]);     
  //     }
  //     return setclassValue(obj);
  //   }

  //   if (rows.length >= 10) {
  //     setAlert("You can't Add more than 10 items.", "error");
  //   } else {
  //     const newRowWithId = { ...newRow, id: rows.length + 1 };
  //     setRows([...rows, newRowWithId]);
  //     // setNewRow({ id: '', name: '', age: '' });   
  //   }
  // };

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

  const addRow = () => {
    
    let value =checkEmptyValues(rows[rows.length-1])
    setclassValue({})
    if(value.student_id || value.institution || value.batch || value.start_date || value.category || value.sub_category || value.course_name || value.program_name ){
      let obj={[`class${[rows.length-1]}`]:value}
      setclassValue(obj)
      return ;
    }
    

    if (rows.length >= 10) {
      setAlert("You can't Add more than 10 items.", "error");
    } else {
      const newRowWithId = { ...newRow, id: rows.length + 1 };
      setRows([...rows, newRowWithId]);
      // setNewRow({ id: '', name: '', age: '' });
      
    }
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

  const userId = localStorage.getItem("user_id");

  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [show1, setShow1] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);

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
    setDistrictOptions([]);
    getStateDistricts(value).then((data) => {
      setDistrictOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((district) => ({
            key: district.id,
            label: district.key,
            value: district.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
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
      row.student_id = Number(row.student_id);
      row.isActive = true;
      let value = checkEmptyValuesandplaceNA(row);
      return value;
    });

    try {
      let isRequiredEmpty = false;
      // assigned_to: "",
      // student_id: "",
      // institution: "",
      // batch: "",
      // start_date: "",
      // end_date: "",
      // course_name: "",
      // certificate_received: "",
      // category: "",
      // sub_category: "",
      // issued_org: "",
      // program_name:""
      
      for(let ele = 0; ele<data.length;ele++){
        if(data[ele].student_id === "N/A"){
          isRequiredEmpty = true;
          break;

        }
        else if (data[ele].institution === "N/A"){
          isRequiredEmpty = true;
          break;
        }
        else if (data[ele].batch === "N/A"){
          isRequiredEmpty = true;
          break;
        }
        else if (data[ele].course_name === "N/A"){
          isRequiredEmpty = true;
          break;
        }

        else if (data[ele].category === "N/A"){
          isRequiredEmpty = true;
          break;
          
        }else if (data[ele].start_date === "N/A"){
          isRequiredEmpty = true;
          break;
          
        }
        else if (data[ele].sub_category === "N/A"){
          isRequiredEmpty = true;
          break;
          
        }
      }

      if (isRequiredEmpty){
        props.ModalShow();
        setAlert("Please fill the required fields", "error");
      }else{
        onHide('upskill',data)
      }
    } catch (error) {
      setAlert("Data is not created yet", "danger");
      console.log("error", error);
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
        // let programEnrollmentBatch = props.programEnrollment ? props.programEnrollment.batch : null;

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
            {/* <h2 className="section-header">Basic Info</h2> */}
            <div className="d-flex ">
              <h2 className="text--primary bebas-thick mb-0">
                {props.id ? props.full_name : "Add Students Data"}
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
            {/* {rows.length > 0 && <button onClick={deleteTable}>Delete Table</button>} */}
          </div>
          <div className="table-container">
            <table className="create_data_table">
              <thead>
                <tr>
                  {/* <th className="id">ID</th> */}
                  <th>Assigned To</th>
                  <th>Student *</th>
                  <th>Institution *</th>
                  <th>Batch *</th>
                  <th>Program Name</th>
                  <th>Certificate Course Name * </th>
                  <th>Category *</th>
                  <th>Sub Category *</th>
                  <th>Start Date *</th>
                  <th>End Date</th>
                  <th>Certificate Received</th>
                  <th>Issuing Organization</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <StudentupskilingBulk
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
                    filterInstitution={filterInstitution}
                    setInstitutionOptions={setInstitutionOptions}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end between_class">
            <button
              type="button b"
              onClick={onHide}
              className="btn-box btn btn-danger redbtn btn-regular mr-2"
            >
              CLOSE
            </button>
            <button
              className="btn btn-primary btn-regular text-light mx-0"
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

export default connect(
  mapStateToProps,
  mapActionsToProps
)(StudentUpkillingBulkcreate);
