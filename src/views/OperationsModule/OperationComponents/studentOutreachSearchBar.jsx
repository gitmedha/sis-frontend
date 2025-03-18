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
import * as Yup from "yup";


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
const studentOutreachSearchBar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "fy_year", label: "Finacial Year" },
    { key: 1, value: "quarter", label: "Quarter" },
    { key: 2, value: "category", label: "Category" },
    { key: 6, value: "state", label: "State" },
    { key: 3, value: "department", label: "Department" },
  ];

  const [fyYear, setfyYear] = useState([]);
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [partnerDeptOptions, setParnterDeptOptions] = useState([]);

  const [projectTypeOptions] = useState([
    {
      key: 0,
      label: "External",
      value: "External",
    },
    {
      key: 1,
      label: "Internal",
      value: "Internal",
    },
  ]);

  const [trainerOneOptions, setTrainerOneOptions] = useState([]);
  const [trainerTwoOptions, setTrainerTwoOptions] = useState([]);
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [disabled, setDisbaled] = useState(true);
  let today = new Date();

  const initialValues = {
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
  };

  const validate = Yup.object().shape({
      search_by_value_date: Yup.date().required("Start date is required"),
      search_by_value_date_to: Yup.date()
        .required("End date is required")
        .when("search_by_value_date", (start, schema) => {
          return schema.min(
            start,
            "End date must be greater than or equal to start date"
          );
        }),
      search_by_value_date_end_from: Yup.date().required(
        "Start date is required"
      ),
      search_by_value_date_end_to: Yup.date()
        .required("End date is required")
        .when("search_by_value_date_end_from", (start, schema) => {
          return schema.min(
            start,
            "End date must be greater than or equal to start date"
          );
        }),
    });

    const formatdate = (dateval) => {
      const date = new Date(dateval);
  
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
      const dd = String(date.getDate()).padStart(2, "0");
  
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      return formattedDate;
    };

  const handleSubmit = async (values) => {
    let baseUrl = "users-tots";

    if (values.search_by_field === "start_date") {
      const date1 = formatdate(values.search_by_value_date);
      const date2 = formatdate(values.search_by_value_date_to);

      let val = {
          start: date1,
          end: date2,
        };
        await searchOperationTab(
          baseUrl,
          values.search_by_field,
          val
        );

        await localStorage.setItem(
          "prevSearchedPropsAndValues",
          JSON.stringify({
            baseUrl: baseUrl,
            searchedProp: values.search_by_field,
            searchValue: val,
          })
        );

    }
    else if (values.search_by_field === "end_date") {
      const date1 = formatdate(values.search_by_value_date_end_from);
      const date2 = formatdate(values.search_by_value_date_end_to);
      let val = {
        start: date1,
        end: date2,
      };
      await searchOperationTab(
        baseUrl,
        values.search_by_field,
        val
      );
      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({
          baseUrl: baseUrl,
          searchedProp: values.search_by_field,
          searchValue: val,
        })
      );
    }
    else {
      await searchOperationTab(
        baseUrl,
        values.search_by_field,
        values.search_by_value
      );
  
      //stores the last searched result in the local storage as cache
      //we will use it to refresh the search results
  
      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({
          baseUrl: baseUrl,
          searchedProp: values.search_by_field,
          searchValue: values.search_by_value,
        })
      );

    }
    
  };
  const formik = useFormik({
    // Create a Formik reference using useFormik
    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisbaled(true);
  };

  const setSearchItem = (value) => {
    setSelectedSearchField(value);
    setDisbaled(false);

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

      if (fieldName === "fy_year") {
        setfyYear(data);
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
                <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                  <Input
                    icon="down"
                    name="search_by_field"
                    label="Search Field"
                    control="lookup"
                    options={options}
                    className="form-control"
                    onChange={(e) => setSearchItem(e.value)}
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  {selectedSearchField === null && (
                    <Input
                      name="search_by_value"
                      control="input"
                      label="Search Value"
                      className="form-control"
                      disabled={true}
                    />
                  )}

                  {selectedSearchField === "fy_year" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={cityOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "project_name" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={projectNameOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "partner_dept" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={partnerDeptOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "project_type" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={projectTypeOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "trainer_1.username" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={trainerOneOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "trainer_2.username" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={trainerTwoOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  {selectedSearchField === "state" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={stateOptions}
                      className="form-control"
                      disabled={disabled ? true : false}
                    />
                  )}
                  
                                    {selectedSearchField === "start_date" && (
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="mr-3">
                                          <Input
                                            name="search_by_value_date"
                                            label="From"
                                            placeholder="Start date"
                                            control="datepicker"
                                            className="form-control "
                                            autoComplete="off"
                                            disabled={disabled ? true : false}
                                          />
                                        </div>
                                        <div className="ml-2">
                                          <Input
                                            name="search_by_value_date_to"
                                            label="To"
                                            placeholder="End date"
                                            control="datepicker"
                                            className="form-control"
                                            autoComplete="off"
                                            disabled={disabled ? true : false}
                                          />
                                        </div>
                                      </div>
                                    )}
                  
                                    {selectedSearchField === "end_date" && (
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div className="mr-3">
                                          <Input
                                            name="search_by_value_date_end_from"
                                            label="From"
                                            placeholder="Start date"
                                            control="datepicker"
                                            className="form-control "
                                            autoComplete="off"
                                            disabled={disabled ? true : false}
                                          />
                                        </div>
                                        <div className="ml-2">
                                          <Input
                                            name="search_by_value_date_end_to"
                                            label="To"
                                            placeholder="End date"
                                            control="datepicker"
                                            className="form-control"
                                            autoComplete="off"
                                            disabled={disabled ? true : false}
                                          />
                                        </div>
                                      </div>
                                    )}
                      
                </div>

                <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center search_buttons_container">
                  <button
                    className="btn btn-primary action_button_sec search_bar_action_sec"
                    type="submit"
                    disabled={disabled ? true : false}
                  >
                    FIND
                  </button>
                  <button
                    className="btn btn-secondary action_button_sec search_bar_action_sec"
                    type="button"
                    onClick={() => clear(formik)}
                    disabled={disabled ? true : false}
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
