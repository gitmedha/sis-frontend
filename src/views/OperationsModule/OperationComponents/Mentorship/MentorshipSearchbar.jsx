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
      const initialActive = [];
      if (initialSelectedField) {
        const mappedKey = filterMap[initialSelectedField];
        if (mappedKey) {
          initialActive.push(mappedKey);
        }
      }
      return initialActive;
    });
    const [filterValues, setFilterValues] = useState(() => {
      return initialFilterValues || {};
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
    const validateAllFilters = () => {
      const newErrors = {};
      let allValid = true;

      if (activeFilters.length === 0) {
        setIsApplyDisabled(true);
        return false;
      }

      activeFilters.forEach((filter) => {
        if (filter === "Start Date" || filter === "End Date") {
          const dateFromKey = `${filter} From`;
          const dateToKey = `${filter} To`;
          if (!filterValues[dateFromKey] || (filterValues[dateFromKey] instanceof Date && isNaN(filterValues[dateFromKey]))) {
            newErrors[dateFromKey] = `Please select a valid ${filter.toLowerCase()} from date.`;
            allValid = false;
          }
          if (!filterValues[dateToKey] || (filterValues[dateToKey] instanceof Date && isNaN(filterValues[dateToKey]))) {
            newErrors[dateToKey] = `Please select a valid ${filter.toLowerCase()} to date.`;
            allValid = false;
          }
        } else if (
          !filterValues[filter] ||
          (typeof filterValues[filter] === "string" && filterValues[filter].trim() === "")
        ) {
          newErrors[filter] = `Please select a ${filter.toLowerCase()}.`;
          allValid = false;
        }
      });

      setFilterErrors(newErrors);
      setIsApplyDisabled(!allValid);
      return allValid;
    };

    const handleChange = (filter, value) => {
      setFilterValues((prev) => {
        const updatedValues = { ...prev };

        if (filter.includes(" Date")) {
          updatedValues[filter] = value === "" ? null : new Date(value);
          if (updatedValues[filter] instanceof Date && isNaN(updatedValues[filter])) {
            updatedValues[filter] = null; // Ensure Invalid Date is converted to null
          }
        } else {
          updatedValues[filter] = value;
        }

        validateAllFilters(); // Re-validate after updating filter values
        return updatedValues;
      });
    };

    useEffect(() => {
      validateAllFilters(); // Validate on mount and whenever activeFilters or filterValues change
    }, [activeFilters, filterValues]);

    useEffect(() => {
      activeFilters.forEach(async (filter) => {
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
          try {
            const { data } = await getFieldValues(backendFieldName, "mentorship");
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
          } catch (error) {
            console.error(`Error fetching values for ${filter}:`, error);
          }
        }
      });
    }, [activeFilters]); // Dependencies for useEffect

    const toggleFilter = (filter) => {
      setActiveFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]
      );
    };

    const handleApply = async () => {
      // Run validation before applying filters
      if (!validateAllFilters()) {
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

      Object.keys(filterValues).forEach((key) => {
        const backendFieldName = backendFieldMap[key] || key;
        let value = filterValues[key];

        if (value instanceof Date && !isNaN(value)) {
          value = value.toISOString(); // Convert valid Date objects to ISO string for API
        }
        searchFields.push(backendFieldName);
        searchValues.push(value);
        if (value !== null && value !== undefined && value !== "") {
          appliedList.push({ label: key, value: filterValues[key] instanceof Date ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(filterValues[key]) : filterValues[key] });
        }
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
      setPersistentFilterValues(filterValues);
      setAppliedFilters(appliedList);
      setShowAppliedFilterMessage(appliedList.length > 0);
      closefilterBox(); // Close the modal
      // Removed setTimeout here
    };

    return (
      <Modal
        centered
        size="lg"
        show={true} // Modal is always shown when FilterBox is rendered
        onHide={closefilterBox} // Use the closefilterBox prop to hide the modal
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
      >
        <Modal.Header closeButton className="bg-white">
          <Modal.Title id="contained-modal-title-vcenter" className="text--primary latto-bold">
            Add Filters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="filter-box">
            <h4 className="filter-title">Add Filter</h4>

            {/* Filter Chips */}
            <div className="filter-chips">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`chip ${activeFilters.includes(f) ? "active" : ""}`}
                  onClick={() => toggleFilter(f)}
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
                            <input
                              type="date"
                              name={`${f} From`}
                              className="form-control w-300"
                              onChange={(e) =>
                                handleChange(`${f} From`, e.target.value)
                              }
                              value={
                                filterValues[`${f} From`] instanceof Date &&
                                !isNaN(filterValues[`${f} From`])
                                  ? filterValues[`${f} From`].toISOString().split("T")[0]
                                  : ""
                              }
                            />
                          </div>
                          <div className="date-input-group">
                            <label>{`${f} To`}</label>
                            <input
                              type="date"
                              name={`${f} To`}
                              className="form-control w-300"
                              onChange={(e) =>
                                handleChange(`${f} To`, e.target.value)
                              }
                              value={
                                filterValues[`${f} To`] instanceof Date &&
                                !isNaN(filterValues[`${f} To`])
                                  ? filterValues[`${f} To`].toISOString().split("T")[0]
                                  : ""
                              }
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
                      <Fragment key={f}>
                        <Select
                          options={mentorNameOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Mentor Name", selected?.value)
                          }
                          placeholder="Select Mentor Name..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Mentor Name"] === "string" &&
                            filterValues["Mentor Name"] !== ""
                              ? {
                                  label: filterValues["Mentor Name"],
                                  value: filterValues["Mentor Name"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Mentor Domain":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={mentorDomainOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Mentor Domain", selected?.value)
                          }
                          placeholder="Select Mentor Domain..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Mentor Domain"] === "string" &&
                            filterValues["Mentor Domain"] !== ""
                              ? {
                                  label: filterValues["Mentor Domain"],
                                  value: filterValues["Mentor Domain"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Mentor Company Name":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={mentorCompanyOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Mentor Company Name", selected?.value)
                          }
                          placeholder="Select Mentor Company..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Mentor Company Name"] === "string" &&
                            filterValues["Mentor Company Name"] !== ""
                              ? {
                                  label: filterValues["Mentor Company Name"],
                                  value: filterValues["Mentor Company Name"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Designation":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={designationOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Designation", selected?.value)
                          }
                          placeholder="Select Designation..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Designation"] === "string" &&
                            filterValues["Designation"] !== ""
                              ? {
                                  label: filterValues["Designation"],
                                  value: filterValues["Designation"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Mentor Area":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={mentorAreaOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Mentor Area", selected?.value)
                          }
                          placeholder="Select Mentor Area..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Mentor Area"] === "string" &&
                            filterValues["Mentor Area"] !== ""
                              ? {
                                  label: filterValues["Mentor Area"],
                                  value: filterValues["Mentor Area"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Mentor State":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={mentorStateOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Mentor State", selected?.value)
                          }
                          placeholder="Select Mentor State..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Mentor State"] === "string" &&
                            filterValues["Mentor State"] !== ""
                              ? {
                                  label: filterValues["Mentor State"],
                                  value: filterValues["Mentor State"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Medha Area":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={medhaAreaOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Medha Area", selected?.value)
                          }
                          placeholder="Select Medha Area..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Medha Area"] === "string" &&
                            filterValues["Medha Area"] !== ""
                              ? {
                                  label: filterValues["Medha Area"],
                                  value: filterValues["Medha Area"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Program Name":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={programNameOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Program Name", selected?.value)
                          }
                          placeholder="Select Program Name..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Program Name"] === "string" &&
                            filterValues["Program Name"] !== ""
                              ? {
                                  label: filterValues["Program Name"],
                                  value: filterValues["Program Name"],
                                }
                              : null
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
                      </Fragment>
                    );
                  case "Status":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={statusOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Status", selected?.value)
                          }
                          placeholder="Select Status..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Status"] === "string" &&
                            filterValues["Status"] !== ""
                              ? {
                                  label: filterValues["Status"],
                                  value: filterValues["Status"],
                                }
                              : null
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
                      </Fragment>
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
                          handleChange(f.replace(/ /g, "_").toLowerCase(), e.target.value)
                        }
                        value={filterValues[f] || ""}
                      />
                    );
                }
              })}
            </div>

            {/* Action Buttons */}
            <div className="filter-actions">
              <button
                className="btn apply"
                type="button"
                onClick={handleApply}
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
              />
            )}
          </Form>
        )}
      </Formik>
      {appliedFilters.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <p style={{ color: '#257b69', marginBottom: '6px' }}>
            Applied Filters ({appliedFilters.length}):
          </p>
          <div className="filter-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {appliedFilters.map((f, idx) => (
              <span key={`${f.label}-${idx}`} className="chip">
                {f.label}: {f.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(MentorshipSearchbar);
