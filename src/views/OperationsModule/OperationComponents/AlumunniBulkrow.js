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

const AlumunniBulkrow = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      query_start: "",
      student_name: "",
      father_name: "",
      email: "",
      phone: "",
      location: "",
      query_type: "",
      query_desc: "",
      conclusion: "",
      status: "",
      query_end: "",
      published_at: "",
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
            type="date"
            className="table-input h-2 "
            defaultValue={startDate}
            onChange={(e) => {
              console.log(e.target.value);

              setStartDate(e.target.value);
              props.updateRow(row.id, "query_start", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.student_name ? `border-red`:"table-input h-2"}`}
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "student_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "father_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "email", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "phone", e.target.value)}
          />
        </td>
       <td>
          <input
            className="table-input h-2"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "location", e.target.value)}
          />
        </td>
         <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.query_type ? `border-red`:"table-input h-2"}`}
            type="text"
            // value={row.name}
            onChange={(e) =>
              updateRow(row.id, "query_type", e.target.value)
            }
          />
        </td>

       
       
        
       
        <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.query_desc ? `border-red`:"table-input h-2"}`}
            type="text"
            onChange={(e) => props.updateRow(row.id, "query_desc", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "conclusion", e.target.value)}
          />
        </td>

        
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "status", e.target.value)}
          />
        </td>
        <td>
          <input
            type="date"
            className="table-input h-2 "
            defaultValue={startDate}
            onChange={(e) => {
              console.log(e.target.value);

              setStartDate(e.target.value);
              props.updateRow(row.id, "query_end", e.target.value);
            }}
          />
        </td>

        
      </tr>
    </>
  );
};

export default AlumunniBulkrow;
