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

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_from: new Date(today),
    search_by_value_date_to: new Date(today),
  };

  const handleSubmit = async (values) => {
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
  };

  const closefilterBox = () => {
    setOnefilter(true);
    // clear(); // Need to pass formik prop if this is used
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
    "Start Date",
    "End Date",
  ];

  const FilterBox = ({ closefilterBox, clear }) => {
    const [activeFilters, setActiveFilters] = useState([]);
    const [filterValues, setFilterValues] = useState({});
    const [mentorNameOptions, setMentorNameOptions] = useState([]);
    const [mentorDomainOptions, setMentorDomainOptions] = useState([]);
    const [mentorCompanyOptions, setMentorCompanyOptions] = useState([]);
    const [designationOptions, setDesignationOptions] = useState([]);
    const [mentorAreaOptions, setMentorAreaOptions] = useState([]);
    const [mentorStateOptions, setMentorStateOptions] = useState([]);
    const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
    const [programNameOptions, setProgramNameOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
      activeFilters.forEach(async (filter) => {
        if (filter === "Mentor Name" && mentorNameOptions.length === 0) {
          const { data } = await getFieldValues("mentor_name", "mentorship");
          setMentorNameOptions(data);
        } else if (filter === "Mentor Domain" && mentorDomainOptions.length === 0) {
          const { data } = await getFieldValues("mentor_domain", "mentorship");
          setMentorDomainOptions(data);
        } else if (filter === "Mentor Company Name" && mentorCompanyOptions.length === 0) {
          const { data } = await getFieldValues("mentor_company_name", "mentorship");
          setMentorCompanyOptions(data);
        } else if (filter === "Designation" && designationOptions.length === 0) {
          const { data } = await getFieldValues("designation", "mentorship");
          setDesignationOptions(data);
        } else if (filter === "Mentor Area" && mentorAreaOptions.length === 0) {
          const { data } = await getFieldValues("mentor_area", "mentorship");
          setMentorAreaOptions(data);
        } else if (filter === "Mentor State" && mentorStateOptions.length === 0) {
          const { data } = await getFieldValues("mentor_state", "mentorship");
          setMentorStateOptions(data);
        } else if (filter === "Medha Area" && medhaAreaOptions.length === 0) {
          const { data } = await getFieldValues("medha_area", "mentorship");
          setMedhaAreaOptions(data);
        } else if (filter === "Program Name" && programNameOptions.length === 0) {
          const { data } = await getFieldValues("program_name", "mentorship");
          setProgramNameOptions(data);
        } else if (filter === "Status" && statusOptions.length === 0) {
          const { data } = await getFieldValues("status", "mentorship");
          setStatusOptions(data);
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

    const handleChange = (filter, value) => {
      setFilterValues((prev) => ({
        ...prev,
        [filter]: value,
      }));
    };

    const handleApply = async () => {
      const searchFields = Object.keys(filterValues);
      const searchValues = Object.values(filterValues);

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
    };

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
                        name={`${f.replace(/ /g, "_").toLowerCase()}_from`}
                        control="datepicker"
                        label={`${f} From`}
                        className="form-control"
                        onChange={(e) => handleChange(f.replace(/ /g, "_").toLowerCase() + "_from", e)}
                      />
                      <Input
                        name={`${f.replace(/ /g, "_").toLowerCase()}_to`}
                        control="datepicker"
                        label={`${f} To`}
                        className="form-control"
                        onChange={(e) => handleChange(f.replace(/ /g, "_").toLowerCase() + "_to", e)}
                      />
                    </DateRangeContainer>
                  );
                case "Mentor Name":
                  return (
                    <Select
                      key={f}
                      options={mentorNameOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("mentor_name", selected?.value)}
                      placeholder="Select Mentor Name..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Mentor Domain":
                  return (
                    <Select
                      key={f}
                      options={mentorDomainOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("mentor_domain", selected?.value)}
                      placeholder="Select Mentor Domain..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Mentor Company Name":
                  return (
                    <Select
                      key={f}
                      options={mentorCompanyOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("mentor_company_name", selected?.value)}
                      placeholder="Select Mentor Company..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Designation":
                  return (
                    <Select
                      key={f}
                      options={designationOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("designation", selected?.value)}
                      placeholder="Select Designation..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Mentor Area":
                  return (
                    <Select
                      key={f}
                      options={mentorAreaOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("mentor_area", selected?.value)}
                      placeholder="Select Mentor Area..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Mentor State":
                  return (
                    <Select
                      key={f}
                      options={mentorStateOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("mentor_state", selected?.value)}
                      placeholder="Select Mentor State..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Medha Area":
                  return (
                    <Select
                      key={f}
                      options={medhaAreaOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("medha_area", selected?.value)}
                      placeholder="Select Medha Area..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Program Name":
                  return (
                    <Select
                      key={f}
                      options={programNameOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("program_name", selected?.value)}
                      placeholder="Select Program Name..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
                        }),
                      }}
                    />
                  );
                case "Status":
                  return (
                    <Select
                      key={f}
                      options={statusOptions.map((opt) => ({
                        label: opt.value,
                        value: opt.value,
                      }))}
                      onChange={(selected) => handleChange("status", selected?.value)}
                      placeholder="Select Status..."
                      isClearable
                      isSearchable
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "300px",
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
                      onChange={(e) => handleChange(f.replace(/ /g, "_").toLowerCase(), e.target.value)}
                    />
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

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisabled(true);
    setIsFieldEmpty(false);
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
        <FilterBox closefilterBox={closefilterBox} clear={clear} />
      )}
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(MentorshipSearchbar);
