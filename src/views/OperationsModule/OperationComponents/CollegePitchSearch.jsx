import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getFieldValues } from "./operationsActions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import "./ops.css";
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
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
`;

const SearchFieldContainer = styled.div`
  flex: 0 0 200px;
`;

const SearchValueContainer = styled.div`
  flex: 0 0 300px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 28px;
  
  svg {
    cursor: pointer;
    font-size: 20px;
    color: #207b69;
    &:hover {
      color: #16574a;
    }
  }
`;

const SearchButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px; /* Adjust as needed for alignment with other inputs */
`;

const CollegePitchSearch = ({ searchOperationTab, resetSearch }) => {
  const options = [
    { key: 0, value: "area", label: "Medha Area" },
    { key: 1, value: "program_name", label: "Program Name" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1);
  const [onefilter, setOnefilter] = useState(true);
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false); // State for "Multiple filter applied" message

  const initialValues = {
    searches: Array(counter).fill({
      search_by_field: "",
      search_by_value: "",
    }),
  };

   const closefilterBox = () => {
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

      "Medha Area",
      "Program Name",
    ];
  
    const FilterBox = ({ closefilterBox, clear, clearModalFiltersAndClose, setShowAppliedFilterMessage, initialSelectedField, initialFilterValues, formik }) => {
      const filterMap = {
        "area": "Medha Area",
        "program_name": "Program Name",
      };
  
      const [activeFilters, setActiveFilters] = useState(() => {
        if (initialSelectedField && initialFilterValues[filterMap[initialSelectedField]]) {
          return [filterMap[initialSelectedField]];
        }
        return [];
      });
      const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
      const [programNameOptions, setProgramOptions] = useState([]);
  
      const [filterValues, setFilterValues] = useState(() => {
        if (initialFilterValues) {
          return initialFilterValues;
        }
        return {};
      });
      const [filterErrors, setFilterErrors] = useState({}); // State to store validation errors
      const [isApplyDisabled, setIsApplyDisabled] = useState(true); // State to control Apply button disabled state
  
      // Validation function for all active filters
      const validateAllFilters = () => {
        const newErrors = {};
        let allValid = true;
  
        if (activeFilters.length === 0) {
          setIsApplyDisabled(true);
          return false;
        }
  
        activeFilters.forEach(filter => {
          if (!filterValues[filter] || (typeof filterValues[filter] === 'string' && filterValues[filter].trim() === '')) {
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
          const updatedValues = {
            ...prev,
            [filter]: value,
          };
          validateAllFilters(); // Re-validate after updating filter values
          return updatedValues;
        });
      };
      useEffect(() => {
        validateAllFilters(); // Validate on mount and whenever activeFilters or filterValues change
      }, [activeFilters, filterValues]);
  
      useEffect(() => {
        activeFilters.forEach(async (filter) => {
          if (filter === "Medha Area" && medhaAreaOptions.length === 0) {
            const { data } = await getFieldValues("area", "college-pitches");
            
            
            setMedhaAreaOptions(data);
          }
          else if (filter === "Program Name" && programNameOptions.length === 0) {
            const  data  = await getFieldValues("program_name", "college-pitches");
           
            
            setProgramOptions(data.data);
          }
        });
      }, [activeFilters]);
  
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
          "Medha Area": "area",
          "Program Name": "program_name",
        };
  
        const searchFields = Object.keys(filterValues).map(key => backendFieldMap[key] || key);
        const searchValues = Object.values(filterValues);
  
        const searchData = {
          searchFields,
          searchValues,
        };
        const baseUrl = "college-pitches";
      
        await searchOperationTab(baseUrl, searchData);
        await localStorage.setItem(
          "prevSearchedPropsAndValues",
          JSON.stringify({ baseUrl, searchData })
        );
        closefilterBox(); // Close the modal
        setShowAppliedFilterMessage(true); // Show the message
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

              {/* Filter Inputs */}
              <div className="filter-inputs">
                {activeFilters.map((f) => {
                  switch (f) {
                    
                    case "Medha Area":
                      return (
                        <Fragment>
                          <Select
                            options={medhaAreaOptions.map((opt) => ({
                              label: opt.value,
                              value: opt.value,
                            }))}
                            onChange={(selected) => handleChange("Medha Area", selected?.value)}
                            placeholder="Select Activity..."
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
                          {filterErrors["Medha Area"] && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{filterErrors["Medha Area"]}</p>}
                        </Fragment>
                      );
  
                    case "Program Name":
                      return (
                        <Fragment>
                          <Select
                            options={programNameOptions.map((opt) => ({
                              label: opt.value,
                              value: opt.value,
                            }))}
                            onChange={(selected) => handleChange("Program Name", selected?.value)}
                            placeholder="Select Assigned to..."
                            isClearable
                            isSearchable
                            value={filterValues["Program Name"] ? { label: filterValues["Program Name"], value: filterValues["Program Name"] } : null}
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: "300px",   // 👈 set width here
                              }),
                            }}
                          />
                          {filterErrors["Program Name"] && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{filterErrors["Program Name"]}</p>}
                        </Fragment>
                      );
                    default:
                      return (
                        <select key={f} className="filter-select">
                          <option>{f}</option>
                        </select>
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
          </Modal.Body>
        </Modal>
      );
    };

  const handleSubmit = async (values) => {
    setShowAppliedFilterMessage(false); // Hide multi-filter applied message on single filter submission
    const baseUrl = "college-pitches";
    const searchFields = [];
    const searchValues = [];

    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
      }
    });

    const payload = { searchFields, searchValues };
    await searchOperationTab(baseUrl, payload);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData: payload })
    );
  };

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchFields([null]);
    setDisabled(true);
    setCounter(1);
  };

  const setSearchItem = (value, index) => {
    const newSelectedSearchFields = [...selectedSearchFields];
    newSelectedSearchFields[index] = value;
    setSelectedSearchFields(newSelectedSearchFields);
    setDisabled(false);

    if (value === "area") {
      setDropdownValues("area");
    } else if (value === "program_name") {
      setDropdownValues("program_name");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "college-pitches");
      if (fieldName === "area") setMedhaAreaOptions(data);
      else if (fieldName === "program_name") setProgramOptions(data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const addSearchRow = () => {
    setCounter(counter + 1);
    setSelectedSearchFields([...selectedSearchFields, null]);
  };

  const removeSearchRow = () => {
    if (counter > 1) {
      setCounter(counter - 1);
      const newSelectedFields = [...selectedSearchFields];
      newSelectedFields.pop();
      setSelectedSearchFields(newSelectedFields);
    }
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            {onefilter ? (
              <Section>
                {Array.from({ length: counter }).map((_, index) => (
                  <SearchRow key={index}>
                    {/* Search Field Column */}
                    <div className="col-lg-2 col-md-4 col-sm-6">
                      <SearchFieldContainer>
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_field`}
                          label="Search Field"
                          control="lookup"
                          options={options}
                          className="form-control"
                          onChange={(e) => setSearchItem(e.value, index)}
                        />
                      </SearchFieldContainer>
                    </div>

                    {/* Search Value Column */}
                    <div className="col-lg-3 col-md-4 col-sm-6">  
                      <SearchValueContainer>
                        {selectedSearchFields[index] === null && (
                          <Input
                            name={`searches[${index}].search_by_value`}
                            control="input"
                            label="Search Value"
                            className="form-control"
                            disabled
                          />
                        )}

                        {selectedSearchFields[index] === "area" && (
                          <Input
                            icon="down"
                            name={`searches[${index}].search_by_value`}
                            label="Search Value"
                            control="lookup"
                            options={medhaAreaOptions}
                            className="form-control"
                            disabled={disabled}
                          />
                        )}

                        {selectedSearchFields[index] === "program_name" && (
                          <Input
                            icon="down"
                            name={`searches[${index}].search_by_value`}
                            label="Search Value"
                            control="lookup"
                            options={programNameOptions}
                            className="form-control"
                            disabled={disabled}
                          />
                        )}
                      </SearchValueContainer>
                    </div>

                    {/* Add/Remove Icons Column */}
                    {/* {index === counter - 1 && (
                      <div className="col-lg-1 col-md-2 col-sm-12">
                        <IconContainer>
                          <FaPlusCircle onClick={addSearchRow} title="Add Search Row" />
                          {counter > 1 && <FaMinusCircle onClick={removeSearchRow} title="Remove Search Row" />}
                        </IconContainer>
                      </div>
                    )} */}

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
                ))}

                {showAppliedFilterMessage && (
                  <p style={{ color: '#257b69', marginTop: '10px' }}>Multiple Filter Applied</p>
                )}

                {/* Action Buttons Row */}
                
              </Section>
            ) : (
              <FilterBox
                closefilterBox={closefilterBox}
                handleSubmit={handleSubmit}
                clear={clear}
                initialSelectedField={selectedSearchFields[0]}
                initialFilterValues={(() => {
                  const mappedValues = {};
                  if (selectedSearchFields[0] && formik.values.searches && formik.values.searches.length > 0) {
                    const singleFilter = formik.values.searches[0];
                    if (singleFilter.search_by_field && singleFilter.search_by_value) {
                      const filterMap = {
                        "area": "Medha Area",
                        "program_name": "Program Name",
                      };
                      const filterKey = filterMap[singleFilter.search_by_field];
                      if (filterKey) {
                        mappedValues[filterKey] = singleFilter.search_by_value;
                      }
                    }
                  }
                  return mappedValues;
                })()}
                formik={formik} // Pass formik object directly
                clearModalFiltersAndClose={clearModalFiltersAndClose}
                setShowAppliedFilterMessage={setShowAppliedFilterMessage}
              />
            )}
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};


export default connect(null, { searchOperationTab, resetSearch })(CollegePitchSearch);