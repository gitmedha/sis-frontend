import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../../store/reducers/Operations/actions";
import { getFieldValues } from "../actions";
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

const PmusSearchBar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "pmu", label: "PMU Name" },
    { key: 1, value: "State", label: "State" },
    { key: 2, value: "medha_poc", label: "Medha POC" },
    { key: 3, value: "year", label: "Year" }
  ];

  const [pmuOptions, setPmuOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);

  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisabled] = useState(true);
  let today = new Date();

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_from: new Date(new Date(today).setFullYear(today.getFullYear() - 1)),
    search_by_value_date_to: new Date()
  };

  const validate = Yup.object().shape({
    search_by_value_date_from: Yup.date().required("Start year is required"),
    search_by_value_date_to: Yup.date()
      .required("End year is required")
      .when("search_by_value_date_from", (start, schema) => {
        return schema.min(
          start,
          "End year must be greater than or equal to start year"
        );
      })
  });

  const formatDate = (dateval) => {
    const date = new Date(dateval);
    return date.getFullYear().toString();
  };

  const handleSubmit = async (values) => {
    let baseUrl = "pmuses";

    if (values.search_by_field === "year") {
      const year1 = formatDate(values.search_by_value_date_from);
      const year2 = formatDate(values.search_by_value_date_to);

      let val = {
        start: year1,
        end: year2
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
    } else {
      await searchOperationTab(
        baseUrl,
        values.search_by_field,
        values.search_by_value
      );
  
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

  const clear = async (formik) => {
    formik.resetForm();
    await resetSearch();
    setSelectedSearchField(null);
    setDisabled(true);
  };

  const setSearchItem = (value) => {
    setSelectedSearchField(value);
    setDisabled(false);

    if (value === "pmu") {
      setDropdownValues("pmu");
    } else if (value === "State") {
      setDropdownValues("State");
    } else if (value === "medha_poc") {
      setDropdownValues("medha_poc");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "pmuses");

      if (fieldName === "pmu") {
        setPmuOptions(data);
      } else if (fieldName === "State") {
        setStateOptions(data);
      } else if (fieldName === "medha_poc") {
        setMedhaPocOptions(data);
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

                  {selectedSearchField === "pmu" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={pmuOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "State" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={stateOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "medha_poc" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={medhaPocOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  
                  {selectedSearchField === "year" && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="mr-3">
                        <Input
                          name="search_by_value_date_from"
                          label="From Year"
                          placeholder="Start year"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                          showYearPicker
                          dateFormat="yyyy"
                          yearItemNumber={9}
                          disabled={disabled}
                        />
                      </div>
                      <div className="ml-2">
                        <Input
                          name="search_by_value_date_to"
                          label="To Year"
                          placeholder="End year"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                          showYearPicker
                          dateFormat="yyyy"
                          yearItemNumber={9}
                          disabled={disabled}
                        />
                      </div>
                    </div>
                  )}
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

export default connect(null, { searchOperationTab, resetSearch })(PmusSearchBar);