import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getAllBatchs, getFieldValues } from "./operationsActions";
import { getAllSearchSrm } from "src/utils/function/lookupOptions";
import "./ops.css";
import { getAllBatches } from "src/views/Batches/batchActions";
import Select from "react-select";
import Modal from 'react-bootstrap/Modal'; // Import Modal component

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
const SearchButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px; /* Adjust as needed for alignment with other inputs */
`;

const activityTypesMain = [
  { key: 0, label: "Workshop/Training Session/Activity (In/Off campus)", value: "Workshop/Training Session/Activity (In/Off campus)" },
  { key: 1, label: "Industry Talk/Expert Talk", value: "Industry Talk/Expert Talk" },
  { key: 2, label: "Alumni Engagement", value: "Alumni Engagement" },
  { key: 3, label: "Industry Visit/Exposure Visit", value: "Industry Visit/Exposure Visit" },
  { key: 4, label: "Placement Drive", value: "Placement Drive" },
];

const OpsSearchDropdown = ({ searchOperationTab, resetSearch }) => {
  let today = new Date();

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_from: new Date(today),
    search_by_value_date_to: new Date(today),
  };

  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [assignedToOptions, setAssignedOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [onefilter, setOnefilter] = useState(true);
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false); // State for "Multiple filter applied" message
  const [appliedFiltersSummary, setAppliedFiltersSummary] = useState(""); // New state for filter summary
  const [persistentFilterValues, setPersistentFilterValues] = useState({}); // New state to persist multi-filter values
  const [appliedFilters, setAppliedFilters] = useState([]); // Array of { label, value }

  const handleSubmit = async (values) => {
    setShowAppliedFilterMessage(false); // Hide multi-filter applied message on single filter submission
    const baseUrl = "users-ops-activities";
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
  };

  const closefilterBox = async () => {
    setOnefilter(true);
    setShowAppliedFilterMessage(false); // Hide the message when modal is dismissed
    // Removed API call and local storage update from here
  };

  // New function for clearing filters only within the modal, then closing it
  const clearModalFiltersAndClose = async () => {
    setPersistentFilterValues({}); // Clear persistent values
    const searchData = {
      searchFields: [],
      searchValues: [],
    };
    setShowAppliedFilterMessage(false); // Hide the message on clear
    setAppliedFiltersSummary(""); // Clear the summary as well
    setAppliedFilters([]); // Clear applied filter chips
    await searchOperationTab("users-ops-activities", searchData);
    closefilterBox(); // Just close the modal, which also hides the message
  };

  const filters = [
    "Activity Type",
    "Assigned to",
    "Batch",
    "Medha Area",
    "Program",
    "Start Date",
    "End Date",
  ];

  const FilterBox = ({ closefilterBox, clear, initialSelectedField, initialFilterValues, formik: parentFormik, setPersistentFilterValues, excludeFilter }) => {
    const [activeFilters, setActiveFilters] = useState(() => {
      const initialActive = new Set(); // Use a Set to avoid duplicate filter chips
      
      // Populate from initialFilterValues first, which includes persistent filters
      if (Object.keys(initialFilterValues).length > 0) {
        for (const key in initialFilterValues) {
          if (initialFilterValues.hasOwnProperty(key) && initialFilterValues[key] !== null && initialFilterValues[key] !== '') {
            if (key.includes("Date From")) {
              initialActive.add(key.replace(" From", "")); // Add "Start Date" or "End Date"
            } else if (!key.includes("Date To")) { // Avoid adding "Date To" as a separate chip
              initialActive.add(key);
            }
          }
        }
      }

      // Then, if a single filter was selected, ensure its chip is active
      if (initialSelectedField) {
        const singleFilterMap = {
          "assigned_to.username": "Assigned to",
          "activity_type": "Activity Type",
          "batch.name": "Batch",
          "area": "Medha Area",
          "program_name": "Program",
          "start_date": "Start Date",
          "end_date": "End Date",
        };
        const mappedField = singleFilterMap[initialSelectedField];
        if (mappedField) {
          initialActive.add(mappedField);
        }
      }
      return Array.from(initialActive); // Convert Set back to Array
    });
    // const [filterValues, setFilterValues] = useState({}); // Removed, now using Formik state

    // useEffect(() => {
    //   setFilterValues(initialFilterValues);
    // }, [initialFilterValues]); // Removed

    const [filterErrors, setFilterErrors] = useState({}); // State to store validation errors
    const [isApplyDisabled, setIsApplyDisabled] = useState(true); // State to control Apply button disabled state
    
    const [activityTypeOptions, setActivityTypeOptions] = useState([]);
    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);

    // Validation function for all active filters
    const validateAllFilters = (currentFilterValues) => { // Accept currentFilterValues as argument
      const newErrors = {};
      let allValid = true;

      if (activeFilters.length === 0) {
        // If no filters are active, the Apply button should be disabled
        setIsApplyDisabled(true);
        return false; // Not all valid
      }

      activeFilters.forEach(filter => {
        if (filter === "Start Date" || filter === "End Date") {
          const fromValue = currentFilterValues[`${filter} From`];
          const toValue = currentFilterValues[`${filter} To`];
          if (!fromValue || !toValue) {
            newErrors[filter] = "Both Start Date From and To are required.";
            allValid = false;
          } else if (fromValue instanceof Date && toValue instanceof Date && fromValue > toValue) {
            newErrors[filter] = `${filter} From date cannot be after ${filter} To date.`;
            allValid = false;
          }
        } else if (!currentFilterValues[filter] || (typeof currentFilterValues[filter] === 'string' && currentFilterValues[filter].trim() === '')) {
          newErrors[filter] = `Please select a ${filter.toLowerCase()}.`;
          allValid = false;
        }
      });

      setFilterErrors(newErrors);
      setIsApplyDisabled(!allValid);
      return allValid;
    };

    const handleChange = (filter, value, setFieldValue) => {
      // setFilterValues((prev) => {
      let newValue = value;
      // Convert date strings to Date objects if it's a date filter
      if (filter.includes("Date From") || filter.includes("Date To")) {
        newValue = value ? new Date(value) : null;
      }
      setFieldValue(filter, newValue);
    //  });
    };

    // Removed useEffect for validation on filterValues change. Now handled by Formik's validation.
    // useEffect(() => {
    //   validateAllFilters(); 
    // }, [activeFilters, filterValues]);

    useEffect(() => {
      activeFilters.forEach(async (filter) => {
        let fieldName = filter.toLowerCase().replace(/ /g, "_");
        if (fieldName.includes('trainer_1') || fieldName.includes('trainer_2')) {
          fieldName = fieldName.replace('_','.');
        }

        // Prevent re-fetching if data is already present from initialFilterValues or previously fetched
        if (initialFilterValues[filter] && filter !== "Activity Type" && filter !== "Project Type") { // Changed filterValues to initialFilterValues
          return; 
        }

        if (filter === "Activity Type" && activityTypeOptions.length === 0) {
          // If your activity types are static, you can just set them
          setActivityTypeOptions([
            "Workshop/Training Session",
            "Industry Talk",
            "Alumni Engagement",
            "Industry Visit",
            "Placement Drive",
          ]);
        } else if (filter === "Assigned to" && assignedToOptions.length === 0) {
          const users = await getAllSearchSrm();
          setAssignedToOptions(users);
        } else if (filter === "Batch" && batchOptions.length === 0) {
          const { data } = await getAllBatches();
         
          setBatchOptions(data?.data?.batchesConnection?.values);
        }
        else if (filter === "Medha Area" && areaOptions.length === 0) {
          const { data } = await getFieldValues("area", "users-ops-activities");
          setAreaOptions(data);
        }
        else if (filter === "Program" && programOptions.length === 0) {
          const { data } = await getFieldValues("program_name", "users-ops-activities");
          setProgramOptions(data);
        }
      });
    }, [activeFilters, initialFilterValues]); // Changed filterValues to initialFilterValues in dependency array

    const toggleFilter = (filter) => {
      setActiveFilters((prevActiveFilters) => {
        const newActiveFilters = prevActiveFilters.includes(filter)
          ? prevActiveFilters.filter((f) => f !== filter)
          : [...prevActiveFilters, filter];

        // Also update filterValues when a filter is toggled off
        if (prevActiveFilters.includes(filter)) { // If filter is being deselected
          // We need to clear values from Formik's state here
          parentFormik.setFieldValue(filter, null); // Clear parent Formik's state as well
          if (filter === "Start Date" || filter === "End Date") {
            parentFormik.setFieldValue(`${filter} From`, null);
            parentFormik.setFieldValue(`${filter} To`, null);
          }
        }
        return newActiveFilters;
      });
    };
    const handleApply = async (formikValues) => { // Accept formikValues as argument
      // Run validation before applying filters
      if (!validateAllFilters(formikValues)) { // Pass formikValues to validation
        return; // Stop if validation fails
      }

      const backendFieldMap = {
        "Activity Type": "activity_type",
        "Assigned to": "assigned_to.username",
        "Batch": "batch.name",
        "Medha Area": "area",
        "Program": "program_name",
        "Start Date From": "start_date_from",
        "Start Date To": "start_date_to",
        "End Date From": "end_date_from",
        "End Date To": "end_date_to",
      };

      const searchFields = [];
      const searchValues = [];
      const appliedFiltersSummaryParts = []; // Array to store parts of the summary string

      Object.keys(formikValues).forEach((key) => { // Iterate over formikValues
        const backendFieldName = backendFieldMap[key] || key;
        let value = formikValues[key]; // Use value from formikValues
        let displayValue = value;

        if (value instanceof Date && !isNaN(value)) {
          displayValue = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(value); // Format for display
          value = value.toISOString(); // Convert valid Date objects to ISO string for API
        }
        
        // Add to summary if a value is present
        if (value !== null && value !== undefined && value !== '') {
          // Special handling for date ranges to combine them
          if (key === "Start Date From") {
            const toKey = "Start Date To";
            const toValue = formikValues[toKey]; // Use formikValues
            const formattedTo = toValue instanceof Date && !isNaN(toValue) 
              ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(toValue)
              : '';
            appliedFiltersSummaryParts.push(`${key.replace(' From', '')}: ${displayValue} - ${formattedTo}`);
            // Ensure we don't add "Start Date To" separately
            // delete filterValues[toKey]; // No longer needed as we iterate formikValues directly
          } else if (key === "End Date From") {
            const toKey = "End Date To";
            const toValue = formikValues[toKey]; // Use formikValues
            const formattedTo = toValue instanceof Date && !isNaN(toValue) 
              ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(toValue)
              : '';
            appliedFiltersSummaryParts.push(`${key.replace(' From', '')}: ${displayValue} - ${formattedTo}`);
            // Ensure we don't add "End Date To" separately
            // delete filterValues[toKey]; // No longer needed as we iterate formikValues directly
          } else if (key !== "Start Date To" && key !== "End Date To") { // Avoid adding "To" dates if already handled
            appliedFiltersSummaryParts.push(`${key}: ${displayValue}`);
          }
        }

        searchFields.push(backendFieldName);
        searchValues.push(value);
      });

      const searchData = {
        searchFields,
        searchValues,
      };
      const baseUrl = "users-ops-activities";
      
      await searchOperationTab(baseUrl, searchData);
      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({ baseUrl, searchData })
      );
      // Close the modal first
      closefilterBox();
      // Update persistent filter values in parent
      setPersistentFilterValues(formikValues); // Pass formikValues for persistence
      // Set the summary message
      if (appliedFiltersSummaryParts.length > 0) {
        setAppliedFiltersSummary("Multiple Filter Applied: " + appliedFiltersSummaryParts.join(", "));
        setShowAppliedFilterMessage(true);
      } else {
        setAppliedFiltersSummary("");
        setShowAppliedFilterMessage(false);
      }
    };

    //  const handleSubmit = async (values) => {
    //     const baseUrl = "users-ops-activities";
    //     const searchData = {
    //       searchFields: [values.search_by_field],
    //       searchValues: [values.search_by_value],
    //     };

    //     await searchOperationTab(baseUrl, searchData);
    //     await localStorage.setItem(
    //       "prevSearchedPropsAndValues",
    //       JSON.stringify({ baseUrl, searchData })
    //     );
    //   };
    return (
      <Formik
        initialValues={initialFilterValues}
        enableReinitialize={true} // Important for updating when initialFilterValues change
        onSubmit={(values) => handleApply(values)} // Pass values to handleApply
        validate={(values) => {
          validateAllFilters(values);
        }} // Formik's validate prop
      >
        {(formik) => ( // Render prop for Formik
          <Form>
            <Modal
              centered
              size="xl"
              show={true} // Modal is always shown when FilterBox is rendered
              onHide={closefilterBox} // Use the closefilterBox prop to hide the modal
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
                <MultipleFilterBox>
                  <div className="">
                    {/* <h4 className="filter-title">Add Filter</h4> */}

                    {/* Filter Chips */}
                    <div className="filter-chips">
                      {filters.map((f) => (
                        <button
                          key={f}
                          type="button"
                          className={`chip ${activeFilters.includes(f) ? "active" : ""}`}
                          onClick={() => toggleFilter(f)}
                          disabled={f === excludeFilter} // Disable if this filter is already selected in the single search bar
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {/* Filter Inputs */}
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
                                        handleChange(`${f} From`, date, formik.setFieldValue);
                                      }}
                                      value={formik.values[`${f} From`] || null} // Use Formik's value
                                      showTime={false} // Ensure no time is displayed
                                    />
                                  </div>
                                  <div className="date-input-group">
                                    <label>{`${f} To`}</label>
                                    <Input
                                      control="datepicker"
                                      name={`${f} To`}
                                      className="form-control w-300"
                                      onChange={(date) => {
                                        handleChange(`${f} To`, date, formik.setFieldValue);
                                      }}
                                      minDate={formik.values[`${f} From`] || null} // Set min date to From date
                                      value={formik.values[`${f} To`] || null} // Use Formik's value
                                      showTime={false} // Ensure no time is displayed
                                    />
                                  </div>
                                </DateRangeContainer>
                                {filterErrors[f] && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{filterErrors[f]}</p>}
                              </Fragment>
                            );

                          case "Activity Type":
                            return (
                              <div key={f}>
                                <label htmlFor="activityTypeSelect">Activity Type</label>
                                <Select
                                  id="activityTypeSelect"
                                  options={activityTypesMain.map((opt) => ({
                                    label: opt.value,
                                    value: opt.value,
                                  }))}
                                  onChange={(selected) => handleChange("Activity Type", selected?.value, formik.setFieldValue)}
                                  placeholder="Select Activity..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Activity Type"] ? { label: formik.values["Activity Type"], value: formik.values["Activity Type"] } : null} // Use Formik's value
                                  styles={{
                                    container: (base) => ({
                                      ...base,
                                      width: "300px",   // 👈 set width here
                                    }),
                                  }}
                                />
                              </div>
                            );

                          case "Assigned to":
                            return (
                              <div key={f}>
                                <label htmlFor="assignedToSelect">Assigned to</label>
                                <Select
                                  id="assignedToSelect"
                                  options={assignedToOptions.map((opt) => ({
                                    label: opt.value,
                                    value: opt.value,
                                  }))}
                                  onChange={(selected) => handleChange("Assigned to", selected?.value, formik.setFieldValue)}
                                  placeholder="Select Assigned to..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Assigned to"] ? { label: formik.values["Assigned to"], value: formik.values["Assigned to"] } : null} // Use Formik's value
                                  styles={{
                                    container: (base) => ({
                                      ...base,
                                      width: "300px",   // 👈 set width here
                                    }),
                                  }}
                                />
                              </div>
                            );

                          case "Batch":
                            return (
                              <div key={f}>
                                <label htmlFor="batchSelect">Batch</label>
                                <Select
                                  id="batchSelect"
                                  options={batchOptions.map((opt) => ({
                                    label: opt.name,
                                    value: opt.name,
                                  }))}
                                  onChange={(selected) => handleChange("Batch", selected?.value, formik.setFieldValue)}
                                  placeholder="Select Batch..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Batch"] ? { label: formik.values["Batch"], value: formik.values["Batch"] } : null} // Use Formik's value
                                  styles={{
                                    container: (base) => ({
                                      ...base,
                                      width: "300px",   // 👈 set width here
                                    }),
                                  }}
                                />
                              </div>
                            );

                          case "Medha Area":
                            return (
                              <div key={f}>
                                <label htmlFor="medhaAreaSelect">Medha Area</label>
                                <Select
                                  id="medhaAreaSelect"
                                  options={areaOptions.map((opt) => ({
                                    label: opt.value,
                                    value: opt.value,
                                  }))}
                                  onChange={(selected) => handleChange("Medha Area", selected?.value, formik.setFieldValue)}
                                  placeholder="Medha Area..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Medha Area"] ? { label: formik.values["Medha Area"], value: formik.values["Medha Area"] } : null} // Use Formik's value
                                  styles={{
                                    container: (base) => ({
                                      ...base,
                                      width: "300px",   // 👈 set width here
                                    }),
                                  }}
                                />
                              </div>
                            );

                          case "Program":
                            return (
                              <div key={f}>
                                <label htmlFor="programSelect">Program</label>
                                <Select
                                  id="programSelect"
                                  options={programOptions.map((opt) => ({
                                    label: opt.value,
                                    value: opt.value,
                                  }))}
                                  onChange={(selected) => handleChange("Program", selected?.value, formik.setFieldValue)}
                                  placeholder="Program..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Program"] ? { label: formik.values["Program"], value: formik.values["Program"] } : null} // Use Formik's value
                                  styles={{
                                    container: (base) => ({
                                      ...base,
                                      width: "300px",   // 👈 set width here
                                    }),
                                  }}
                                />
                              </div>
                            );

                          default:
                            return (
                              <Input
                                key={f}
                                name={f}
                                control="input"
                                label={f}
                                className="form-control"
                                onChange={(e) => handleChange(f, e.target.value, formik.setFieldValue)}
                                value={formik.values[f] || ''} // Use Formik's value
                              />
                            );
                        }
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="filter-actions">
                      <button className="btn apply" type="button" onClick={() => handleApply(formik.values)} disabled={isApplyDisabled}>
                        Apply
                      </button>
                      <button className="btn clear" type="button" onClick={clearModalFiltersAndClose}>
                        Clear
                      </button>
                    </div>
                  </div>
                </MultipleFilterBox>
              </Modal.Body>
            </Modal>
          </Form>
        )}
      </Formik>
    );
  };

  const options = [
    { key: 0, value: "assigned_to.username", label: "Assigned To" },
    { key: 1, value: "activity_type", label: "Activity Type" },
    { key: 2, value: "batch.name", label: "Batch" },
    { key: 3, value: "area", label: "Medha Area" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 5, value: "start_date", label: "Start Date" },
    { key: 6, value: "end_date", label: "End Date" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const activityTypes = [
    { key: 0, label: "Workshop/Training Session/Activity (In/Off campus)", value: "Workshop/Training Session/Activity (In/Off campus)" },
    { key: 1, label: "Industry Talk/Expert Talk", value: "Industry Talk/Expert Talk" },
    { key: 2, label: "Alumni Engagement", value: "Alumni Engagement" },
    { key: 3, label: "Industry Visit/Exposure Visit", value: "Industry Visit/Exposure Visit" },
    { key: 4, label: "Placement Drive", value: "Placement Drive" },
  ];

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisabled(true);
    setShowAppliedFilterMessage(false); // Hide the message on clear
    setAppliedFiltersSummary(""); // Clear the summary as well
    setPersistentFilterValues({}); // Clear persistent filter values in the parent
    // Call the API with no search values after clearing
    const baseUrl = "users-ops-activities";
    const searchData = {
      searchFields: [],
      searchValues: [],
    };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const setSearchItem = async (value, formik) => {
    setSelectedSearchField(value);
    setDisabled(false);
    setIsFieldEmpty(false);
    
    // Reset search_by_value and date fields when a new search field is selected,
    // unless the newly selected field is itself a date field.
    formik.setFieldValue("search_by_value", "");
    if (value !== "start_date" && value !== "end_date") {
      let today = new Date();
      formik.setFieldValue("search_by_value_date_from", new Date(today));
      formik.setFieldValue("search_by_value_date_to", new Date(today));
    }

    if (value.includes("assigned_to")) {
      let newSRM = await getAllSearchSrm();
      setAssignedOptions(newSRM);
    } else if (value.includes("batch")) {
      const data = await getAllBatchs();

      const reformatted = data.map(item => ({
        label: item.name,
        value: item.name
      }));
      setBatchOptions(reformatted);
    } else if (value === "area") {
      const { data } = await getFieldValues("area", "users-ops-activities");
      setAreaOptions(data);
    } else if (value === "program_name") {
      const { data } = await getFieldValues("program_name", "users-ops-activities");
      setProgramOptions(data);
    }
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <Section>
              {onefilter ? (
                <Fragment>
                  <SearchRow>
                    <SearchFieldContainer>
                      <Input
                        icon="down"
                        name="search_by_field"
                        label="Search Field"
                        control="lookup"
                        options={options}
                        className="form-control"
                        onChange={(e) => setSearchItem(e.value, formik)}
                      />
                    </SearchFieldContainer>

                    <SearchValueContainer>
                      {/* Conditionally render based on selected field */}
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
                      {selectedSearchField === "program_name" && (
                        <Input
                          icon="down"
                          name="search_by_value"
                          label="Search Value"
                          control="lookup"
                          options={programOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}
                      {selectedSearchField === "activity_type" && (
                        <Input
                          icon="down"
                          name="search_by_value"
                          label="Search Value"
                          control="lookup"
                          options={activityTypesMain}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}
                      {selectedSearchField === "assigned_to.username" && (
                        <Input
                          icon="down"
                          name="search_by_value"
                          label="Search Value"
                          control="lookup"
                          options={assignedToOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}
                      {selectedSearchField === "batch.name" && (
                        <Input
                          icon="down"
                          name="search_by_value"
                          label="Search Value"
                          control="lookup"
                          options={batchOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}
                      {selectedSearchField === "area" && (
                        <Input
                          icon="down"
                          name="search_by_value"
                          label="Search Value"
                          control="lookup"
                          options={areaOptions}
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
                                onChange={(date) => formik.setFieldValue("search_by_value_date_from", date)}
                                value={formik.values.search_by_value_date_from}
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
                                minDate={formik.values.search_by_value_date_from}
                                onChange={(date) => formik.setFieldValue("search_by_value_date_to", date)}
                                value={formik.values.search_by_value_date_to}
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
                        // disabled={disabled}
                      >
                        CLEAR
                      </button>
                    </SearchButtonContainer>
                  </SearchRow>
                  {showAppliedFilterMessage && appliedFiltersSummary && (
                    <p style={{ color: '#257b69', marginTop: '10px' }}>{appliedFiltersSummary}</p>
                  )}
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
                </Fragment>
              ) : (
                <FilterBox
                  closefilterBox={closefilterBox}
                  handleSubmit={handleSubmit}
                  clear={clear}
                  initialSelectedField={selectedSearchField}
                  initialFilterValues={(() => {
                    const mappedValues = {};
                    if (selectedSearchField === "start_date") {
                      // Ensure these are always Date objects when passed to FilterBox
                      mappedValues["Start Date From"] = formik.values.search_by_value_date_from ? new Date(formik.values.search_by_value_date_from) : null;
                      mappedValues["Start Date To"] = formik.values.search_by_value_date_to ? new Date(formik.values.search_by_value_date_to) : null;
                    } else if (selectedSearchField === "end_date") {
                      // Ensure these are always Date objects when passed to FilterBox
                      mappedValues["End Date From"] = formik.values.search_by_value_date_from ? new Date(formik.values.search_by_value_date_from) : null;
                      mappedValues["End Date To"] = formik.values.search_by_value_date_to ? new Date(formik.values.search_by_value_date_to) : null;
                    } else if (formik.values.search_by_field && formik.values.search_by_value) {
                      // Map other single filter fields to their display names in FilterBox
                      const filterMap = {
                        "assigned_to.username": "Assigned to",
                        "activity_type": "Activity Type",
                        "batch.name": "Batch",
                        "area": "Medha Area",
                        "program_name": "Program",
                      };
                      const filterKey = filterMap[formik.values.search_by_field];
                      if (filterKey) {
                        mappedValues[filterKey] = formik.values.search_by_value;
                      }
                    }
                    return { ...persistentFilterValues, ...mappedValues }; // Merge with persistent values
                  })()}
                  formik={formik} // Pass formik object directly
                  setAppliedFiltersSummary={setAppliedFiltersSummary} // Pass the setter for the summary
                  setPersistentFilterValues={setPersistentFilterValues} // Pass the setter for persistent values
                  excludeFilter={(() => {
                    const singleFilterMap = {
                      "assigned_to.username": "Assigned to",
                      "activity_type": "Activity Type",
                      "batch.name": "Batch",
                      "area": "Medha Area",
                      "program_name": "Program",
                      "start_date": "Start Date",
                      "end_date": "End Date",
                    };
                    return singleFilterMap[selectedSearchField];
                  })()} // Pass the currently selected single filter to exclude
                />
              )}
            </Section>
            </Form>
          )}
        </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(OpsSearchDropdown);