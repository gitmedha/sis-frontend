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

  const initialValues = {
    searches: Array(counter).fill({
      search_by_field: "",
      search_by_value: "",
    }),
  };

   const closefilterBox = () => {
      setOnefilter(true);
      // clear();
    };
  
    const filters = [

      "Medha Area",
      "Program Name",
    ];
  
    const FilterBox = ({ closefilterBox, clear }) => {
      const [activeFilters, setActiveFilters] = useState([]);
       const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
      
      const [filterValues, setFilterValues] = useState({});
  
      const handleChange = (filter, value) => {
        setFilterValues((prev) => ({
          ...prev,
          [filter]: value,
        }));
      };
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
        const searchFields = Object.keys(filterValues);
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
        // handleSubmit(searchData);
        // 👉 call API here if needed, same as in onefilter
        // searchOperationTab("users-ops-activities", searchData);
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
        <>
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
                      // <select key={f} className="filter-select" onChange={(e) => handleChange('activity_type', e.target.value)}>
                      //   <option value="">Select Activity</option>
                      //   {activityTypesMain.map((opt, idx) => (
                      //     <option key={idx} value={opt.value}>{opt.value}</option>
                      //   ))}
                      // </select>
  
                      <Select
                        options={medhaAreaOptions.map((opt) => ({
                          label: opt.value,
                          value: opt.value,
                        }))}
                        onChange={(selected) => handleChange("area", selected?.value)}
                        placeholder="Select Activity..."
                        isClearable
                        isSearchable
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: "300px",   // 👈 set width here
                          }),
                        }}
                      />
                    );
  
                  case "Program Name":
                    return (
                      
                      <Select
                        options={programNameOptions.map((opt) => ({
                          label: opt.value,
                          value: opt.value,
                        }))}
                        onChange={(selected) => handleChange("program_name", selected?.value)}
                        placeholder="Select Assigned to..."
                        isClearable
                        isSearchable
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
                      <select key={f} className="filter-select">
                        <option>{f}</option>
                      </select>
                    );
                }
              })}
            </div>
  
  
            {/* Action Buttons */}
            <div className="filter-actions">
              <button className="btn apply" type="button" onClick={handleApply}>
                Apply
              </button>
              <button className="btn clear" type="button" onClick={closefilterBox}>
                Clear
              </button>
            </div>
          </div>
        </>
      );
    };

  const handleSubmit = async (values) => {
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
      {onefilter ? (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => (
            <Form>
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
                    <div className="">  
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

                {/* Action Buttons Row */}
                
              </Section>
            </Form>
          )}
        </Formik>
      ) : (
        <FilterBox closefilterBox={closefilterBox} handleSubmit={handleSubmit} clear={clear} />
        // "hello"
      )}
    </Fragment>
  );
};


export default connect(null, { searchOperationTab, resetSearch })(CollegePitchSearch);