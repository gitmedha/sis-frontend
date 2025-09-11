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
import './ops.css';

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
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false); // State for applied filter message
  const [appliedFiltersSummary, setAppliedFiltersSummary] = useState(""); // Summary of applied filters
  const [persistentFilterValues, setPersistentFilterValues] = useState({}); // Persist multi-filter values across modal open/close
  const [appliedFilters, setAppliedFilters] = useState([]); // Array of { label, value }

  const initialValues = {
    searches: Array(counter).fill({
      search_by_field: "",
      search_by_value: "",
    }),
  };

   const closefilterBox = () => {
      setOnefilter(true);
      setShowAppliedFilterMessage(false); // Hide the message when modal is dismissed
      // No API call on close
    };
  
    // New function for clearing filters only within the modal, then closing it
    const clearModalFiltersAndClose = async () => {
      setPersistentFilterValues({});
      setAppliedFiltersSummary("");
      setShowAppliedFilterMessage(false);
      setAppliedFilters([]);
      const baseUrl = "college-pitches";
      const searchData = { searchFields: [], searchValues: [] };
      await searchOperationTab(baseUrl, searchData);
      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({ baseUrl, searchData })
      );
      closefilterBox();
    };
  
    const filters = [

      "Medha Area",
      "Program Name",
    ];
  
    const FilterBox = ({ closefilterBox, clear, clearModalFiltersAndClose, initialSelectedField, initialFilterValues, formik: parentFormik }) => {
      const filterMap = {
        "area": "Medha Area",
        "program_name": "Program Name",
      };

      const [activeFilters, setActiveFilters] = useState(() => {
        const initial = new Set();
        if (initialSelectedField && initialFilterValues[filterMap[initialSelectedField]]) {
          initial.add(filterMap[initialSelectedField]);
        }
        Object.keys(initialFilterValues || {}).forEach(k => {
          if (initialFilterValues[k] !== null && initialFilterValues[k] !== '') initial.add(k);
        });
        return Array.from(initial);
      });
      const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
      const [programNameOptions, setProgramOptions] = useState([]);
      const [filterErrors, setFilterErrors] = useState({});
      const [isApplyDisabled, setIsApplyDisabled] = useState(true);

      const validateAllFilters = (values) => {
        const newErrors = {};
        let allValid = true;
        if (activeFilters.length === 0) {
          setIsApplyDisabled(true);
          return false;
        }
        activeFilters.forEach(filter => {
          const v = values[filter];
          if (!v || (typeof v === 'string' && v.trim() === '')) {
            newErrors[filter] = `Please select a ${filter.toLowerCase()}.`;
            allValid = false;
          }
        });
        setFilterErrors(newErrors);
        setIsApplyDisabled(!allValid);
        return allValid;
      };

      const handleChange = (filter, value, setFieldValue) => {
        setFieldValue(filter, value);
      };

      useEffect(() => {
        activeFilters.forEach(async (filter) => {
          if (filter === "Medha Area" && medhaAreaOptions.length === 0) {
            const { data } = await getFieldValues("area", "college-pitches");
            setMedhaAreaOptions(data);
          }
          else if (filter === "Program Name" && programNameOptions.length === 0) {
            const resp = await getFieldValues("program_name", "college-pitches");
            const data = resp?.data || resp; // handle both shapes
            setProgramOptions(data?.data || data);
          }
        });
      }, [activeFilters]);

      const toggleFilter = (filter, formik) => {
        setActiveFilters((prev) => {
          const isActive = prev.includes(filter);
          if (isActive) {
            formik.setFieldValue(filter, null);
            return prev.filter((f) => f !== filter);
          }
          return [...prev, filter];
        });
      };

      const handleApply = async (values) => {
        if (!validateAllFilters(values)) return;
        const backendFieldMap = {
          "Medha Area": "area",
          "Program Name": "program_name",
        };
        const searchFields = [];
        const searchValues = [];
        const summaryParts = [];
        const appliedList = [];
        Object.keys(values).forEach((key) => {
          const val = values[key];
          if (val !== null && val !== undefined && val !== '') {
            searchFields.push(backendFieldMap[key] || key);
            searchValues.push(val);
            summaryParts.push(`${key}: ${val}`);
            appliedList.push({ label: key, value: val });
          }
        });
        const searchData = { searchFields, searchValues };
        const baseUrl = "college-pitches";
        await searchOperationTab(baseUrl, searchData);
        await localStorage.setItem(
          "prevSearchedPropsAndValues",
          JSON.stringify({ baseUrl, searchData })
        );
        setPersistentFilterValues(values);
        setAppliedFilters(appliedList);
        if (summaryParts.length > 0) {
          setAppliedFiltersSummary("Multiple Filter Applied: " + summaryParts.join(", "));
          setShowAppliedFilterMessage(true);
        } else {
          setAppliedFiltersSummary("");
          setShowAppliedFilterMessage(false);
          setAppliedFilters([]);
        }
        closefilterBox();
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
          enableReinitialize={true}
          onSubmit={(values) => handleApply(values)}
          validate={(values) => { validateAllFilters(values); }}
        >
          {(formik) => (
            <Form>
              <Modal
                centered
                size="lg"
                show={true}
                onHide={closefilterBox}
                animation={false}
                aria-labelledby="contained-modal-title-vcenter"
                className="form-modal"
              >
                <Modal.Header  className="bg-white">
                  <Modal.Title id="contained-modal-title-vcenter" className="text--primary latto-bold">
                    Add Filters
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="">
                  <div className="filter-box">
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
                          case "Medha Area":
                            return (
                              <div key={f}>
                                <label htmlFor="medha_area">{f}</label>
                                <Select
                                  id="medha_area"
                                  options={medhaAreaOptions.map((opt) => ({ label: opt.value, value: opt.value }))}
                                  onChange={(selected) => handleChange("Medha Area", selected?.value, formik.setFieldValue)}
                                  placeholder="Select Medha Area..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Medha Area"] ? { label: formik.values["Medha Area"], value: formik.values["Medha Area"] } : null}
                                  styles={{ container: (base) => ({ ...base, width: "300px" }) }}
                                />
                                {filterErrors["Medha Area"] && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{filterErrors["Medha Area"]}</p>}
                              </div>
                            );
                          case "Program Name":
                            return (
                              <div key={f} className="filter-group">
                                <label htmlFor="programSelect">{f}</label>
                                <Select
                                  id="programSelect"
                                  options={programNameOptions.map((opt) => ({ label: opt.value, value: opt.value }))}
                                  onChange={(selected) => handleChange("Program Name", selected?.value, formik.setFieldValue)}
                                  placeholder="Select Program Name..."
                                  isClearable
                                  isSearchable
                                  value={formik.values["Program Name"] ? { label: formik.values["Program Name"], value: formik.values["Program Name"] } : null}
                                  styles={{ container: (base) => ({ ...base, width: "300px" }) }}
                                />
                                {filterErrors["Program Name"] && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{filterErrors["Program Name"]}</p>}
                              </div>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>

                    <div className="filter-actions">
                      <button className="btn apply_pitch" style={{background:"#21867a",color:"#fff"}} type="button" onClick={formik.handleSubmit} disabled={isApplyDisabled}>
                        Apply
                      </button>
                      <button className="btn clear" type="button" onClick={clearModalFiltersAndClose}>
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

  const handleSubmit = async (values) => {
    setShowAppliedFilterMessage(false);
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
    setShowAppliedFilterMessage(false);
    setAppliedFiltersSummary("");
    setPersistentFilterValues({});
    setAppliedFilters([]);
    const baseUrl = "college-pitches";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
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
                  return { ...persistentFilterValues, ...mappedValues };
                })()}
                formik={formik}
                clearModalFiltersAndClose={clearModalFiltersAndClose}
              />
            )}
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};


export default connect(null, { searchOperationTab, resetSearch })(CollegePitchSearch);