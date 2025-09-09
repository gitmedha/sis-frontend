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
import "./Ops.css";
import { getAllBatches } from "src/views/Batches/batchActions";
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

  const handleSubmit = async (values) => {
    const baseUrl = "users-ops-activities";
    const searchData = {
      searchFields: [values.search_by_field],
      searchValues: [values.search_by_value],
    };

    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const closefilterBox = () => {
    
    setOnefilter(true);
    // clear();
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

  const FilterBox = ({ closefilterBox, clear }) => {
    const [activeFilters, setActiveFilters] = useState([]);
    const [activityTypeOptions, setActivityTypeOptions] = useState([]);
    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const [batchOptions, setBatchOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [filterValues, setFilterValues] = useState({});

    const handleChange = (filter, value) => {
      setFilterValues((prev) => ({
        ...prev,
        [filter]: value,
      }));
    };
    useEffect(() => {
      activeFilters.forEach(async (filter) => {
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
      const baseUrl = "users-ops-activities";
      
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
      <MultipleFilterBox>
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
                case "Start Date":
                case "End Date":
                  return (
                    <DateRangeContainer key={f}>
                      <Input
                        name={`${f}_from`}
                        control="datepicker"
                        label={`${f} From`}
                        className="form-control"
                      />
                      <Input
                        name={`${f}_to`}
                        control="datepicker"
                        label={`${f} To`}
                        className="form-control"
                      />
                    </DateRangeContainer>
                  );

                case "Activity Type":
                  return (
                    // <select key={f} className="filter-select" onChange={(e) => handleChange('activity_type', e.target.value)}>
                    //   <option value="">Select Activity</option>
                    //   {activityTypesMain.map((opt, idx) => (
                    //     <option key={idx} value={opt.value}>{opt.value}</option>
                    //   ))}
                    // </select>

                    <Select
                      options={activityTypesMain.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("activity_type", selected?.value)}
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

                case "Assigned to":
                  return (
                    
                    <Select
                      options={assignedToOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("assigned_to.username", selected?.value)}
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

                case "Batch":
                  return (
                    <Select
                      options={batchOptions.map((opt) => ({
                        label: opt.name,
                        value: opt.name,
                      }))}
                      onChange={(selected) => handleChange("batch.name", selected?.value)}
                      placeholder="Select Batch..."
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

                case "Medha Area":
                  return (
                    // <select key={f} className="filter-select" onChange={(e) => handleChange('area', e.target.value)}>
                    //   {console.log(areaOptions)
                    //   }
                    //   <option value="">Select Area</option>
                    //   {areaOptions.map((opt, idx) => (
                    //     <option key={idx} value={opt.value}>{opt.value}</option>
                    //   ))}
                    // </select>
                    <Select
                      options={batchOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("area", selected?.value)}
                      placeholder="Medha Area..."
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

                case "Program":
                  return (
                    // <select key={f} className="filter-select" onChange={(e) => handleChange('program_name', e.target.value)}>
                    //   <option value="">Select Program</option>
                    //   {programOptions.map((opt, idx) => (
                    //     <option key={idx} value={opt.value}>{opt.value}</option>
                    //   ))}
                    // </select>
                    <Select
                      options={batchOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("program_name", selected?.value)}
                      placeholder="Progrma..."
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
      </MultipleFilterBox>
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
  };

  const setSearchItem = async (value) => {
    setSelectedSearchField(value);
    setDisabled(false);
    setIsFieldEmpty(false);

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
      {onefilter ? (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => (
            <Form>
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

                  <div
                    className="col-lg-3 col-md-6 col-sm-12 mt-3 d-flex justify-content-around align-items-center"
                    style={{ gap: "12px" }}
                  >
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
                  </div>
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
            </Form>
          )}
        </Formik>
      ) : (
        <FilterBox closefilterBox={closefilterBox} handleSubmit={handleSubmit} clear={clear} />
      )}
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(OpsSearchDropdown);