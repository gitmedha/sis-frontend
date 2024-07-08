import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../../utils/Form";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../../store/reducers/Operations/actions";
import { getFieldValues } from "../operationsActions";
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
const MentorshipSearchbar = ({ searchOperationTab, resetSearch }) => {
 let options = [
    { key: 0, value: "mentor_name", label: "Mentor Name" },
    { key: 1, value: "mentor_domain", label: "Mentor Domain" },
    { key: 2, value: "mentor_company_name", label: "Mentor Company Name" },
    { key: 3, value: "designation", label: "Designation" },
    { key: 4, value: "mentor_area", label: "Mentor Area" },
    { key: 5, value: "mentor_state", label: "Mentor State" },
    { key: 6, value: "outreach", label: "Outreach" },
    { key: 7, value: "onboarding_date", label: "Onboarding Date" },
    { key: 8, value: "medha_area", label: "Medha Area" },
    { key: 9, value: "program_name", label: "Program Name" },
     { key: 10, value: "status", label: "Status" }
];


  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [phoneOptions, setPhoneOptions] = useState([]);
  const [studentIdOptions, setStudentIdOptions] = useState([]);
  const [emailOptions, setEmailOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisbaled] = useState(true);
  const [statusOptions] = useState([
    { key: 2, value: "Closed", label: "Closed" },
    { key: 1, value: "Open", label: "Open" },
    { key: 0, value: "Resolved", label: "Resolved" },
  ]);

  const setSearchItem = (value) => {
    setSelectedSearchField(value);
    setDisbaled(false);

    if (value === "mentor_state") {

      setDropdownValues(value);
    } 
    if (value === "mentor_area") {

      setDropdownValues(value);
    } 
  };
  const setDropdownValues = async (fieldName) => {
    try {
      console.log(fieldName);
      const { data } = await getFieldValues(fieldName, "mentorship");

      if (fieldName === "mentor_state") {
        console.log(data);
      }
      if (fieldName === "mentor_area") {
        console.log(data);
      }
      
    } catch (error) {
      console.error("error", error);
    }
  };

  let today = new Date();
  const initialValues = {
    search_by_field: "",
    search_by_value: "",
    // search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
    // search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
    // search_by_value_date_end_from: new Date(
    //   new Date(today).setDate(today.getDate())
    // ),
    // search_by_value_date_end_to: new Date(
    //   new Date(today).setDate(today.getDate())
    // ),
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
     
      let baseUrl = "alumni-queries";
      await searchOperationTab(
        baseUrl,
        values.search_by_field,
        values.search_by_value
      );

      //stores the last searched result in the local storage as cache
      //we will use it to refresh the search results

      let value=await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({
          baseUrl: baseUrl,
          searchedProp: values.search_by_field,
          searchValue: values.search_by_value,
        })
      );
    
    console.log(value);
  };
  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisbaled(true);
  };

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        // validationSchema={validate}
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
  {selectedSearchField === "mentor_name" && (
    <Input
      icon="down"
      name="search_by_value"
      label="Search Value"
      control="input"
      className="form-control"
      disabled={disabled ? true : false}
    />
  )}
  {selectedSearchField === "medha_area" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "status" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "mentor_domain" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "mentor_company_name" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "designation" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "mentor_area" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    onChange={(e) => setSearchItem(e.value)}
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "mentor_state" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    onChange={(e) => setSearchItem(e.value)}
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "outreach" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "program_name" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
  {selectedSearchField === "onboarding_date" && (
    <Input
    icon="down"
    name="search_by_value"
    label="Search Value"
    control="input"
    className="form-control"
    disabled={disabled ? true : false}
  />
  )}
 
 
</div>

                <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-around align-items-center">
                  <button
                    className="btn btn-secondary action_button_sec search_bar_action_sec"
                    type="button"
                    onClick={() => clear(formik)}
                    disabled={disabled ? true : false}
                  >
                    CLEAR
                  </button>
                  <button
                    className="btn btn-primary action_button_sec search_bar_action_sec"
                    type="submit"
                    disabled={disabled ? true : false}
                  >
                    FIND
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
  MentorshipSearchbar
);


