import React, { useRef, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import { useEffect } from "react";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import { getOpsPickList, searchPrograms } from "./operationsActions";
import { handleKeyPresscharandspecialchar } from "../../../utils/function/OpsModulechecker";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
const studenTypeOption = [
  { value: "Medha Student", label: "Medha Student" },
  { value: "Non-Medha Student", label: "Non-Medha Student" },
];

export const RowsData = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
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
      student_type: "",
    },
    // Add more initial rows as needed
  ]);
  const guestname = useRef(null);
  const topic = useRef(null);
  const guestDesignation = useRef(null);
  const [programeName, setProgramName] = useState([]);
  const org = useRef(null);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [classvalue, setclassvalue] = useState(props.classValue);
  const [programOptions, setProgramOptions] = useState([]);
  const [state, setstate] = useState(true);
  const [activityoption, setActivityOption] = useState([]);
  const [studentType, setStudenttype] = useState(true);

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
    if (value) {
      setstate(false);
      props.updateRow(rowid, field, value.value);
    }
  };
  const handleInputChange = (id, data, value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);
      props.updateRow(id, data, input.value);
    }
  };

  const capitalizeFirstLetter = (text) => {
    return text
      .split(" ")
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      })
      .join(" ");
  };

  const filterProgram = async (filterValue) => {
    try {
      const { data } = await searchPrograms(filterValue);

      return data.programsConnection.values.map((program) => {
        return {
          ...program,
          label: program.name,
          value: program.name,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    let data = await getOpsPickList().then((data) => {
      return data.activity_type.map((value) => value);
    });

    setActivityOption(data);
    filterProgram().then((data) => {
      setProgramOptions(data);
    });
  }, []);

  const updatestate = () => {
    setstate(!state);
    return true;
  };

  const handleStudentType = (e, id) => {
    if (e.value == "Medha Student") {
      setStudenttype(false);
      props.handleChange(e, "student_type", id);
    } else {
      setStudenttype(true);
      props.handleChange(e, "student_type", id);
    }
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
          defaultValue={() =>
            setAssigneeOptions(filterAssignedTo("rohit sharma"))
          }
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
          className={`table-input ${
            props.classValue[`class${row.id - 1}`]?.activity_type
              ? `border-red`
              : ""
          }`}
          classNamePrefix="select"
          isSearchable={true}
          name="area"
          options={activityoption}
          onChange={(e) => props.handleChange(e, "activity_type", row.id)}
        />
      </td>

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
          onInputChange={(inputValue) => {
            props.filterInstitution(inputValue).then((data) => {
              props.setInstitutionOptions(data);
            });
          }}
        />
      </td>
      <td>
        <Select
          className={`basic-single table-input ${
            props.classValue[`class${row.id - 1}`]?.state ? `border-red` : ""
          }`}
          classNamePrefix="select"
          isClearable={() => updatestate()}
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
          isDisabled={state}
          onChange={(e) => props.handleChange(e, "area", row.id)}
        />
      </td>

        <td>
          <Select
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="organization"
            options={props.organizationOptions}
onChange={(selected) => {
  console.log(selected);
  props.handleChange(
    selected ? selected.value : null,
    "organization",
    row.id
  );
}}

            onInputChange={inputValue => {
              props.filterOrganization(inputValue).then(data => {
                props.setOrganizationOptions(data);
              });
            }}
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
        
      
    </>
  );
};
