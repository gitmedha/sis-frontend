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
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const Section = styled.div`
  padding-bottom: 30px;
  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }
`;

const SearchRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
`;

const SearchFieldContainer = styled.div`
  flex: 0 0 200px;
`;

const SearchValueContainer = styled.div`
  flex: 0 0 300px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 28px;
  
  svg {
    cursor: pointer;
    font-size: 20px;
    color: #207b69;
    &:hover {
      color: #16574a;
    }
  }
`;

const MentorshipSearchbar = ({ searchOperationTab, resetSearch }) => {
  const options = [
    { key: 0, value: "mentor_name", label: "Mentor Name" },
    { key: 1, value: "mentor_domain", label: "Mentor Domain" },
    { key: 2, value: "mentor_company_name", label: "Mentor Company Name" },
    { key: 3, value: "designation", label: "Designation" },
    { key: 4, value: "mentor_area", label: "Mentor Area" },
    { key: 5, value: "mentor_state", label: "Mentor State" },
    { key: 8, value: "medha_area", label: "Medha Area" },
    { key: 9, value: "program_name", label: "Program Name" },
    { key: 10, value: "status", label: "Status" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [mentorNameOption, setMentorNameOption] = useState([]);
  const [areaOption, setAreaOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [mentorDomain, setMentorDomain] = useState([]);
  const [mentorCompanyName, setMentorCompanyName] = useState([]);
  const [designationOption, setDesignation] = useState([]);
  const [medhaArea, setMedhaArea] = useState([]);
  const [programName, setProgramName] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1);

  const initialValues = {
    searches: Array(counter).fill({
      search_by_field: "",
      search_by_value: "",
    }),
  };

  const handleSubmit = async (values) => {
    const baseUrl = "mentorships";
    const searchFields = [];
    const searchValues = [];

    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
      }
    });

    const payload = { searchFields, searchValues };
    await searchOperationTab(baseUrl, payload);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData: payload })
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

    if (value === "mentor_name") setDropdownValues("mentor_name");
    else if (value === "mentor_domain") setDropdownValues("mentor_domain");
    else if (value === "mentor_company_name") setDropdownValues("mentor_company_name");
    else if (value === "designation") setDropdownValues("designation");
    else if (value === "mentor_area") setDropdownValues("mentor_area");
    else if (value === "mentor_state") setDropdownValues("mentor_state");
    else if (value === "medha_area") setDropdownValues("medha_area");
    else if (value === "program_name") setDropdownValues("program_name");
    else if (value === "status") setDropdownValues("status");
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "mentorships");
      if (fieldName === "mentor_name") setMentorNameOption(data);
      else if (fieldName === "mentor_domain") setMentorDomain(data);
      else if (fieldName === "mentor_company_name") setMentorCompanyName(data);
      else if (fieldName === "designation") setDesignation(data);
      else if (fieldName === "mentor_area") setAreaOption(data);
      else if (fieldName === "mentor_state") setStateOption(data);
      else if (fieldName === "medha_area") setMedhaArea(data);
      else if (fieldName === "program_name") setProgramName(data);
      else if (fieldName === "status") setStatus(data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const addSearchRow = () => {
    setCounter(counter + 1);
    setSelectedSearchFields([...selectedSearchFields, null]);
  };

  const removeSearchRow = () => {
    if (counter > 1) {
      setCounter(counter - 1);
      const newSelectedFields = [...selectedSearchFields];
      newSelectedFields.pop();
      setSelectedSearchFields(newSelectedFields);
    }
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            <Section>
              {Array.from({ length: counter }).map((_, index) => (
                <SearchRow key={index}>
                  {/* Search Field Column */}
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <SearchFieldContainer>
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_field`}
                        label="Search Field"
                        control="lookup"
                        options={options}
                        className="form-control"
                        onChange={(e) => setSearchItem(e.value, index)}
                      />
                    </SearchFieldContainer>
                  </div>

                  {/* Search Value Column */}
                  <div className="col-lg-4 col-md-6 col-sm-6">
                    <SearchValueContainer>
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
                    </SearchValueContainer>
                  </div>

                  {/* Add/Remove Icons Column */}
                  {index === counter - 1 && (
                    <div className="col-lg-1 col-md-2 col-sm-12">
                      <IconContainer>
                        <FaPlusCircle onClick={addSearchRow} title="Add Search Row" />
                        {counter > 1 && <FaMinusCircle onClick={removeSearchRow} title="Remove Search Row" />}
                      </IconContainer>
                    </div>
                  )}
                </SearchRow>
              ))}

              {/* Action Buttons Row */}
              <div className="row">
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

export default connect(null, { searchOperationTab, resetSearch })(MentorshipSearchbar);
