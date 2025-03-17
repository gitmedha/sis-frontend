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

const TotSearchBar = ({ searchOperationTab, resetSearch }) => {
  const options = [
    { key: 0, value: "city", label: "City" },
    { key: 1, value: "project_name", label: "Project Name" },
    { key: 2, value: "partner_dept", label: "Project Department" },
    { key: 6, value: "state", label: "State" },
    { key: 3, value: "project_type", label: "Project Type" },
    { key: 4, value: "trainer_1.username", label: "Trainer 1" },
    { key: 5, value: "trainer_2.username", label: "Trainer 2" },
    { key: 6, value: "start_date", label: "Start Date" },
    { key: 7, value: "end_date", label: "End Date" },
  ];

  const [cityOptions, setCityOptions] = useState([]);
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [partnerDeptOptions, setParnterDeptOptions] = useState([]);
  const [trainerOneOptions, setTrainerOneOptions] = useState([]);
  const [trainerTwoOptions, setTrainerTwoOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]); // Array to track selected fields for each counter
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1); // Counter for dynamic search fields

  const projectTypeOptions = [
    { key: 0, label: "External", value: "External" },
    { key: 1, label: "Internal", value: "Internal" },
  ];

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

  const validate = Yup.object().shape({
    searches: Yup.array().of(
      Yup.object().shape({
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
  
    // Initialize arrays to store search fields and values
    const searchFields = [];
    const searchValues = [];
  
    // Loop through each search field and value
    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        // Push the field name and value into their respective arrays
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
      } else if (
        search.search_by_field === "start_date" &&
        search.search_by_value_date &&
        search.search_by_value_date_to
      ) {
        // Handle date range for "start_date"
        const startDate = formatDate(search.search_by_value_date);
        const endDate = formatDate(search.search_by_value_date_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
      } else if (
        search.search_by_field === "end_date" &&
        search.search_by_value_date_end_from &&
        search.search_by_value_date_end_to
      ) {
        // Handle date range for "end_date"
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

    if (value === "city") {
      setDropdownValues("city");
    } else if (value === "project_name") {
      setDropdownValues("project_name");
    } else if (value === "partner_dept") {
      setDropdownValues("partner_dept");
    } else if (value === "trainer_1.username") {
      setDropdownValues("trainer_1.username");
    } else if (value === "trainer_2.username") {
      setDropdownValues("trainer_2.username");
    } else if (value === "state") {
      setDropdownValues("state");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "users-tots");

      if (fieldName === "city") {
        setCityOptions(data);
      } else if (fieldName === "project_name") {
        setProjectNameOptions(data);
      } else if (fieldName === "partner_dept") {
        setParnterDeptOptions(data);
      } else if (fieldName === "trainer_1.username") {
        setTrainerOneOptions(data);
      } else if (fieldName === "trainer_2.username") {
        setTrainerTwoOptions(data);
      } else if (fieldName === "state") {
        setStateOptions(data);
      }
    } catch (error) {
      console.error(error);
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

                      {selectedSearchFields[index] === "city" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={cityOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "project_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={projectNameOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "partner_dept" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={partnerDeptOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "project_type" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={projectTypeOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "trainer_1.username" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={trainerOneOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "trainer_2.username" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={trainerTwoOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "state" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={stateOptions}
                          className="form-control"
                          disabled={disabled}
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

export default connect(null, { searchOperationTab, resetSearch })(TotSearchBar);