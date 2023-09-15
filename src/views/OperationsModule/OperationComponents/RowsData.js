import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import { useEffect } from "react";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { getAllProgram } from "./operationsActions";
import { handleKeyPress, handleKeyPresscharandspecialchar } from "../../../utils/function/OpsModulechecker";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
const Activityoptions = [
  { value: 'Industry talk/Expert talk', label: 'Industry talk/Expert talk' },
  { value: 'Industry visit/Exposure visit', label: 'Industry visit/Exposure visit' },
  { value: 'Workshop/Training Session/Activity (In/Off campus)', label: 'Workshop/Training Session/Activity (In/Off campus)' },
  { value: 'Alumni Engagement', label: 'Alumni Engagement' },
  // Workshop/Training Session/Activity (In/Off campus)
  // Alumni Engagement
];
export const RowsData = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "",
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
      activity_type: "",
      assigned_to: "",
      area: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [classvalue, setclassvalue] = useState(props.classValue);
  const [programOptions,setProgramOption]=useState([])

  useEffect(() => {
    getAllProgram().then((data)=>{
      console.log("data",data);
      setProgramOption(data?.data?.data?.programsConnection?.values.map((value)=>({
            key: value.id,
            label: value.name,
            value: value.name,
      })))
    });
  }, [])
  
  const onStateChange = (value, rowid, field) => {
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
    if(value){
      props.updateRow(rowid, field, value.value);
    }
    
  };

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    
  }, [startDate]);

  useEffect(() => {
    console.log("state", props.classValue[`class${row.id - 1}`]?.state);
  }, [props.classValue]);
  const updateRow = (id, field, value) => {
    row[field] = value;
    console.log(id, field, value);
  };

  return (
    <>
    
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.assigned_to
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          />
        </td>
        <td>
          {/* <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.activity_type
                ? `border-red`
                : ""
            }`}
            type="text"
            onChange={(e) => updateRow(row.id, "activity_type", e.target.value)}
          /> */}
           <Select
            className="basic-single table-input donor"
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={Activityoptions}
            onChange={(e) => props.handleChange(e, "activity_type", row.id)}
          />
        </td>
        {/* <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.institution
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="institution"
            options={programOptions}
            onChange={(e) => props.handleChange(e, "institution", row.id)}
          />
        </td> */}
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.institution
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="institution"
            options={props.institutiondata}
            onChange={(e) => props.handleChange(e, "institution", row.id)}
          />
        </td>
        <td>
          <Select
            className={`basic-single table-input ${
              props.classValue[`class${row.id - 1}`]?.state ? `border-red` : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="state"
            options={props.statedata}
            onChange={(e) => onStateChange(e, row.id, "state")}
          />
        </td>
        <td>
         
            <Select
              className={`basic-single table-input ${
                props.classValue[`class${row.id - 1}`]?.area ? "border-red" : ""
              }`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              name="area"
              options={areaOptions}
              onChange={(e) => props.handleChange(e, "area", row.id)}
            />
          
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.batch ? `border-red` : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={props.batchbdata}
            onChange={(e) => props.handleChange(e, "batch", row.id)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.students_attended
                ? `border-red`
                : ""
            }`}
            type="number"
            onChange={(e) =>
              props.updateRow(row.id, "students_attended", e.target.value)
            }
          />
        </td>
       
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.start_date
                ? `border-red`
                : ""
            }`}
            defaultValue={startDate}
            onChange={(e) => {
              console.log(e.target.value);
              setStartDate(e.target.value);
              props.updateRow(row.id, "start_date", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.end_date
                ? `border-red`
                : ""
            }`}
            min={startDate}
            value={endDate}
            disabled={!startDate ? true:false}
            onChange={(event) => {
              const date = event.target.value;
              setEndDate(date);
              props.updateRow(row.id, "end_date", date);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.topic ? "border-red" : ""
            }`}
            type="text"
            
            onChange={(e) => props.updateRow(row.id, "topic", e.target.value)}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input donor"
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={options}
            onChange={(e) => props.handleChange(e, "donor", row.id)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPresscharandspecialchar}
            onChange={(e) => props.updateRow(row.id, "guest", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPresscharandspecialchar}
            onChange={(e) =>
              props.updateRow(row.id, "designation", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "organization", e.target.value)
            }
          />
        </td>
        
      
    </>
  );
};
