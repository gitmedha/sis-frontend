import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
const StudentupskilingBulk = (props) => {
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
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
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
        <td>{row.id}</td>
        <td>
          <input
            className="table-input"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "course_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "student_id", e.target.value)}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input"
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
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={props.batchbdata}
            onChange={(e) => props.handleChange(e, "batch", row.id)}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          />
        </td>

        <td>
          {/* <DatePicker
                    dateFormat="dd/MM/yyyy"
                    className="table-input"
                    selected={startDate}
                    onChange={(date) => {
                        const d = new Date(date).toLocaleDateString('fr-FR');
                        setStartDate(date)

                        props.updateRow(row.id, 'start_date', d)
                    }}
                /> */}
          <input
            type="date"
            className="table-input"
            defaultValue={startDate}
            onChange={(e) => {
              console.log(e.target.value);

              setStartDate(e.target.value);
              props.updateRow(row.id, "start_date", e.target.value);
            }}
          />
        </td>
        <td>
          {/* <DatePicker
                    // dateFormat="dd/MM/yyyy"
                    // className="table-" 
                    selected={endDate}
                    showYearPicker
                    showMonthYearPicker
                    onChange={(date) => {
                        const d = new Date(date).toLocaleDateString('fr-FR');
                        setEndDate(date)
                        props.updateRow(row.id, 'end_date', d)}} 

                  
                /> */}
          <input
            type="date"
            className="table-input"
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
            className="basic-single table-input"
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={options}
            onChange={(e) =>
              props.handleChange(e, "certificate_received", row.id)
            }
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "category", e.target.value)
            }
          />
        </td>
        <td>
          {/* <Select
                        className="basic-single table-input"
                        classNamePrefix="select"
                       
                        isSearchable={true}
                        name="area"
                        options={options}
                        onChange={(e) => props.handleChange(e, "donor", row.id)}
                    /> */}
          <input
            className="table-input"
            type="text"
            onChange={(e) => props.updateRow(row.id, "sub_category", true)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "issued_org", e.target.value)
            }
          />
        </td>
      </tr>
    </>
  );
};

export default StudentupskilingBulk;
