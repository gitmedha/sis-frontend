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
    // No need to reset filterValues in FilterBox as it will be unmounted
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

  const FilterBox = ({ closefilterBox, clear, initialSelectedField, initialFilterValues, formik }) => {
    const [activeFilters, setActiveFilters] = useState(() => {
      const initialActive = [];
      if (initialSelectedField && (initialFilterValues?.search_by_value || (initialSelectedField.includes('_date') && (initialFilterValues?.search_by_value_date_from || initialFilterValues?.search_by_value_date_to)))) {
        // Convert field name to readable filter name
        const filterMap = {
          "assigned_to.username": "Assigned to",
          "activity_type": "Activity Type",
          "batch.name": "Batch",
          "area": "Medha Area",
          "program_name": "Program",
          "start_date": "Start Date", // Explicitly map backend field to display label
          "end_date": "End Date",     // Explicitly map backend field to display label
        };
        const filterLabel = filterMap[initialSelectedField];
        if (filterLabel) {
          initialActive.push(filterLabel);
        }
      } else if (initialFilterValues) {
        // If there are other initialFilterValues, add their keys to activeFilters
        // These keys should already be in human-readable format from the parent mapping
        for (const key in initialFilterValues) {
          if (initialFilterValues.hasOwnProperty(key)) {
            initialActive.push(key);
          }
        }
      }
      return initialActive;
    });
    const [filterValues, setFilterValues] = useState(() => {
      // Initialize filterValues directly with initialFilterValues, as it is expected to be pre-mapped
      return initialFilterValues;
    });
    const [filterErrors, setFilterErrors] = useState({}); // State to store validation errors
    const [isApplyDisabled, setIsApplyDisabled] = useState(true); // State to control Apply button disabled state
    
    const [activityTypeOptions, setActivityTypeOptions] = useState([]);
    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);

    // Validation function for all active filters
    const validateAllFilters = () => {
      const newErrors = {};
      let allValid = true;

      if (activeFilters.length === 0) {
        // If no filters are active, the Apply button should be disabled
        setIsApplyDisabled(true);
        return false; // Not all valid
      }

      activeFilters.forEach(filter => {
        if (filter === "Start Date" || filter === "End Date") {
          const fromValue = filterValues[`${filter} From`];
          const toValue = filterValues[`${filter} To`];
          if (!fromValue || !toValue) {
            newErrors[filter] = "Both Start Date From and To are required.";
            allValid = false;
          }
        } else if (!filterValues[filter] || (typeof filterValues[filter] === 'string' && filterValues[filter].trim() === '')) {
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
        let newValue = value;
        // Convert date strings to Date objects if it's a date filter
        if (filter.includes("Date From") || filter.includes("Date To")) {
          newValue = value ? new Date(value) : null;
        }
        const updatedValues = {
          ...prev,
          [filter]: newValue,
        };
        // After updating filter values, re-validate
        // Pass a dummy activeFilters if it's not ready yet, or use the current state
        validateAllFilters();
        return updatedValues;
      });
    };

    useEffect(() => {
      validateAllFilters(); // Validate on mount and whenever activeFilters or filterValues change
    }, [activeFilters, filterValues]);

    useEffect(() => {
      activeFilters.forEach(async (filter) => {
        let fieldName = filter.toLowerCase().replace(/ /g, "_");
        if (fieldName.includes('trainer_1') || fieldName.includes('trainer_2')) {
          fieldName = fieldName.replace('_','.');
        }

        // Prevent re-fetching if data is already present from initialFilterValues or previously fetched
        if (filterValues[fieldName] && filter !== "Activity Type" && filter !== "Project Type") {
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
        else if (filter === "Program Area" && programOptions.length === 0) {
          const { data } = await getFieldValues("program_name", "users-ops-activities");
          setProgramOptions(data);
        }
      });
    }, [activeFilters, filterValues]); // Add filterValues to dependency array

    const toggleFilter = (filter) => {
      setActiveFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]
      );
    };
    const handleApply = async () => {
      console.log("FilterBox - filterValues before constructing searchData:", filterValues);
      const searchFields = [];
      const searchValues = [];
      
      // Run validation before applying filters
      if (!validateAllFilters()) {
        return; // Stop if validation fails
      }

      for (const filterKey in filterValues) {
        if (filterValues.hasOwnProperty(filterKey)) {
          let backendFieldName = filterKey.toLowerCase().replace(/ /g, "_");
          
          // Special handling for date fields to match backend expectations
          if (backendFieldName.includes("start_date_from")) {
            backendFieldName = "start_date_from";
          } else if (backendFieldName.includes("start_date_to")) {
            backendFieldName = "start_date_to";
          } else if (backendFieldName.includes("end_date_from")) {
            backendFieldName = "end_date_from";
          } else if (backendFieldName.includes("end_date_to")) {
            backendFieldName = "end_date_to";
          } else if (backendFieldName.includes('assigned_to')) {
            backendFieldName = 'assigned_to.username';
          } else if (backendFieldName.includes('medha_area')) {
            backendFieldName = 'area';
          } else if (backendFieldName.includes('program_area')) {
            backendFieldName = 'program_name';
          } else if (backendFieldName.includes('batch')) {
            backendFieldName = 'batch.name';
          }

          // console.log("Pushing to searchFields:", backendFieldName);
          // console.log("Pushing to searchValues:", filterValues[filterKey]);
          searchFields.push(backendFieldName);
          // Convert Date objects to ISO strings for API compatibility
          const valueToPush = filterValues[filterKey] instanceof Date 
            ? filterValues[filterKey].toISOString() 
            : filterValues[filterKey];
          searchValues.push(valueToPush);
        }
      }

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
      // Show the "Multiple filter applied" message after closing the modal
      setShowAppliedFilterMessage(true);
      // Hide the message after a few seconds
      // setTimeout(() => {
      //   setShowAppliedFilterMessage(false);
      // }, 3000); // Message will be visible for 3 seconds
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
      <Modal
        centered
        size="xl"
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
                              <input
                                type="date"
                                name={`${f}_from`}
                                className="form-control w-300"
                                onChange={(e) => {
                                  handleChange(`${f} From`, e.target.value);
                                }}
                                value={filterValues[`${f} From`]?.toISOString().split('T')[0] || ''}
                              />
                            </div>
                            <div className="date-input-group">
                              <label>{`${f} To`}</label>
                              <input
                                type="date"
                                name={`${f}_to`}
                                className="form-control w-300"
                                
                                onChange={(e) => {
                                  handleChange(`${f} To`, e.target.value);
                                }}
                                value={filterValues[`${f} To`]?.toISOString().split('T')[0] || ''}
                              />
                            </div>
                          </DateRangeContainer>
                          {filterErrors[f] && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{filterErrors[f]}</p>}
                        </Fragment>
                      );

                    case "Activity Type":
                      return (
                        <Select
                          options={activityTypesMain.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) => handleChange("Activity Type", selected?.value)}
                          placeholder="Select Activity..."
                          isClearable
                          isSearchable
                          value={filterValues["Activity Type"] ? { label: filterValues["Activity Type"], value: filterValues["Activity Type"] } : null}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",   // 👈 set width here
                            }),
                          }}
                        />
                      );

                    case "Assigned to":
                      return (
                        
                        <Select
                          options={assignedToOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) => handleChange("Assigned to", selected?.value)}
                          placeholder="Select Assigned to..."
                          isClearable
                          isSearchable
                          value={filterValues["Assigned to"] ? { label: filterValues["Assigned to"], value: filterValues["Assigned to"] } : null}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",   // 👈 set width here
                            }),
                          }}
                        />
                      );

                    case "Batch":
                      return (
                        <Select
                          options={batchOptions.map((opt) => ({
                            label: opt.name,
                            value: opt.name,
                          }))}
                          onChange={(selected) => handleChange("Batch", selected?.value)}
                          placeholder="Select Batch..."
                          isClearable
                          isSearchable
                          value={filterValues["Batch"] ? { label: filterValues["Batch"], value: filterValues["Batch"] } : null}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",   // 👈 set width here
                            }),
                          }}
                        />

                      );

                    case "Medha Area":
                      return (
                        <Select
                          options={areaOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) => handleChange("Medha Area", selected?.value)}
                          placeholder="Medha Area..."
                          isClearable
                          isSearchable
                          value={filterValues["Medha Area"] ? { label: filterValues["Medha Area"], value: filterValues["Medha Area"] } : null}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",   // 👈 set width here
                            }),
                          }}
                        />
                      );

                    case "Program":
                      return (
                        <Select
                          options={programOptions.map((opt) => ({
                            label: opt.value,
                            value: opt.value,
                          }))}
                          onChange={(selected) => handleChange("Program", selected?.value)}
                          placeholder="Progrma..."
                          isClearable
                          isSearchable
                          value={filterValues["Program"] ? { label: filterValues["Program"], value: filterValues["Program"] } : null}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",   // 👈 set width here
                            }),
                          }}
                        />
                      );

                    default:
                      return (
                        <Input
                          key={f}
                          name={f.replace(/ /g, "_").toLowerCase()}
                          control="input"
                          label={f}
                          className="form-control"
                          onChange={(e) => handleChange(f, e.target.value)}
                          value={filterValues[f] || ''}
                        />
                      );
                  }
                })}
              </div>


              {/* Action Buttons */}
              <div className="filter-actions">
                <button className="btn apply" type="button" onClick={handleApply} disabled={isApplyDisabled}>
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
    console.log(value);
    
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
                        // disabled={disabled}
                      >
                        CLEAR
                      </button>
                    </SearchButtonContainer>
                  </SearchRow>
                  {showAppliedFilterMessage && (
                    <p style={{ color: '#257b69', marginTop: '10px' }}>Multiple Filter Applied</p>
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
                    return mappedValues;
                  })()}
                  formik={formik} // Pass formik object directly
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