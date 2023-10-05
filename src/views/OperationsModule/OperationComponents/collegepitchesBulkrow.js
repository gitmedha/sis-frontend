import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import { getAllSrm, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { handleKeyPress, handleKeyPresscharandspecialchar, mobileNochecker, numberChecker } from "../../../utils/function/OpsModulechecker";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const CollegepitchesBulkrow = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      pitch_date: "",
      student_name: "",
      course_name: "",
      course_year: "",
      college_name: "",
      phone: "",
      whatsapp: "",
      email: "",
      remarks: "",
      srm_name: "",
      area: "",
    },
    // Add more initial rows as needed
  ]);
  const [srmOption, setsrmOption] = useState([]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const handleChange = (options, key) => {
    // console.log(options, key);
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
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    let data = await getAllSrm(1);
    setsrmOption(data);
    let val=await getStateDistricts().then((data) => {
      // console.log("district data",data.data.data.geographiesConnection.groupBy.district);
      setAreaOptions(data.data.data?.geographiesConnection.groupBy?.district.map((item) => ({
        key: item.key,
        value: item.key,
        label: item.key,
      })))
     });
    // // console.log("assigneeOptions ; \n ",assigneeOptions);
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
    // console.log(id, field, value);
  };

  return (
    <>
      <tr key={row.id} className="mt-4">
        {/* <td>{row.id}</td> */}
        
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.pitch_date
                ? `border-red`
                : ""
            }`}
            defaultValue={startDate}
            onChange={(e) => {
              // console.log(e.target.value);

              setStartDate(e.target.value);
              props.updateRow(row.id, "pitch_date", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.student_name
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={handleKeyPress}
            onChange={(e) => updateRow(row.id, "student_name", e.target.value)}
          />
        </td>

        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.course_name
                ? `border-red`
                : ""
            }`}
            onKeyPress={handleKeyPress}
            type="text"
            onChange={(e) => updateRow(row.id, "course_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.course_year
                ? `border-red`
                : ""
            }`}
            type="number"
            onKeyPress={numberChecker}
            onChange={(e) => updateRow(row.id, "course_year", e.target.value)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.college_name
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={handleKeyPress}
            onChange={(e) => updateRow(row.id, "college_name", e.target.value)}
          />
        </td>

        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.phone
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={mobileNochecker}
            onChange={(e) => updateRow(row.id, "phone", e.target.value)}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.whatsapp
                ? `border-red`
                : ""
            }`}
            type="text"
            onKeyPress={mobileNochecker}
            onChange={(e) => updateRow(row.id, "whatsapp", e.target.value)}
          />
        </td>

        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "email", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "remarks", e.target.value)}
          />
        </td>
        <td>
          {/* <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "srm_name", e.target.value)
            }
          /> */}
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.trainer_1
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="srm_name"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "srm_name", row.id)}
          />
        </td>
        <td>
          {/* <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.area ? `border-red` : ""
            }`}
            type="text"
            onChange={(e) => props.updateRow(row.id, "area", e.target.value)}
          /> */}
        <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.area
                ? `border-red`
                : "table-input h-2"
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="srm_name"
            options={areaOptions}
            onChange={(e) => props.handleChange(e, "area", row.id)}
          />
        </td>
        
      </tr>
    </>
  );
};

export default CollegepitchesBulkrow;
