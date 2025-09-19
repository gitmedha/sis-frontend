import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getStateDistricts } from "../../Address/addressActions";
import {
  getAllSrm,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import {
  handleKeyPress,
  handleKeyPresscharandspecialchar,
  mobileNochecker,
} from "../../../utils/function/OpsModulechecker";
import { getStudentsPickList } from "../../Students/StudentComponents/StudentActions";
import { getTotPickList } from "./operationsActions";

const projecttypeoptions = [
  { value: 'External', label: "External" },
  { value: 'Internal', label: "Internal" },
];
const certificateoptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const UserTotRowdata = (props) => {
  const { row, handleChange, updateRow, classValue, statedata } = props;
  
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [srmOption, setsrmOption] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [moduleName, setModuleName] = useState([]);
  const [partnerDept, setPartnerDept] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [stateDisabled, setStateDisabled] = useState(true);
  
  // Refs for input fields
  const userNameRef = useRef(null);
  const designationRef = useRef(null);
  const collegeRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);
  const contactRef = useRef(null);

  // Initialize input fields with row data
  useEffect(() => {
    if (userNameRef.current) userNameRef.current.value = row.user_name || '';
    if (designationRef.current) designationRef.current.value = row.designation || '';
    if (collegeRef.current) collegeRef.current.value = row.college || '';
    if (emailRef.current) emailRef.current.value = row.email || '';
    if (ageRef.current) ageRef.current.value = row.age || '';
    if (contactRef.current) contactRef.current.value = row.contact || '';
  }, [row]);

  const onStateChange = (value, rowid, field) => {
    getStateDistricts(value).then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.district
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
    handleChange(value, "state", row.id);
    setStateDisabled(false);
  };

  useEffect(() => {
    let srmData = async () => {
      let data = await getAllSrm();
      setsrmOption(data);
      getStateDistricts().then((data) => {
        setAreaOptions([]);
        setAreaOptions(
          data?.data?.data?.geographiesConnection.groupBy.district
            .map((area) => ({
              key: area.id,
              label: area.key,
              value: area.key,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      });
    };
    srmData();
  }, []);

  useEffect(() => {
    getStudentsPickList().then((data) => {
      setGenderOptions(
        data.gender.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, []);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getTotPickList().then(data => {
      setModuleName(
        data.module_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setPartnerDept(
        data.partner_dept.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setProjectName(
        data.project_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
  }, []);

  const handleInputChange = (id, field, ref) => {
    const input = ref.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);
      updateRow(id, field, input.value);
    }
  };

  const capitalizeFirstLetter = (text) => {
    return text
      .split(' ')
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      })
      .join(' ');
  };

  // Helper function to get selected value for Select components
  const getSelectedValue = (options, value) => {
    if (!value) return null;
    return options.find(option => option.value === value) || null;
  };

  return (
    <tr key={row.id}>
      <td>
        <input
          className={`table-input h-2 ${classValue[`class${row.id - 1}`]?.user_name ? `border-red` : ""}`}
          type="text"
          onKeyPress={handleKeyPresscharandspecialchar}
          ref={userNameRef}
          onChange={(e) => handleInputChange(row.id, "user_name", userNameRef)}
        />
      </td>
      <td>
        <input
          className="table-input h-2"
          type="text"
          ref={emailRef}
          onChange={(e) => updateRow(row.id, "email", e.target.value)}
        />
      </td>
      <td>
        <input
          className="table-input h-2"
          type="number"
          ref={ageRef}
          onChange={(e) => updateRow(row.id, "age", e.target.value)}
        />
      </td>
      <td>
        <Select
          className={`table-input ${classValue[`class${row.id - 1}`]?.gender ? `border-red` : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="gender"
          options={genderOptions}
          value={getSelectedValue(genderOptions, row.gender)}
          onChange={(e) => handleChange(e, "gender", row.id)}
        />
      </td>
      <td>
        <input
          className="table-input h-2"
          type="text"
          onKeyPress={mobileNochecker}
          ref={contactRef}
          onChange={(e) => updateRow(row.id, "contact", e.target.value)}
        />
      </td>
      <td>
        <Select
          className={`table-input ${classValue[`class${row.id - 1}`]?.state ? `border-red` : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="state"
          options={statedata}
          value={getSelectedValue(statedata, row.state)}
          onChange={(e) => onStateChange(e, row.id, "state")}
        />
      </td>
      <td>
        <Select
          className={`table-input ${classValue[`class${row.id - 1}`]?.area ? `border-red` : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="area"
          options={areaOptions}
          value={getSelectedValue(areaOptions, row.city)}
          isDisabled={stateDisabled}
          onChange={(e) => handleChange(e, "city", row.id)}
        />
      </td>
      <td>
        <input
          className="table-input h-2"
          type="text"
          onKeyPress={handleKeyPress}
          ref={designationRef}
          onChange={(e) => handleInputChange(row.id, "designation", designationRef)}
        />
      </td>
      <td>
        <input
          className="table-input h-2"
          type="text"
          onKeyPress={handleKeyPress}
          ref={collegeRef}
          onChange={(e) => handleInputChange(row.id, "college", collegeRef)}
        />
      </td>
      <td>
        <Select
          className="table-input h-2"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="project_name"
          options={projectName}
          value={getSelectedValue(projectName, row.project_name)}
          onChange={(e) => handleChange(e, "project_name", row.id)}
        />
      </td>
      <td>
        <Select
          className="table-input"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="partner_dept"
          options={partnerDept}
          value={getSelectedValue(partnerDept, row.partner_dept)}
          onChange={(e) => handleChange(e, "partner_dept", row.id)}
        />
      </td>
      <td>
        <Select
          className="table-input h-2"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="module_name"
          options={moduleName}
          value={getSelectedValue(moduleName, row.module_name)}
          onChange={(e) => handleChange(e, "module_name", row.id)}
        />
      </td>
      <td>
        <input
          type="date"
          className={`table-input h-2 ${classValue[`class${row.id - 1}`]?.start_date ? `border-red` : ""}`}
          value={row.start_date || ''}
          onChange={(e) => {
            updateRow(row.id, "start_date", e.target.value);
          }}
        />
      </td>
      <td>
        <input
          type="date"
          className={`table-input h-2 ${classValue[`class${row.id - 1}`]?.end_date ? `border-red` : ""}`}
          min={row.start_date}
          value={row.end_date || ''}
          disabled={!row.start_date}
          onChange={(e) => {
            updateRow(row.id, "end_date", e.target.value);
          }}
        />
      </td>
      <td>
        <Select
          className={`table-input ${classValue[`class${row.id - 1}`]?.trainer_1 ? `border-red` : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="tariner_1"
          options={srmOption}
          value={getSelectedValue(srmOption, row.trainer_1)}
          onChange={(e) => handleChange(e, "trainer_1", row.id)}
        />
      </td>
      <td>
        <Select
          className="basic-single table-input"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="trainer_2"
          options={srmOption}
          value={getSelectedValue(srmOption, row.trainer_2)}
          onChange={(e) => handleChange(e, "trainer_2", row.id)}
        />
      </td>
      <td>
        <Select
          className={`table-input ${classValue[`class${row.id - 1}`]?.certificate_given ? `border-red` : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="certificate_given"
          options={certificateoptions}
          value={getSelectedValue(certificateoptions, row.certificate_given)}
          onChange={(e) => handleChange(e, "certificate_given", row.id)}
        />
      </td>
      <td>
        <Select
          className={`table-input ${classValue[`class${row.id - 1}`]?.project_type ? `border-red` : ""}`}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="project_type"
          options={projecttypeoptions}
          value={getSelectedValue(projecttypeoptions, row.project_type)}
          onChange={(e) => handleChange(e, "project_type", row.id)}
        />
      </td>
    </tr>
  );
};

export default UserTotRowdata;