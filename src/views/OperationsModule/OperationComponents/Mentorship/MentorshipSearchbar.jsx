import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input } from "../../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../../store/reducers/Operations/actions";
import { getFieldValues } from "../operationsActions";
import { getAllSearchSrm } from "../../../../utils/function/lookupOptions";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import "../ops.css";
// import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const Section = styled.div`
  padding-bottom: 30px;
  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }
`;

const SearchRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
  .uniform-btn {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    line-height: 1.2;
    white-space: nowrap;
  }
`;

const SearchFieldContainer = styled.div`
  flex: 0 0 200px;
`;

const SearchValueContainer = styled.div`
  flex: 0 0 300px;
`;

const DateRangeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  > div {
    flex: 1;
    &:first-child {
      margin-right: 15px;
    }
  }
`;

const SearchButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px; /* Adjust as needed for alignment with other inputs */
`;

const MultipleFilterBox = styled.div`
  .filter-box {
    border: 1px solid #1a2b3c;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    max-width: 100%;
  }

  .filter-title {
    margin-bottom: 12px;
    font-weight: 500;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .chip {
    border: 1px solid #c4c4c4;
    border-radius: 6px;
    padding: 6px 14px;
    background: #f8f9fa;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 32px;
  }

  .chip:hover {
    background: #e2e6ea;
  }

  .chip.active {
    background: #21867a;
    border-color: #21867a;
    color: #fff;
  }

  .filter-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
  }

  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .btn {
    min-width: 80px;
    height: 36px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn.apply {
    background: #21867a;
    color: white;
  }

  .btn.apply:hover {
    background: #18645a;
  }

  .btn.clear {
    background: #6c757d;
    color: white;
  }

  .btn.clear:hover {
    background: #565e64;
  }
`;
const MentorshipSearchbar = ({ searchOperationTab, resetSearch }) => {
  let today = new Date();
  const [onefilter, setOnefilter] = useState(true);
  const options = [
    { key: 0, value: "mentor_name", label: "Mentor Name" },
    { key: 1, value: "mentor_domain", label: "Mentor Domain" },
    { key: 2, value: "mentor_company_name", label: "Mentor Company Name" },
    { key: 3, value: "designation", label: "Designation" },
    { key: 4, value: "mentor_area", label: "Mentor Area" },
    { key: 5, value: "mentor_state", label: "Mentor State" },
    { key: 6, value: "medha_area", label: "Medha Area" },
    { key: 7, value: "program_name", label: "Program Name" },
    { key: 8, value: "status", label: "Status" },
    { key: 9, value: "start_date", label: "Start Date" },
    { key: 10, value: "end_date", label: "End Date" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [mentorNameOption, setMentorNameOption] = useState([]);
  const [areaOption, setAreaOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [mentorDomain, setMentorDomain] = useState([]);
  const [mentorCompanyName, setMentorCompanyName] = useState([]);
  const [designationOption, setDesignation] = useState([]);
  const [medhaArea, setMedhaArea] = useState([]);
  const [programName, setProgramName] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]); // {label, value}
  const [persistentFilterValues, setPersistentFilterValues] = useState({}); // persist multi-filter selections

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_from: new Date(today),
    search_by_value_date_to: new Date(today),
  };

  const handleSubmit = async (values) => {
    setShowAppliedFilterMessage(false); // Hide multi-filter applied message on single filter submission
    const baseUrl = "mentorships";
    let searchData;

    if (selectedSearchField === "start_date" || selectedSearchField === "end_date") {
      searchData = {
        searchFields: [selectedSearchField + "_from", selectedSearchField + "_to"],
        searchValues: [values.search_by_value_date_from, values.search_by_value_date_to],
      };
    } else {
      searchData = {
        searchFields: [values.search_by_field],
        searchValues: [values.search_by_value],
      };
    }

    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
    // Removed setShowAppliedFilterMessage(true) and setTimeout here
  };

  const closefilterBox = () => {
    setOnefilter(true);
    setShowAppliedFilterMessage(false); // Hide the message when modal is dismissed
    // Removed API call and local storage update from here
  };

  // New function for clearing filters only within the modal, then closing it
  const clearModalFiltersAndClose = async () => {
    setPersistentFilterValues({});
    setAppliedFilters([]);
    setShowAppliedFilterMessage(false);
    const baseUrl = "mentorships";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
    closefilterBox();
  };

  const filters = [
    "Mentor Name",
    "Mentor Domain",
    "Mentor Company Name",
    "Designation",
    "Mentor Area",
    "Mentor State",
    "Medha Area",
    "Program Name",
    "Status",
    // "Start Date",
    // "End Date",
  ];

  const FilterBox = ({
    closefilterBox,
    clear,
    handleSubmit,
    initialSelectedField,
    initialFilterValues,
    formik,
    clearModalFiltersAndClose,
    setShowAppliedFilterMessage,
    appliedFilters,
    setAppliedFilters,
    setPersistentFilterValues,
  }) => {
    const filterMap = {
      "mentor_name": "Mentor Name",
      "mentor_domain": "Mentor Domain",
      "mentor_company_name": "Mentor Company Name",
      "designation": "Designation",
      "mentor_area": "Mentor Area",
      "mentor_state": "Mentor State",
      "medha_area": "Medha Area",
      "program_name": "Program Name",
      "status": "Status",
      "start_date": "Start Date",
      "end_date": "End Date",
    };

    const [activeFilters, setActiveFilters] = useState(() => {
      const initialActiveSet = new Set();
      // Activate chips for any persisted values
      if (initialFilterValues && Object.keys(initialFilterValues).length > 0) {
        for (const key in initialFilterValues) {
          if (!Object.prototype.hasOwnProperty.call(initialFilterValues, key)) continue;
          const val = initialFilterValues[key];
          if (val === null || val === undefined || val === '') continue;
          if (key.endsWith(' From')) {
            initialActiveSet.add(key.replace(' From', ''));
          } else if (key.endsWith(' To')) {
            initialActiveSet.add(key.replace(' To', ''));
          } else {
            initialActiveSet.add(key);
          }
        }
      }
      // Ensure single-selected field is also active
      if (initialSelectedField) {
        const mappedKey = filterMap[initialSelectedField];
        if (mappedKey) {
          initialActiveSet.add(mappedKey);
        }
      }
      return Array.from(initialActiveSet);
    });
    const [filterErrors, setFilterErrors] = useState({}); // State to store validation errors
    const [isApplyDisabled, setIsApplyDisabled] = useState(true); // State to control Apply button disabled state

    // Options states for dropdowns
    const [mentorNameOptions, setMentorNameOptions] = useState([]);
    const [mentorDomainOptions, setMentorDomainOptions] = useState([]);
    const [mentorCompanyOptions, setMentorCompanyOptions] = useState([]);
    const [designationOptions, setDesignationOptions] = useState([]);
    const [mentorAreaOptions, setMentorAreaOptions] = useState([]);
    const [mentorStateOptions, setMentorStateOptions] = useState([]);
    const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
    const [programNameOptions, setProgramNameOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    // Validation function for all active filters
    const validateAllFilters = (currentFilterValues) => {
      const newErrors = {};
      let allValid = false; // change default: we allow Apply if at least one active filter is valid

      if (activeFilters.length === 0) {
        setIsApplyDisabled(true);
        setFilterErrors({});
        return false;
      }

      activeFilters.forEach((filter) => {
        if (filter === "Start Date" || filter === "End Date") {
          const fromValue = currentFilterValues[`${filter} From`];
          const toValue = currentFilterValues[`${filter} To`];
          if (fromValue && toValue) {
            if (fromValue instanceof Date && toValue instanceof Date && fromValue > toValue) {
              newErrors[filter] = `${filter} From date cannot be after ${filter} To date.`;
            } else {
              allValid = true; // this filter is valid
            }
          } else if (fromValue || toValue) {
            newErrors[filter] = `Both ${filter} From and To are required.`;
          }
        } else {
          const val = currentFilterValues[filter];
          if (val && (typeof val !== 'string' || val.trim() !== '')) {
            allValid = true; // at least one non-empty active filter makes form submittable
          }
        }
      });

      setFilterErrors(newErrors);
      setIsApplyDisabled(!allValid);
      return allValid;
    };


    const toggleFilter = (filter, modalFormik) => {
      setActiveFilters((prev) => {
        const newActiveFilters = prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter];

        // Also update filterValues when a filter is toggled off
        if (prev.includes(filter)) { // If filter is being deselected
          // We need to clear values from the MODAL Formik state here so UI and submit are clean
          const fm = modalFormik || formik;
          fm.setFieldValue(filter, null);
          if (filter === "Start Date" || filter === "End Date") {
            fm.setFieldValue(`${filter} From`, null);
            fm.setFieldValue(`${filter} To`, null);
          }
        } else {
          // On activation, for non-date filters, fetch options so dropdown is immediately populated
          if (filter !== "Start Date" && filter !== "End Date") {
            // Fetch options for Select components
            const fieldToBackendMap = {
              "Mentor Name": "mentor_name",
              "Mentor Domain": "mentor_domain",
              "Mentor Company Name": "mentor_company_name",
              "Designation": "designation",
              "Mentor Area": "mentor_area",
              "Mentor State": "mentor_state",
              "Medha Area": "medha_area",
              "Program Name": "program_name",
              "Status": "status",
            };

            const backendFieldName = fieldToBackendMap[filter];
            if (backendFieldName) {
              getFieldValues(backendFieldName, "mentorship").then(({ data }) => {
                switch (filter) {
                  case "Mentor Name":
                    setMentorNameOptions(data);
                    break;
                  case "Mentor Domain":
                    setMentorDomainOptions(data);
                    break;
                  case "Mentor Company Name":
                    setMentorCompanyOptions(data);
                    break;
                  case "Designation":
                    setDesignationOptions(data);
                    break;
                  case "Mentor Area":
                    setMentorAreaOptions(data);
                    break;
                  case "Mentor State":
                    setMentorStateOptions(data);
                    break;
                  case "Medha Area":
                    setMedhaAreaOptions(data);
                    break;
                  case "Program Name":
                    setProgramNameOptions(data);
                    break;
                  case "Status":
                    setStatusOptions(data);
                    break;
                  default:
                    break;
                }
              }).catch(error => {
                console.error(`Error fetching values for ${filter}:`, error);
              });
            }
          }
        }
        return newActiveFilters;
      });
    };

    const handleApply = async (formikValues) => {
      // Run validation before applying filters
      if (!validateAllFilters(formikValues)) {
        return; // Stop if validation fails
      }

      const backendFieldMap = {
        "Mentor Name": "mentor_name",
        "Mentor Domain": "mentor_domain",
        "Mentor Company Name": "mentor_company_name",
        "Designation": "designation",
        "Mentor Area": "mentor_area",
        "Mentor State": "mentor_state",
        "Medha Area": "medha_area",
        "Program Name": "program_name",
        "Status": "status",
        "Start Date From": "start_date_from",
        "Start Date To": "start_date_to",
        "End Date From": "end_date_from",
        "End Date To": "end_date_to",
      };

      const searchFields = [];
      const searchValues = [];
      const appliedList = [];

      const isKeyActive = (key) => {
        if (key.endsWith(' From') || key.endsWith(' To')) {
          const base = key.replace(/ (From|To)$/,'');
          return activeFilters.includes(base);
        }
        return activeFilters.includes(key);
      };

      Object.keys(formikValues).forEach((key) => {
        if (!isKeyActive(key)) {
          return; // Skip values for filters that are not currently active
        }
        const backendFieldName = backendFieldMap[key] || key;
        let value = formikValues[key];
        let displayValue = value;

        if (value instanceof Date && !isNaN(value)) {
          displayValue = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(value);
          value = value.toISOString(); // Convert valid Date objects to ISO string for API
        }
        
        // Add to applied list if a value is present
        if (value !== null && value !== undefined && value !== '') {
          // Special handling for date ranges to combine them
          if (key === "Start Date From") {
            const toKey = "Start Date To";
            const toValue = formikValues[toKey];
            const formattedTo = toValue instanceof Date && !isNaN(toValue) 
              ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(toValue)
              : '';
            appliedList.push({ label: key.replace(' From', ''), value: `${displayValue} - ${formattedTo}` });
          } else if (key === "End Date From") {
            const toKey = "End Date To";
            const toValue = formikValues[toKey];
            const formattedTo = toValue instanceof Date && !isNaN(toValue) 
              ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(toValue)
              : '';
            appliedList.push({ label: key.replace(' From', ''), value: `${displayValue} - ${formattedTo}` });
          } else if (key !== "Start Date To" && key !== "End Date To") { // Avoid adding "To" dates if already handled
            appliedList.push({ label: key, value: displayValue });
          }
        }

        searchFields.push(backendFieldName);
        searchValues.push(value);
      });

      const searchData = {
        searchFields,
        searchValues,
      };
      const baseUrl = "mentorships";

      await searchOperationTab(baseUrl, searchData);
      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({ baseUrl, searchData })
      );
      setPersistentFilterValues(formikValues);
      setAppliedFilters(appliedList);
      setShowAppliedFilterMessage(appliedList.length > 0);
      closefilterBox(); // Close the modal
    };

    return (
      <Formik
        initialValues={initialFilterValues}
        enableReinitialize={true}
        onSubmit={(values) => handleApply(values)}
        validate={(values) => {
          validateAllFilters(values);
        }}
      >
        {(formik) => (
          <Form>
            <Modal
              centered
              size="lg"
              show={true}
              onHide={() => { setPersistentFilterValues(formik.values); closefilterBox(); }}
              animation={false}
              aria-labelledby="contained-modal-title-vcenter"
              className="form-modal"
            >
              <Modal.Header className="bg-white">
                <Modal.Title id="contained-modal-title-vcenter" className="text--primary latto-bold">
                  Add Filters
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="">
                <div className="filter-box">
                  {/* Filter Chips */}
                  <div className="filter-chips">
                    {filters.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`chip ${activeFilters.includes(f) ? "active" : ""}`}
                        onClick={() => toggleFilter(f, formik)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="filter-inputs">
                    {activeFilters.map((f) => {
                      switch (f) {
                        case "Start Date":
                        case "End Date":
                          return (
                            <Fragment key={f}>
                              <DateRangeContainer>
                                <div className="date-input-group">
                                  <label>{`${f} From`}</label>
                                  <Input
                                    control="datepicker"
                                    name={`${f} From`}
                                    className="form-control w-300"
                                    onChange={(date) => {
                                      formik.setFieldValue(`${f} From`, date);
                                    }}
                                    value={formik.values[`${f} From`] || null}
                                    showTime={false}
                                  />
                                </div>
                                <div className="date-input-group">
                                  <label>{`${f} To`}</label>
                                  <Input
                                    control="datepicker"
                                    name={`${f} To`}
                                    className="form-control w-300"
                                    onChange={(date) => {
                                      formik.setFieldValue(`${f} To`, date);
                                    }}
                                    minDate={formik.values[`${f} From`] || null}
                                    value={formik.values[`${f} To`] || null}
                                    showTime={false}
                                  />
                                </div>
                              </DateRangeContainer>
                              {filterErrors[f] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors[f]}
                                </p>
                              )}
                            </Fragment>
                          );
                        case "Mentor Name":
                          return (
                            <div key={f}>
                              <label htmlFor="mentorName">Mentor Name</label>
                              <Select
                                id="mentorName"
                                options={mentorNameOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Mentor Name", selected?.value)
                                }
                                placeholder="Select Mentor Name..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Mentor Name"] ? {
                                    label: formik.values["Mentor Name"],
                                    value: formik.values["Mentor Name"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Mentor Name"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Mentor Name"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Mentor Domain":
                          return (
                            <div key={f}>
                              <label htmlFor="mentorDomain">Mentor Domain</label>
                              <Select
                                id="mentorDomain"
                                options={mentorDomainOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Mentor Domain", selected?.value)
                                }
                                placeholder="Select Mentor Domain..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Mentor Domain"] ? {
                                    label: formik.values["Mentor Domain"],
                                    value: formik.values["Mentor Domain"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Mentor Domain"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Mentor Domain"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Mentor Company Name":
                          return (
                            <div key={f}>
                              <label htmlFor="mentorCompany">Mentor Company Name</label>
                              <Select
                                id="mentorCompany"
                                options={mentorCompanyOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Mentor Company Name", selected?.value)
                                }
                                placeholder="Select Mentor Company..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Mentor Company Name"] ? {
                                    label: formik.values["Mentor Company Name"],
                                    value: formik.values["Mentor Company Name"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Mentor Company Name"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Mentor Company Name"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Designation":
                          return (
                            <div key={f}>
                              <label htmlFor="designation">Designation</label>
                              <Select
                                id="designation"
                                options={designationOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Designation", selected?.value)
                                }
                                placeholder="Select Designation..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Designation"] ? {
                                    label: formik.values["Designation"],
                                    value: formik.values["Designation"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Designation"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Designation"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Mentor Area":
                          return (
                            <div key={f}>
                              <label htmlFor="mentorArea">Mentor Area</label>
                              <Select
                                id="mentorArea"
                                options={mentorAreaOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Mentor Area", selected?.value)
                                }
                                placeholder="Select Mentor Area..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Mentor Area"] ? {
                                    label: formik.values["Mentor Area"],
                                    value: formik.values["Mentor Area"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Mentor Area"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Mentor Area"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Mentor State":
                          return (
                            <div key={f}>
                              <label htmlFor="mentorState">Mentor State</label>
                              <Select
                                id="mentorState"
                                options={mentorStateOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Mentor State", selected?.value)
                                }
                                placeholder="Select Mentor State..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Mentor State"] ? {
                                    label: formik.values["Mentor State"],
                                    value: formik.values["Mentor State"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Mentor State"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Mentor State"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Medha Area":
                          return (
                            <div key={f}>
                              <label htmlFor="medhaArea">Medha Area</label>
                              <Select
                                id="medhaArea"
                                options={medhaAreaOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Medha Area", selected?.value)
                                }
                                placeholder="Select Medha Area..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Medha Area"] ? {
                                    label: formik.values["Medha Area"],
                                    value: formik.values["Medha Area"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Medha Area"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Medha Area"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Program Name":
                          return (
                            <div key={f}>
                              <label htmlFor="programName">Program Name</label>
                              <Select
                                id="programName"
                                options={programNameOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Program Name", selected?.value)
                                }
                                placeholder="Select Program Name..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Program Name"] ? {
                                    label: formik.values["Program Name"],
                                    value: formik.values["Program Name"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Program Name"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Program Name"]}
                                </p>
                              )}
                            </div>
                          );
                        case "Status":
                          return (
                            <div key={f}>
                              <label htmlFor="status">Status</label>
                              <Select
                                id="status"
                                options={statusOptions.map((opt) => ({
                                  label: opt.value,
                                  value: opt.value,
                                }))}
                                onChange={(selected) =>
                                  formik.setFieldValue("Status", selected?.value)
                                }
                                placeholder="Select Status..."
                                isClearable
                                isSearchable
                                value={
                                  formik.values["Status"] ? {
                                    label: formik.values["Status"],
                                    value: formik.values["Status"],
                                  } : null
                                }
                                styles={{
                                  container: (base) => ({
                                    ...base,
                                    width: "300px",
                                  }),
                                }}
                              />
                              {filterErrors["Status"] && (
                                <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                                  {filterErrors["Status"]}
                                </p>
                              )}
                            </div>
                          );
                        default:
                          return (
                            <Input
                              key={f}
                              name={f.replace(/ /g, "_").toLowerCase()}
                              control="input"
                              label={f}
                              className="form-control"
                              onChange={(e) =>
                                formik.setFieldValue(f.replace(/ /g, "_").toLowerCase(), e.target.value)
                              }
                              value={formik.values[f] || ""}
                            />
                          );
                      }
                    })}
                  </div>

                  {/* Live Selected Chips Inside Modal (reflect current dropdown/date selections) */}
                  {activeFilters.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ color: '#257b69', marginBottom: '6px' }}>
                      Applied Filters : ({appliedFilters.length}):
                      </p>
                      <div className="filter-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {activeFilters.map((af) => {
                          // Build display from current Formik values
                          if (af === 'Start Date' || af === 'End Date') {
                            const fromVal = formik.values[`${af} From`];
                            const toVal = formik.values[`${af} To`];
                            const fmt = (d) => (d instanceof Date && !isNaN(d) ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(d) : '');
                            const range = `${fmt(fromVal)}${fromVal || toVal ? ' - ' : ''}${fmt(toVal)}`;
                            return (
                              <span key={`live-${af}`} className="chip">
                                {af}: {range}
                              </span>
                            );
                          }
                          const val = formik.values[af];
                          if (val !== null && val !== undefined && val !== '') {
                            return (
                              <span key={`live-${af}`} className="chip">
                                {af}: {val}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="filter-actions">
                    <button
                      className="btn apply"
                      style={{background:"#21867a"}}
                      type="button"
                      onClick={() => handleApply(formik.values)}
                      disabled={isApplyDisabled}
                    >
                      Apply
                    </button>
                    <button
                      className="btn clear"
                      type="button"
                      onClick={clearModalFiltersAndClose}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </Form>
        )}
      </Formik>
    );
  };

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisabled(true);
    setIsFieldEmpty(false);
    setShowAppliedFilterMessage(false); // Hide multi-filter applied message on clear
    setPersistentFilterValues({});
    setAppliedFilters([]);
    const baseUrl = "mentorships";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const setSearchItem = async (value) => {
    setSelectedSearchField(value);
    setDisabled(false);
    setIsFieldEmpty(false);

    if (value === "mentor_name") {
      const { data } = await getFieldValues("mentor_name", "mentorship");
      setMentorNameOption(data);
    } else if (value === "mentor_domain") {
      const { data } = await getFieldValues("mentor_domain", "mentorship");
      setMentorDomain(data);
    } else if (value === "mentor_company_name") {
      const { data } = await getFieldValues("mentor_company_name", "mentorship");
      setMentorCompanyName(data);
    } else if (value === "designation") {
      const { data } = await getFieldValues("designation", "mentorship");
      setDesignation(data);
    } else if (value === "mentor_area") {
      const { data } = await getFieldValues("mentor_area", "mentorship");
      setAreaOption(data);
    } else if (value === "mentor_state") {
      const { data } = await getFieldValues("mentor_state", "mentorship");
      setStateOption(data);
    } else if (value === "medha_area") {
      const { data } = await getFieldValues("medha_area", "mentorship");
      setMedhaArea(data);
    } else if (value === "program_name") {
      const { data } = await getFieldValues("program_name", "mentorship");
      setProgramName(data);
    } else if (value === "status") {
      const { data } = await getFieldValues("status", "mentorship");
      setStatus(data);
    }
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            {onefilter ? (
              <Section>
                <SearchRow>
                  <SearchFieldContainer>
                    <Input
                      icon="down"
                      name="search_by_field"
                      label="Search Field"
                      control="lookup"
                      options={options}
                      className="form-control"
                      onChange={(e) => setSearchItem(e.value)}
                    />
                  </SearchFieldContainer>

                  <SearchValueContainer>
                    {selectedSearchField === null && (
                      <Input
                        name="search_by_value"
                        control="input"
                        label="Search Value"
                        className="form-control"
                        onClick={() => setIsFieldEmpty(true)}
                        disabled
                      />
                    )}
                    {selectedSearchField === "mentor_name" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={mentorNameOption}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "mentor_domain" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={mentorDomain}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "mentor_company_name" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={mentorCompanyName}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "designation" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={designationOption}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "mentor_area" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={areaOption}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "mentor_state" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={stateOption}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "medha_area" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={medhaArea}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "program_name" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={programName}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {selectedSearchField === "status" && (
                      <Input
                        icon="down"
                        name="search_by_value"
                        label="Search Value"
                        control="lookup"
                        options={status}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}
                    {(selectedSearchField === "start_date" ||
                      selectedSearchField === "end_date") && (
                        <DateRangeContainer>
                          <div>
                            <Input
                              name="search_by_value_date_from"
                              label="From"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Input
                              name="search_by_value_date_to"
                              label="To"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              disabled={disabled}
                            />
                          </div>
                        </DateRangeContainer>
                      )}
                  </SearchValueContainer>

                  <SearchButtonContainer>
                    <button
                      className="btn btn-primary uniform-btn"
                      type="submit"
                      disabled={disabled}
                    >
                      Search
                    </button>
                    <button
                      className="btn btn-primary uniform-btn"
                      type="button"
                      onClick={() => setOnefilter(false)}
                    >
                      Add Filter
                    </button>
                    <button
                      className="btn btn-secondary uniform-btn"
                      type="button"
                      onClick={() => clear(formik)}
                      disabled={disabled}
                    >
                      CLEAR
                    </button>
                  </SearchButtonContainer>
                </SearchRow>
                {isFieldEmpty && (
                  <div className="row">
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-2"></div>
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                      <p style={{ color: "red" }}>
                        Please select any field first.
                      </p>
                    </div>
                  </div>
                )}
              </Section>
            ) : (
              <FilterBox
                closefilterBox={closefilterBox}
                handleSubmit={handleSubmit}
                clear={clear}
                initialSelectedField={selectedSearchField}
                initialFilterValues={(() => {
                  const mappedValues = {};
                  if (formik.values.search_by_field && formik.values.search_by_value) {
                    const filterMap = {
                      "mentor_name": "Mentor Name",
                      "mentor_domain": "Mentor Domain",
                      "mentor_company_name": "Mentor Company Name",
                      "designation": "Designation",
                      "mentor_area": "Mentor Area",
                      "mentor_state": "Mentor State",
                      "medha_area": "Medha Area",
                      "program_name": "Program Name",
                      "status": "Status",
                      "start_date": "Start Date",
                      "end_date": "End Date",
                    };
                    const filterKey = filterMap[formik.values.search_by_field];
                    if (filterKey) {
                      // Handle date values specifically for pre-population
                      if (formik.values.search_by_field === "start_date") {
                        const dateFrom = formik.values.search_by_value_date_from;
                        const dateTo = formik.values.search_by_value_date_to;
                        mappedValues["Start Date From"] = dateFrom && dateFrom.toString() !== "Invalid Date" ? new Date(dateFrom) : null;
                        mappedValues["Start Date To"] = dateTo && dateTo.toString() !== "Invalid Date" ? new Date(dateTo) : null;
                      } else if (formik.values.search_by_field === "end_date") {
                        const dateFrom = formik.values.search_by_value_date_from;
                        const dateTo = formik.values.search_by_value_date_to;
                        mappedValues["End Date From"] = dateFrom && dateFrom.toString() !== "Invalid Date" ? new Date(dateFrom) : null;
                        mappedValues["End Date To"] = dateTo && dateTo.toString() !== "Invalid Date" ? new Date(dateTo) : null;
                      } else {
                        mappedValues[filterKey] = formik.values.search_by_value;
                      }
                    }
                  }
                  return { ...persistentFilterValues, ...mappedValues };
                })()}
                formik={formik} // Pass formik object directly
                clearModalFiltersAndClose={clearModalFiltersAndClose}
                setShowAppliedFilterMessage={setShowAppliedFilterMessage}
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                setPersistentFilterValues={setPersistentFilterValues}
              />
            )}
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(MentorshipSearchbar);
