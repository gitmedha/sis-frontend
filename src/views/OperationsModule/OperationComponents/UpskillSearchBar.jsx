import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getFieldValues } from "./operationsActions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { getAllSearchSrm } from "src/utils/function/lookupOptions";

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

const UpskillSearchBar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 1, value: "assigned_to.username", label: "Assigned to" },
    { key: 3, value: "course_name", label: "Course Name" },
    { key: 6, value: "end_date", label: "End Date" },
    { key: 2, value: "institution.name", label: "Institute Name" },
    { key: 5, value: "start_date", label: "Start Date" },
    { key: 0, value: "student_id.full_name", label: "Student Name" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 7, value: "category", label: "Category" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [courseNameOptions, setCourseNameOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);

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

  const handleSubmit = async (values) => {
    const baseUrl = "students-upskillings";
    const searchFields = [];
    const searchValues = [];

    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
      }
    });

    const searchData = { searchFields, searchValues };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchFields([null]);
    setDisabled(true);
    setCounter(1);
    setIsFieldEmpty(false);
  };

  const setSearchItem = (value, index) => {
    const newSelectedSearchFields = [...selectedSearchFields];
    newSelectedSearchFields[index] = value;
    setSelectedSearchFields(newSelectedSearchFields);
    setDisabled(false);
    setIsFieldEmpty(false);

    if (value === "student_id.full_name") {
      setDropdownValues("student_id", index);
    } else if (value === "assigned_to.username") {
      setDropdownValues("assigned_to", index);
    } else if (value === "institution.name") {
      setDropdownValues("institution", index);
    } else if (value === "course_name") {
      setDropdownValues("course_name", index);
    } else if (value === "program_name") {
      setDropdownValues("program_name", index);
    } else if (value === "category") {
      setDropdownValues("category", index);
    }
  };

  const setDropdownValues = async (fieldName, index) => {
    try {
      const { data } = await getFieldValues(fieldName, "students-upskillings");

      if (fieldName === "student_id") {
        setStudentNameOptions(data);
      } else if (fieldName === "assigned_to") {
        let newSRM = await getAllSearchSrm();
        setAssignedToOptions(newSRM);
      } else if (fieldName === "institution") {
        setInstitutionOptions(data);
      } else if (fieldName === "course_name") {
        setCourseNameOptions(data);
      } else if (fieldName === "program_name") {
        setProgramOptions(data);
      } else if (fieldName === "category") {
        setCategoryOptions(data);
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

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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

                  <div className="col-lg-3 col-md-4 col-sm-6">
                    <SearchValueContainer>
                      {selectedSearchFields[index] === null && (
                        <Input
                          name={`searches[${index}].search_by_value`}
                          control="input"
                          label="Search Value"
                          className="form-control"
                          onClick={() => setIsFieldEmpty(true)}
                          disabled
                        />
                      )}

                      {selectedSearchFields[index] === "student_id.full_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={studentNameOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "assigned_to.username" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={assignedToOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "institution.name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={institutionOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "course_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={courseNameOptions}
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

                      {selectedSearchFields[index] === "category" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={categoryOptions}
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

                  {index === counter - 1 && (
                    <IconContainer>
                      <FaPlusCircle onClick={addSearchRow} title="Add Search Row" />
                      {counter > 1 && <FaMinusCircle onClick={removeSearchRow} title="Remove Search Row" />}
                    </IconContainer>
                  )}
                </SearchRow>
              ))}

              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center search_buttons_container">
                  <button
                    className="btn btn-primary action_button_sec search_bar_action_sec"
                    type="submit"
                    disabled={disabled}
                  >
                    FIND
                  </button>
                  <button
                    className="btn btn-secondary action_button_sec search_bar_action_sec"
                    type="button"
                    onClick={() => clear(formik)}
                    disabled={disabled}
                  >
                    CLEAR
                  </button>
                </div>
              </div>

              {isFieldEmpty && (
                <div className="row">
                  <div className="col-lg-2 col-md-4 col-sm-12 mb-2"></div>
                  <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                    <p style={{ color: "red" }}>Please select any field first.</p>
                  </div>
                </div>
              )}
            </Section>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(UpskillSearchBar);