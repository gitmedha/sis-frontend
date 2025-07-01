import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getFieldValues } from "../SaModule/actions";
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

const EcosystemSearchBar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "activity_type", label: "Activity Type" },
    { key: 1, value: "topic", label: "Topic" },
    { key: 2, value: "govt_dept_partner_with", label: "Government Department" },
    { key: 3, value: "type_of_partner", label: "Partner Type" },
    { key: 4, value: "medha_poc_1", label: "Medha POC 1" },
    { key: 5, value: "medha_poc_2", label: "Medha POC 2" },
    { key: 6, value: "date_of_activity", label: "Activity Date" }
  ];

  const [activityTypeOptions, setActivityTypeOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [govtDeptOptions, setGovtDeptOptions] = useState([]);
  const [partnerTypeOptions, setPartnerTypeOptions] = useState([]);
  const [medhaPoc1Options, setMedhaPoc1Options] = useState([]);
  const [medhaPoc2Options, setMedhaPoc2Options] = useState([]);

  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisabled] = useState(true);
  let today = new Date();

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    search_by_value_date_from: new Date(new Date(today).setDate(today.getDate())),
    search_by_value_date_to: new Date(new Date(today).setDate(today.getDate()))
  };

  const validate = Yup.object().shape({
    search_by_value_date_from: Yup.date().required("Start date is required"),
    search_by_value_date_to: Yup.date()
      .required("End date is required")
      .when("search_by_value_date_from", (start, schema) => {
        return schema.min(
          start,
          "End date must be greater than or equal to start date"
        );
      })
  });

  const formatDate = (dateval) => {
    const date = new Date(dateval);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (values) => {
    let baseUrl = "ecosystems";

    if (values.search_by_field === "date_of_activity") {
      const date1 = formatDate(values.search_by_value_date_from);
      const date2 = formatDate(values.search_by_value_date_to);

      let val = {
        start: date1,
        end: date2
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

    if (value === "activity_type") {
      setDropdownValues("activity_type");
    } else if (value === "topic") {
      setDropdownValues("topic");
    } else if (value === "govt_dept_partner_with") {
      setDropdownValues("govt_dept_partner_with");
    } else if (value === "type_of_partner") {
      setDropdownValues("type_of_partner");
    } else if (value === "medha_poc_1") {
      setDropdownValues("medha_poc_1");
    } else if (value === "medha_poc_2") {
      setDropdownValues("medha_poc_2");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "ecosystems");

      if (fieldName === "activity_type") {
        setActivityTypeOptions(data);
      } else if (fieldName === "topic") {
        setTopicOptions(data);
      } else if (fieldName === "govt_dept_partner_with") {
        setGovtDeptOptions(data);
      } else if (fieldName === "type_of_partner") {
        setPartnerTypeOptions(data);
      } else if (fieldName === "medha_poc_1") {
        setMedhaPoc1Options(data);
      } else if (fieldName === "medha_poc_2") {
        setMedhaPoc2Options(data);
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

                  {selectedSearchField === "activity_type" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={activityTypeOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "topic" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={topicOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "govt_dept_partner_with" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={govtDeptOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "type_of_partner" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={partnerTypeOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "medha_poc_1" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={medhaPoc1Options}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "medha_poc_2" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={medhaPoc2Options}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  
                  {selectedSearchField === "date_of_activity" && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="mr-3">
                        <Input
                          name="search_by_value_date_from"
                          label="From"
                          placeholder="Start date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                          disabled={disabled}
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

export default connect(null, { searchOperationTab, resetSearch })(EcosystemSearchBar);