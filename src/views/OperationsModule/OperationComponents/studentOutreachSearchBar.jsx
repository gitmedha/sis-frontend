import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
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

const StudentOutreachSearchBar = ({ searchOperationTab, resetSearch }) => {
  // Define the search field options
  const options = [{ key: 1, value: "state", label: "State" }];

  // Define the state options
  const [stateOptions] = useState([
    { value: "Bihar", label: "Bihar" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Haryana", label: "Haryana" },
  ]);

  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisabled] = useState(true);

  // Initial form values
  const initialValues = {
    search_by_field: "",
    search_by_value: "",
  };

  // Form validation schema
  const validate = Yup.object().shape({
    search_by_value: Yup.string().required("Search value is required"),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    const baseUrl = "student-outreaches"; // Update the base URL for student outreach
  
    // Extract search field and value from form values
    const searchField = values.search_by_field; // e.g., "state"
    const searchValue = values.search_by_value; // e.g., "Bihar"
  
    // Construct the payload as expected by the backend
    const payload = {
      searchField, // Top-level field
      searchValue, // Top-level field
    };
  
    console.log("Payload:", payload); // Log the payload for debugging
  
    // Submit the payload to the API
    await searchOperationTab(baseUrl, payload);
  
    // Store the last searched result in local storage as cache
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({
        baseUrl,
        searchedProp: searchField, // e.g., "state"
        searchValue: searchValue, // e.g., "Bihar"
      })
    );
  };

  // Clear the form and reset search
  const clear = async (formik) => {
    // Reset form without validation
    formik.resetForm({
      values: initialValues, // Reset to initial values
    });
    
    // Manually reset local state
    setSelectedSearchField(null);
    setDisabled(true);
    
    // Reset search results
    await resetSearch();
  };

  // Set the selected search field
  const setSearchItem = (value) => {
    setSelectedSearchField(value);
    setDisabled(false);
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
                {/* Search Field Dropdown */}
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

                {/* Search Value Dropdown */}
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                  <Input
                    icon="down"
                    name="search_by_value"
                    label="Search Value"
                    control="lookup"
                    options={selectedSearchField === "state" ? stateOptions : []} // Show states only if "State" is selected
                    className="form-control"
                    disabled={disabled}
                  />
                </div>

                {/* Action Buttons */}
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
  StudentOutreachSearchBar
);