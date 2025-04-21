import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { Input } from "../../../utils/Form";
import { Formik, Form, useFormik } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../store/reducers/Operations/actions";
import { getFieldValues } from "./operationsActions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { getAllSearchSrm } from "src/utils/function/lookupOptions";

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

const DateRangeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  > div {
    flex: 1;
    &:first-child {
      margin-right: 15px;
    }
  }
`;

const OpsSearchDropdown = function OpsSearchBar({
  searchOperationTab,
  resetSearch,
}) {
  let today = new Date();

  const initialValues = {
    searches: [{
      search_by_field: "",
      search_by_value: "",
      search_by_value_date_to: new Date(new Date(today).setDate(today.getDate())),
      search_by_value_date: new Date(new Date(today).setDate(today.getDate())),
      search_by_value_date_end_from: new Date(new Date(today).setDate(today.getDate())),
      search_by_value_date_end_to: new Date(new Date(today).setDate(today.getDate())),
    }],
  };

  const [selectedSearchFields, setSelectedSearchFields] = useState([null]);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [assignedToOptions, setAssignedOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1);

  const formatdate = (dateval) => {
    const date = new Date(dateval);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (values) => {
    const baseUrl = "users-ops-activities";
    const searchFields = [];
    const searchValues = [];

    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
      }
    });

    const searchData = { searchFields, searchValues };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const options = [
    { key: 0, value: "assigned_to.username", label: "Assigned To" },
    { key: 1, value: "activity_type", label: "Activity Type" },
    { key: 2, value: "batch.name", label: "Batch" },
    { key: 3, value: "area", label: "Medha Area" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 5, value: "start_date", label: "Start Date" },
    { key: 6, value: "end_date", label: "End Date" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const activityTypes = [
    { key: 0, label: "Workshop/Training Session/Activity (In/Off campus)", value: "Workshop/Training Session/Activity (In/Off campus)" },
    { key: 1, label: "Industry Talk/Expert Talk", value: "Industry Talk/Expert Talk" },
    { key: 2, label: "Alumni Engagement", value: "Alumni Engagement" },
    { key: 3, label: "Industry Visit/Exposure Visit", value: "Industry Visit/Exposure Visit" },
    { key: 4, label: "Placement Drive", value: "Placement Drive" },
  ];

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
    setIsFieldEmpty(false);

    if (value.includes("assigned_to")) setDropdownValues("assigned_to");
    else if (value.includes("batch")) setDropdownValues("batch");
    else if (value === "area") setDropdownValues("area");
    else if (value === "program_name") setDropdownValues("program_name");
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "users-ops-activities");
      if (fieldName === "assigned_to") {
        let newSRM = await getAllSearchSrm();
        setAssignedOptions(newSRM);
      } else if (fieldName === "batch") setBatchOptions(data);
      else if (fieldName === "area") setAreaOptions(data);
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
                        onClick={() => setIsFieldEmpty(true)}
                        disabled
                      />
                    )}

                    {selectedSearchFields[index] === "program_name" && (
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_value`}
                        label="Search Value"
                        control="lookup"
                        options={programOptions}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}

                    {selectedSearchFields[index] === "activity_type" && (
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_value`}
                        label="Search Value"
                        control="lookup"
                        options={activityTypes}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}

                    {selectedSearchFields[index] === "assigned_to.username" && (
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_value`}
                        label="Search Value"
                        control="lookup"
                        options={assignedToOptions}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}

                    {selectedSearchFields[index] === "batch.name" && (
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_value`}
                        label="Search Value"
                        control="lookup"
                        options={batchOptions}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}

                    {selectedSearchFields[index] === "area" && (
                      <Input
                        icon="down"
                        name={`searches[${index}].search_by_value`}
                        label="Search Value"
                        control="lookup"
                        options={areaOptions}
                        className="form-control"
                        disabled={disabled}
                      />
                    )}

                    {selectedSearchFields[index] === "start_date" && (
                      <DateRangeContainer>
                        <div>
                          <Input
                            name={`searches[${index}].search_by_value_date`}
                            label="From"
                            placeholder="Start Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                            disabled={disabled}
                          />
                        </div>
                        <div>
                          <Input
                            name={`searches[${index}].search_by_value_date_to`}
                            label="To"
                            placeholder="End Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                            disabled={disabled}
                          />
                        </div>
                      </DateRangeContainer>
                    )}

                    {selectedSearchFields[index] === "end_date" && (
                      <DateRangeContainer>
                        <div>
                          <Input
                            name={`searches[${index}].search_by_value_date_end_from`}
                            label="From"
                            placeholder="Start Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                            disabled={disabled}
                          />
                        </div>
                        <div>
                          <Input
                            name={`searches[${index}].search_by_value_date_end_to`}
                            label="To"
                            placeholder="End Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                            disabled={disabled}
                          />
                        </div>
                      </DateRangeContainer>
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

              {isFieldEmpty && (
                <div className="row">
                  <div className="col-lg-2 col-md-4 col-sm-12 mb-2"></div>
                  <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                    <p style={{ color: "red" }}>Please select any field first.</p>
                  </div>
                </div>
              )}
            </Section>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(OpsSearchDropdown);