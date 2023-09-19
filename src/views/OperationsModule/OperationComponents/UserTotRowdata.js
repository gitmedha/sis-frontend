import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import {
  getAllSrm,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";

const UserTotRowdata = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      user_name: "",
      trainer_1: "",
      project_name: "",
      certificate_given: "",
      module_name: "",
      project_type: "",
      new_entry: "",
      trainer_2: "",
      partner_dept: "",
      college: "",
      city: "",
      state: "",
      age: "",
      gender: "",
      contact: "",
      designation: "",
      start_date:"",
      end_date:""
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [srmOption,setsrmOption]=useState([])
  const handleChange = (options, key) => {
    console.log(options, key);
  };
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
    props.updateRow(rowid, field, value.value);
  };
  useEffect(async () => {
    let data = await getAllSrm(1);
    setsrmOption(data)
    // console.log("SRM ", data);
  }, []);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    // console.log("assigneeOptions ; \n ",assigneeOptions);
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
    console.log(id, field, value);
    // props.handleInputChange()
    // setRows(updatedRows);
  };

  return (
    <>
      <tr key={row.id}>
        {/* <td>{row.id}</td> */}
        <td>
          <input
            className="table-input h-2"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "user_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "college", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "age", e.target.value)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.gender ? `border-red`:"table-input h-2"}`}
            type="text"
            onChange={(e) => props.updateRow(row.id, "gender", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "contact", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "designation", e.target.value)
            }
          />
        </td>
        <td>
          <Select
            className={`table-input ${props.classValue[`class${row.id-1}`]?.trainer_1 ? `border-red`:"table-input h-2"}`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="tariner_1"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "trainer_1", row.id)}
          />
        </td>
        <td>
          {/* <input
            className="table-input h-2"
            type="number"
            onChange={(e) => updateRow(row.id, "trainer_2", e.target.value)}
          /> */}
           <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="trainer_2"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "trainer_2", row.id)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 date ${props.classValue[`class${row.id-1}`]?.project_type ? `border-red`:"table-input h-2"}`}
            type="text"
            onChange={(e) => props.updateRow(row.id, "project_type", true)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="Text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "project_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "module_name", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className={`table-input h-2 date ${props.classValue[`class${row.id-1}`]?.certificate_given ? `border-red`:"table-input h-2"}`}
            type="Text"
            // value={row.name}
            onChange={(e) =>
              updateRow(row.id, "certificate_given", e.target.value)
            }
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2  ${props.classValue[`class${row.id-1}`]?.start_date ? `border-red`:"table-input h-2"}`}
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
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.end_date ? `border-red`:"table-input h-2"}`}
            value={endDate}
            onChange={(event) => {
              const date = event.target.value;
              setEndDate(date);
              props.updateRow(row.id, "end_date", date);
            }}
          />
        </td>

        <td>
          <Select
            className={`table-input  ${props.classValue[`class${row.id-1}`]?.state ? `border-red`:"table-input h-2"}`}
            classNamePrefix="select"
            // defaultValue={stateOptions[0]}
            // isDisabled={isDisabled}
            // isLoading={true}
            isClearable={true}
            // isRtl={isRtl}
            isSearchable={true}
            name="state"
            options={props.statedata}
            onChange={(e) => onStateChange(e, row.id, "state")}
          />
        </td>
        <td>
         
            <Select
              className={`table-input  ${props.classValue[`class${row.id-1}`]?.area ? `border-red`:"table-input h-2"}`}
              classNamePrefix="select"
              // defaultValue={batchOptions[0]}
              // isDisabled={isDisabled}
              // isLoading={true}
              isClearable={true}
              // isRtl={isRtl}
              isSearchable={true}
              name="area"
              options={areaOptions}
              onChange={(e) => props.handleChange(e, "area", row.id)}
            />
         
        </td>
        
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "partner_dept", e.target.value)
            }
          />
        </td>

        {/* <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "new_entry", e.target.value)
            }
          />
        </td> */}

      
       
       

        {/* <td>
                <button onClick={() => setRowid(row.id)}>Delete Row</button>
              </td> */}
      </tr>
    </>
  );
};

export default UserTotRowdata;
