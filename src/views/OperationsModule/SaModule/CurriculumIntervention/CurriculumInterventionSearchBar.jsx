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

const CurriculumInterventionSearchBar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "module_created_for", label: "Module Created For" },
    { key: 1, value: "module_developed_revised", label: "Module Developed / Revised" },
    { key: 2, value: "govt_dept_partnered_with", label: "Govt. Department Partnered With" },
    { key: 3, value: "medha_poc", label: "Medha POC" },
    { key: 4, value: "assigned_to", label: "Assigned To" },
    { key: 5, value: "created_by", label: "Created By" },
    { key: 6, value: "updated_by", label: "Updated By" },
    { key: 7, value: "start_date", label: "Start Date" },
    { key: 8, value: "end_date", label: "End Date" },
    { key: 9, value: "created_at", label: "Created At" },
    { key: 10, value: "updated_at", label: "Updated At" },
    { key: 11, value: "module_name", label: "Module Name" },
  ];

  const [moduleCreatedForOptions, setModuleCreatedForOptions] = useState([]);
  const [moduleDevelopedRevisedOptions, setModuleDevelopedRevisedOptions] = useState([]);
  const [govtDeptPartneredWithOptions, setGovtDeptPartneredWithOptions] = useState([]);
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [updatedByOptions, setUpdatedByOptions] = useState([]);

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
    let baseUrl = "curricula";

    if (["start_date", "end_date", "created_at", "updated_at"].includes(values.search_by_field)) {
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

    if (value === "module_created_for") {
      setDropdownValues("module_created_for");
    } else if (value === "module_developed_revised") {
      setDropdownValues("module_developed_revised");
    } else if (value === "govt_dept_partnered_with") {
      setDropdownValues("govt_dept_partnered_with");
    } else if (value === "medha_poc") {
      setDropdownValues("medha_poc");
    } else if (value === "assigned_to") {
      setDropdownValues("assigned_to");
    } else if (value === "created_by") {
      setDropdownValues("created_by");
    } else if (value === "updated_by") {
      setDropdownValues("updated_by");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "curricula");

      if (fieldName === "module_created_for") {
        setModuleCreatedForOptions(data);
      } else if (fieldName === "module_developed_revised") {
        setModuleDevelopedRevisedOptions(data);
      } else if (fieldName === "govt_dept_partnered_with") {
        setGovtDeptPartneredWithOptions(data);
      } else if (fieldName === "medha_poc") {
        setMedhaPocOptions(data);
      } else if (fieldName === "assigned_to") {
        setAssignedToOptions(data);
      } else if (fieldName === "created_by") {
        setCreatedByOptions(data);
      } else if (fieldName === "updated_by") {
        setUpdatedByOptions(data);
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

                  {selectedSearchField === "module_created_for" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={moduleCreatedForOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "module_developed_revised" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={moduleDevelopedRevisedOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "govt_dept_partnered_with" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={govtDeptPartneredWithOptions}
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
                  {selectedSearchField === "assigned_to" && (
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
                  {selectedSearchField === "created_by" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={createdByOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  {selectedSearchField === "updated_by" && (
                    <Input
                      icon="down"
                      name="search_by_value"
                      label="Search Value"
                      control="lookup"
                      options={updatedByOptions}
                      className="form-control"
                      disabled={disabled}
                    />
                  )}
                  
                  {["start_date", "end_date", "created_at", "updated_at"].includes(selectedSearchField) && (
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

                  {selectedSearchField === "module_name" && (
                    <Input
                      name="search_by_value"
                      control="input"
                      label="Search Value"
                      className="form-control"
                      disabled={disabled}
                    />
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

export default connect(null, { searchOperationTab, resetSearch })(CurriculumInterventionSearchBar); 