import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getFieldValues } from "./operationsActions";
import * as Yup from "yup";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import Select from "react-select";
import Modal from 'react-bootstrap/Modal';
import { getAllSearchSrm } from "src/utils/function/lookupOptions";
import FilterBox from "./TotSearchBarFilterBox";

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

  .chip:hover { background: #e2e6ea; }
  .chip.active { background: #21867a; border-color: #21867a; color: #fff; }

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

  .btn { min-width: 80px; height: 36px; border-radius: 6px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s ease; }
  .btn.apply { background: #21867a; color: white; }
  .btn.apply:hover { background: #18645a; }
  .btn.clear { background: #6c757d; color: white; }
  .btn.clear:hover { background: #565e64; }
`;

const SearchButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px;
`;

const TotSearchBar = ({ searchOperationTab, resetSearch }) => {
  const options = [
    { key: 0, value: "city", label: "City" },
    { key: 1, value: "project_name", label: "Project Name" },
    { key: 2, value: "partner_dept", label: "Project Department" },
    { key: 3, value: "state", label: "State" },
    { key: 4, value: "project_type", label: "Project Type" },
    { key: 5, value: "trainer_1.username", label: "Facilitator 1" },
    { key: 6, value: "trainer_2.username", label: "Facilitator 2" },
    { key: 7, value: "start_date", label: "Start Date" },
    { key: 8, value: "end_date", label: "End Date" },
    { key: 9, value: "gender", label: "Gender" },
    { key: 10, value: "user_name", label: "Participant Name" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [cityOptions, setCityOptions] = useState([]);
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [partnerDeptOptions, setPartnerDeptOptions] = useState([]);
  const [trainerOneOptions, setTrainerOneOptions] = useState([]);
  const [trainerTwoOptions, setTrainerTwoOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1);
  const [onefilter, setOnefilter] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [persistentFilterValues, setPersistentFilterValues] = useState({});
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false);
  const [appliedFiltersSummary, setAppliedFiltersSummary] = useState("");

  const projectTypeOptions = [
    { key: 0, label: "External", value: "External" },
    { key: 1, label: "Internal", value: "Internal" },
  ];

  let today = new Date();
  const initialValues = {
    searches: [{
      search_by_field: "",
      search_by_value: "",
      search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
      search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
      search_by_value_date_end_from: new Date(new Date(today).setDate(today.getDate())),
      search_by_value_date_end_to: new Date(new Date(today).setDate(today.getDate())),
    }],
  };

  const validate = Yup.object().shape({
    searches: Yup.array().of(
      Yup.object().shape({
        search_by_field: Yup.string().required("Field is required"),
        search_by_value: Yup.mixed().when("search_by_field", {
          is: (field) => !["start_date", "end_date"].includes(field),
          then: Yup.mixed().required("Value is required")
        }),
        search_by_value_date: Yup.date().when("search_by_field", {
          is: "start_date",
          then: Yup.date().required("Start date is required"),
        }),
        search_by_value_date_to: Yup.date().when("search_by_field", {
          is: "start_date",
          then: Yup.date()
            .required("End date is required")
            .when("search_by_value_date", (start, schema) => {
              return schema.min(
                start,
                "End date must be greater than or equal to start date"
              );
            }),
        }),
        search_by_value_date_end_from: Yup.date().when("search_by_field", {
          is: "end_date",
          then: Yup.date().required("Start date is required"),
        }),
        search_by_value_date_end_to: Yup.date().when("search_by_field", {
          is: "end_date",
          then: Yup.date()
            .required("End date is required")
            .when("search_by_value_date_end_from", (start, schema) => {
              return schema.min(
                start,
                "End date must be greater than or equal to start date"
              );
            }),
        }),
      })
    ),
  });

  const formatDate = (dateVal) => {
    const date = new Date(dateVal);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (values) => {
    const baseUrl = "users-tots";
    const searchFields = [];
    const searchValues = [];
    const appliedList = [];

    const fieldLabelMap = options.reduce((acc, cur) => {
      acc[cur.value] = cur.label;
      return acc;
    }, {});

    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
        appliedList.push({ label: fieldLabelMap[search.search_by_field] || search.search_by_field, value: search.search_by_value });
      } else if (
        search.search_by_field === "start_date" &&
        search.search_by_value_date &&
        search.search_by_value_date_to
      ) {
        const startDate = formatDate(search.search_by_value_date);
        const endDate = formatDate(search.search_by_value_date_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
        appliedList.push({ label: fieldLabelMap[search.search_by_field] || "Start Date", value: `${startDate} - ${endDate}` });
      } else if (
        search.search_by_field === "end_date" &&
        search.search_by_value_date_end_from &&
        search.search_by_value_date_end_to
      ) {
        const startDate = formatDate(search.search_by_value_date_end_from);
        const endDate = formatDate(search.search_by_value_date_end_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
        appliedList.push({ label: fieldLabelMap[search.search_by_field] || "End Date", value: `${startDate} - ${endDate}` });
      }
    });

    const payload = { searchFields, searchValues };
    await searchOperationTab(baseUrl, payload);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData: payload })
    );
    // Do not show applied filters for single-filter submissions
    setAppliedFilters([]);
    setShowAppliedFilterMessage(false);
  };

  const clear = async (formik) => {
    formik.resetForm();
    await resetSearch();
    setSelectedSearchFields([null]);
    setDisabled(true);
    setCounter(1);
    setAppliedFilters([]);
    setShowAppliedFilterMessage(false);
    setAppliedFiltersSummary("");
    setPersistentFilterValues({});
    const baseUrl = "users-tots";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const closefilterBox = () => {
    setOnefilter(true);
  };

  const clearModalFiltersAndClose = async () => {
    setPersistentFilterValues({});
    setAppliedFilters([]);
    setShowAppliedFilterMessage(false);
    setAppliedFiltersSummary("");
    const baseUrl = "users-tots";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
    closefilterBox();
  };

  const filters = [
    "City",
    "Project Name", 
    "Project Department",
    "State",
    "Project Type",
    "Facilitator 1",
    "Facilitator 2",
    "Start Date",
    "End Date",
    "Gender",
    "Participant Name",
  ];

  const setSearchItem = (value, index) => {
    const newSelectedSearchFields = [...selectedSearchFields];
    newSelectedSearchFields[index] = value;
    setSelectedSearchFields(newSelectedSearchFields);
    setDisabled(false);

    if (["city", "project_name", "partner_dept", "trainer_1.username",
      "trainer_2.username", "state", "gender", "user_name"].includes(value)) {
      setDropdownValues(value);
    }
    else if (value === "gender") {
      setDropdownValues("gender");
    }
    else if (value === "user_name") {
      setDropdownValues("user_name");
    }

  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "users-tots");

      const setters = {
        city: setCityOptions,
        project_name: setProjectNameOptions,
        partner_dept: setPartnerDeptOptions,
        "trainer_1.username": setTrainerOneOptions,
        "trainer_2.username": setTrainerTwoOptions,
        state: setStateOptions,
        gender: setGenderOptions,
        user_name: setUserOptions,
      };

      if (setters[fieldName]) {
        setters[fieldName](data);
      }
    } catch (error) {
      console.error(error);
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

  const getOptionsForField = (field) => {
    switch (field) {
      case "city": return cityOptions;
      case "project_name": return projectNameOptions;
      case "partner_dept": return partnerDeptOptions;
      case "project_type": return projectTypeOptions;
      case "trainer_1.username": return trainerOneOptions;
      case "trainer_2.username": return trainerTwoOptions;
      case "state": return stateOptions;
      case "gender": return genderOptions;
      case "user_name": return userOptions;
      default: return [];
    }
  };

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validate}
      >
        {(formik) => (
          <Form>
            <Section>
              {Array.from({ length: counter }).map((_, index) => (
                <SearchRow key={index}>
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

                  <div className="col-lg-4 col-md-6 col-sm-6">
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

                      {selectedSearchFields[index] &&
                        !["start_date", "end_date"].includes(selectedSearchFields[index]) && (
                          <Input
                            icon={["city", "project_name", "partner_dept", "trainer_1.username",
                              "trainer_2.username", "state", "gender", "user_name"].includes(selectedSearchFields[index]) ? "down" : undefined}
                            name={`searches[${index}].search_by_value`}
                            label="Search Value"
                            control={getOptionsForField(selectedSearchFields[index]).length > 0 ? "lookup" : "input"}
                            options={getOptionsForField(selectedSearchFields[index])}
                            className="form-control"
                            disabled={disabled}
                          />
                        )}

                      {selectedSearchFields[index] === "start_date" && (
                        <DateRangeContainer>
                          <div>
                            <Input
                              name={`searches[${index}].search_by_value_date`}
                              label="From"
                              placeholder="Start Date"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Input
                              name={`searches[${index}].search_by_value_date_to`}
                              label="To"
                              placeholder="End Date"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              disabled={disabled}
                            />
                          </div>
                        </DateRangeContainer>
                      )}

                      {selectedSearchFields[index] === "end_date" && (
                        <DateRangeContainer>
                          <div>
                            <Input
                              name={`searches[${index}].search_by_value_date_end_from`}
                              label="From"
                              placeholder="Start Date"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <Input
                              name={`searches[${index}].search_by_value_date_end_to`}
                              label="To"
                              placeholder="End Date"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              disabled={disabled}
                            />
                          </div>
                        </DateRangeContainer>
                      )}
                    </SearchValueContainer>
                  </div>

                  {/* Icons removed for cleaner UI */}
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
                >
                  CLEAR
                </button>
              </SearchButtonContainer>
                </SearchRow>
              ))}

              

              {/* Applied Filters Summary */}
              {/* {showAppliedFilterMessage && appliedFiltersSummary && (
                <div className="row" style={{ marginBottom: '15px' }}>
                  <div className="col-12">
                    <div style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#e8f5e8', 
                      border: '1px solid #21867a', 
                      borderRadius: '6px',
                      color: '#21867a',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {appliedFiltersSummary}
                    </div>
                  </div>
                </div>
              )} */}
            </Section>
            {!onefilter && (
              <FilterBox 
                initialFilterValues={(() => {
                  const mapped = { ...persistentFilterValues };
                  const labelMap = {
                    "city": "City",
                    "project_name": "Project Name",
                    "partner_dept": "Project Department", 
                    "state": "State",
                    "project_type": "Project Type",
                    "trainer_1.username": "Facilitator 1",
                    "trainer_2.username": "Facilitator 2",
                    "start_date": "Start Date",
                    "end_date": "End Date",
                    "gender": "Gender",
                    "user_name": "Participant Name",
                  };
                  (formik.values.searches || []).forEach((s) => {
                    if (!s || !s.search_by_field) return;
                    const key = labelMap[s.search_by_field];
                    if (!key) return;
                    if (s.search_by_field === "start_date") {
                      if (s.search_by_value_date) mapped["Start Date From"] = new Date(s.search_by_value_date);
                      if (s.search_by_value_date_to) mapped["Start Date To"] = new Date(s.search_by_value_date_to);
                    } else if (s.search_by_field === "end_date") {
                      if (s.search_by_value_date_end_from) mapped["End Date From"] = new Date(s.search_by_value_date_end_from);
                      if (s.search_by_value_date_end_to) mapped["End Date To"] = new Date(s.search_by_value_date_end_to);
                    } else if (s.search_by_value) {
                      mapped[key] = s.search_by_value;
                    }
                  });
                  return mapped;
                })()}
                closefilterBox={closefilterBox}
                clearModalFiltersAndClose={clearModalFiltersAndClose}
                searchOperationTab={searchOperationTab}
                setPersistentFilterValues={setPersistentFilterValues}
                setAppliedFilters={setAppliedFilters}
                setAppliedFiltersSummary={setAppliedFiltersSummary}
                setShowAppliedFilterMessage={setShowAppliedFilterMessage}
                appliedFilters={appliedFilters}
              />
            )}
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(TotSearchBar);