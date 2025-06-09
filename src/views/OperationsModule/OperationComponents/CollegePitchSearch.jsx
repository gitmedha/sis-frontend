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

const CollegePitchSearch = ({ searchOperationTab, resetSearch }) => {
  const options = [
    { key: 0, value: "area", label: "Medha Area" },
    { key: 1, value: "program_name", label: "Program Name" },
  ];

  const [medhaAreaOptions, setMedhaAreaOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
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
    const baseUrl = "college-pitches";
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

    if (value === "area") {
      setDropdownValues("area");
    } else if (value === "program_name") {
      setDropdownValues("program_name");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "college-pitches");
      if (fieldName === "area") setMedhaAreaOptions(data);
      else if (fieldName === "program_name") setProgramOptions(data);
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
                  </SearchValueContainer>

                  {index === counter - 1 && (
                    <IconContainer>
                      <FaPlusCircle onClick={addSearchRow} />
                      {counter > 1 && <FaMinusCircle onClick={removeSearchRow} />}
                    </IconContainer>
                  )}
                </SearchRow>
              ))}

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

export default connect(null, { searchOperationTab, resetSearch })(CollegePitchSearch);