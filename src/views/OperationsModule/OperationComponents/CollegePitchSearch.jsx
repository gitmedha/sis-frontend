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

const CollegePitchSearch = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "area", label: "Medha Area" },
    { key: 1, value: "program_name", label: "Program Name" },
  ];

  const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]); // Track selected fields for each counter
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1); // Counter for dynamic search fields

  const initialValues = {
    searches: [
      {
        search_by_field: "",
        search_by_value: "",
      },
    ],
  };

  const handleSubmit = async (values) => {
    const baseUrl = "college-pitches";

    // Initialize arrays for search fields and values
    const searchFields = [];
    const searchValues = [];

    // Loop through each search field and value
    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
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

    if (value === "area") {
      setDropdownValues("area", index);
    } else if (value === "program_name") {
      setDropdownValues("program_name", index);
    }
  };

  const setDropdownValues = async (fieldName, index) => {
    try {
      const { data } = await getFieldValues(fieldName, "college-pitches");

      if (fieldName === "area") {
        setMedhaAreaOptions(data);
      } else if (fieldName === "program_name") {
        setProgramOptions(data);
      }
    } catch (error) {
      console.error("error", error);
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

                      {selectedSearchFields[index] === "area" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={medhaAreaOptions}
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
  CollegePitchSearch
);