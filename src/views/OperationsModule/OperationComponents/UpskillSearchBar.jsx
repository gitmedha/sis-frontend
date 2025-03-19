import React, { useState, Fragment } from "react";
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
import { getAllSearchSrm } from "src/utils/function/lookupOptions";
import { FaPlusCircle } from "react-icons/fa";

const Section = styled.div`
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }

  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const UpSkillSearchBar = function UpSkillSearch({
  searchOperationTab,
  resetSearch,
}) {
  let options = [
    { key: 1, value: "assigned_to.username", label: "Assigned to" },
    { key: 3, value: "course_name", label: "Course Name" },
    { key: 6, value: "end_date", label: "End Date" },
    { key: 2, value: "institution.name", label: "Institute Name" },
    { key: 5, value: "start_date", label: "Start Date" },
    { key: 0, value: "student_id.full_name", label: "Student Name" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 7, value: "category", label: "Category" },
  ].sort((a, b) => a.label - b.label);

  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [courseNameOptions, setCourseNameOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedSearchFields, setSelectedSearchFields] = useState([null]); // Track selected fields for each counter
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1); // Counter for dynamic search fields

  let today = new Date();
  const initialValues = {
    searches: [
      {
        search_by_field: "",
        search_by_value: "",
        search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
        search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
        search_by_value_date_end_from: new Date(
          new Date(today).setDate(today.getDate())
        ),
        search_by_value_date_end_to: new Date(
          new Date(today).setDate(today.getDate())
        ),
      },
    ],
  };

  const formatDate = (dateval) => {
    const date = new Date(dateval);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (values) => {
    const baseUrl = "students-upskillings";

    // Initialize arrays for search fields and values
    const searchFields = [];
    const searchValues = [];

    // Loop through each search field and value
    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
      } else if (
        search.search_by_field === "start_date" &&
        search.search_by_value_date &&
        search.search_by_value_date_to
      ) {
        const startDate = formatDate(search.search_by_value_date);
        const endDate = formatDate(search.search_by_value_date_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
      } else if (
        search.search_by_field === "end_date" &&
        search.search_by_value_date_end_from &&
        search.search_by_value_date_end_to
      ) {
        const startDate = formatDate(search.search_by_value_date_end_from);
        const endDate = formatDate(search.search_by_value_date_end_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
      }
    });

    // Construct the payload
    const payload = {
      searchFields,
      searchValues,
    };

    console.log("Payload:", payload); // Log the payload for debugging

    // Submit the payload to the API
    await searchOperationTab(baseUrl, payload);

    // Store the last searched result in local storage as cache
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({
        baseUrl,
        searchData: payload,
      })
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

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <Section>
              <div className="row align-items-center">
                {Array.from({ length: counter }).map((_, index) => (
                  <Fragment key={index}>
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_field`}
                        label="Search Field"
                        control="lookup"
                        options={options}
                        className="form-control"
                        onChange={(e) => setSearchItem(e.value, index)}
                      />
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                      {selectedSearchFields[index] === null && (
                        <Input
                          name={`searches[${index}].search_by_value`}
                          control="input"
                          label="Search Value"
                          className="form-control"
                          disabled
                        />
                      )}

                      {selectedSearchFields[index] === "start_date" && (
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="mr-3">
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
                          <div className="ml-2">
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
                        </div>
                      )}

                      {selectedSearchFields[index] === "end_date" && (
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="mr-3">
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
                          <div className="ml-2">
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
                        </div>
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
                    </div>
                  </Fragment>
                ))}

                <div className="col-lg-3">
                  <FaPlusCircle onClick={() => setCounter(counter + 1)} />
                </div>

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
            </Section>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(
  UpSkillSearchBar
);