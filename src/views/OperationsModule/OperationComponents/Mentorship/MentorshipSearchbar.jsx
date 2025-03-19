import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../../store/reducers/Operations/actions";
import { getFieldValues } from "../operationsActions";
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

const MentorshipSearchbar = ({ searchOperationTab, resetSearch }) => {
  let options = [
    { key: 0, value: "mentor_name", label: "Mentor Name" },
    { key: 1, value: "mentor_domain", label: "Mentor Domain" },
    { key: 2, value: "mentor_company_name", label: "Mentor Company Name" },
    { key: 3, value: "designation", label: "Designation" },
    { key: 4, value: "mentor_area", label: "Mentor Area" },
    { key: 5, value: "mentor_state", label: "Mentor State" },
    { key: 8, value: "medha_area", label: "Medha Area" },
    { key: 9, value: "program_name", label: "Program Name" },
    { key: 10, value: "status", label: "Status" },
  ];

  const [mentorNameOption, setMentorNameOption] = useState([]);
  const [areaOption, setAreaOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [mentorDomain, setMentorDomain] = useState([]);
  const [mentorCompanyName, setMentorCompanyName] = useState([]);
  const [designationOption, setDesignation] = useState([]);
  const [medhaArea, setMedhaArea] = useState([]);
  const [programName, setProgramName] = useState([]);
  const [status, setStatus] = useState([]);

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
    const baseUrl = "mentorships";

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

    if (value === "mentor_name") {
      setDropdownValues("mentor_name", index);
    } else if (value === "mentor_domain") {
      setDropdownValues("mentor_domain", index);
    } else if (value === "mentor_company_name") {
      setDropdownValues("mentor_company_name", index);
    } else if (value === "designation") {
      setDropdownValues("designation", index);
    } else if (value === "mentor_area") {
      setDropdownValues("mentor_area", index);
    } else if (value === "mentor_state") {
      setDropdownValues("mentor_state", index);
    } else if (value === "medha_area") {
      setDropdownValues("medha_area", index);
    } else if (value === "program_name") {
      setDropdownValues("program_name", index);
    } else if (value === "status") {
      setDropdownValues("status", index);
    }
  };

  const setDropdownValues = async (fieldName, index) => {
    try {
      const { data } = await getFieldValues(fieldName, "mentorships");

      if (fieldName === "mentor_name") {
        setMentorNameOption(data);
      } else if (fieldName === "mentor_domain") {
        setMentorDomain(data);
      } else if (fieldName === "mentor_company_name") {
        setMentorCompanyName(data);
      } else if (fieldName === "designation") {
        setDesignation(data);
      } else if (fieldName === "mentor_area") {
        setAreaOption(data);
      } else if (fieldName === "mentor_state") {
        setStateOption(data);
      } else if (fieldName === "medha_area") {
        setMedhaArea(data);
      } else if (fieldName === "program_name") {
        setProgramName(data);
      } else if (fieldName === "status") {
        setStatus(data);
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

                      {selectedSearchFields[index] === "mentor_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={mentorNameOption}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "mentor_domain" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={mentorDomain}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "mentor_company_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={mentorCompanyName}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "designation" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={designationOption}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "mentor_area" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={areaOption}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "mentor_state" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={stateOption}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "medha_area" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={medhaArea}
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
                          options={programName}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "status" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={status}
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
  MentorshipSearchbar
);
