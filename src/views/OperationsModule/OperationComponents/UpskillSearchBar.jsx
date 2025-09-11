import React, { Fragment, useState } from "react";
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
import Select from "react-select";
import Modal from 'react-bootstrap/Modal';
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

const MultipleFilterBox = styled.div`
  .filter-box {
    border: 1px solid #1a2b3c;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    max-width: 100%;
  }

  .filter-title {
    margin-bottom: 12px;
    font-weight: 500;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .chip {
    border: 1px solid #c4c4c4;
    border-radius: 6px;
    padding: 6px 14px;
    background: #f8f9fa;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 32px;
  }

  .chip:hover { background: #e2e6ea; }
  .chip.active { background: #21867a; border-color: #21867a; color: #fff; }

  .filter-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
  }

  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .btn { min-width: 80px; height: 36px; border-radius: 6px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s ease; }
  .btn.apply { background: #21867a; color: white; }
  .btn.apply:hover { background: #18645a; }
  .btn.clear { background: #6c757d; color: white; }
  .btn.clear:hover { background: #565e64; }
`;
const SearchButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px; /* Adjust as needed for alignment with other inputs */
`;

const UpskillSearchBar = ({ searchOperationTab, resetSearch }) => {
  const options = [
    { key: 1, value: "assigned_to.username", label: "Assigned to" },
    { key: 3, value: "course_name", label: "Course Name" },
    { key: 6, value: "end_date", label: "End Date" },
    { key: 2, value: "institution.name", label: "Institute Name" },
    { key: 5, value: "start_date", label: "Start Date" },
    { key: 0, value: "student_id.full_name", label: "Student Name" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 7, value: "category", label: "Category" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [courseNameOptions, setCourseNameOptions] = useState([]);
  const [programNameOptions, setProgramOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedSearchFields, setSelectedSearchFields] = useState([null]);
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(1);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [onefilter, setOnefilter] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState([]); // {label, value}
  const [persistentFilterValues, setPersistentFilterValues] = useState({});
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false);

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

  const formatDate = (dateVal) => {
    const date = new Date(dateVal);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (values) => {
    const baseUrl = "students-upskillings";
    const searchFields = [];
    const searchValues = [];
    const appliedList = [];

    const fieldLabelMap = options.reduce((acc, cur) => {
      acc[cur.value] = cur.label;
      return acc;
    }, {});

    values.searches.forEach((search) => {
      if (search.search_by_field && search.search_by_value) {
        searchFields.push(search.search_by_field);
        searchValues.push(search.search_by_value);
        appliedList.push({ label: fieldLabelMap[search.search_by_field] || search.search_by_field, value: search.search_by_value });
      } else if (
        search.search_by_field === "start_date" &&
        search.search_by_value_date &&
        search.search_by_value_date_to
      ) {
        const startDate = formatDate(search.search_by_value_date);
        const endDate = formatDate(search.search_by_value_date_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
        appliedList.push({ label: fieldLabelMap[search.search_by_field] || "Start Date", value: `${startDate} - ${endDate}` });
      } else if (
        search.search_by_field === "end_date" &&
        search.search_by_value_date_end_from &&
        search.search_by_value_date_end_to
      ) {
        const startDate = formatDate(search.search_by_value_date_end_from);
        const endDate = formatDate(search.search_by_value_date_end_to);
        searchFields.push(search.search_by_field);
        searchValues.push({ start: startDate, end: endDate });
        appliedList.push({ label: fieldLabelMap[search.search_by_field] || "End Date", value: `${startDate} - ${endDate}` });
      }
    });

    const searchData = { searchFields, searchValues };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
    // Do not show applied filters for single-filter submissions
    setAppliedFilters([]);
    setShowAppliedFilterMessage(false);
  };

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchFields([null]);
    setDisabled(true);
    setCounter(1);
    setIsFieldEmpty(false);
    setAppliedFilters([]);
    setShowAppliedFilterMessage(false);
    setPersistentFilterValues({});
    const baseUrl = "students-upskillings";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const closefilterBox = () => {
    setOnefilter(true);
  };

  const clearModalFiltersAndClose = async () => {
    setPersistentFilterValues({});
    setAppliedFilters([]);
    const baseUrl = "students-upskillings";
    const searchData = { searchFields: [], searchValues: [] };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
    closefilterBox();
  };

  const filters = [
    "Student Name",
    "Assigned To",
    "Institute Name",
    "Course Name",
    "Program Name",
    "Category",
    "Start Date",
    "End Date",
  ];

  const FilterBox = ({ initialFilterValues }) => {
    const [activeFilters, setActiveFilters] = useState(() => {
      const s = new Set();
      Object.keys(initialFilterValues || {}).forEach(k => {
        const v = initialFilterValues[k];
        if (v !== null && v !== '') {
          // If we got date range keys, enable their base chip
          if (k === 'Start Date From' || k === 'Start Date To') {
            s.add('Start Date');
          } else if (k === 'End Date From' || k === 'End Date To') {
            s.add('End Date');
          } else {
            s.add(k);
          }
        }
      });
      return Array.from(s);
    });
    const [isApplyDisabled, setIsApplyDisabled] = useState(true);

    const validate = (vals) => {
      if (activeFilters.length === 0) { setIsApplyDisabled(true); return false; }
      let ok = true;
      activeFilters.forEach(f => {
        if (f === "Start Date" || f === "End Date") {
          const fromVal = vals[`${f} From`];
          const toVal = vals[`${f} To`];
          if (!fromVal || !toVal) ok = false;
          if (fromVal instanceof Date && toVal instanceof Date && fromVal > toVal) ok = false;
        } else {
          const v = vals[f];
          if (!v || (typeof v === 'string' && v.trim() === '')) ok = false;
        }
      });
      setIsApplyDisabled(!ok);
      return ok;
    };

    const handleChange = (filter, value, setFieldValue, currentValues) => {
      setFieldValue(filter, value);
      validate({ ...currentValues, [filter]: value });
    };

    const ensureOptions = async () => {
      // Fetch options lazily based on active filters
      for (const f of activeFilters) {
        if (f === "Student Name" && studentNameOptions.length === 0) {
          const { data } = await getFieldValues("student_id", "students-upskillings");
          setStudentNameOptions(data);
        } else if (f === "Assigned To" && assignedToOptions.length === 0) {
          const users = await getAllSearchSrm();
          setAssignedToOptions(users);
        } else if (f === "Institute Name" && institutionOptions.length === 0) {
          const { data } = await getFieldValues("institution", "students-upskillings");
          setInstitutionOptions(data);
        } else if (f === "Course Name" && courseNameOptions.length === 0) {
          const { data } = await getFieldValues("course_name", "students-upskillings");
          setCourseNameOptions(data);
        } else if (f === "Program Name" && programNameOptions.length === 0) {
          const { data } = await getFieldValues("program_name", "students-upskillings");
          setProgramOptions(data);
        } else if (f === "Category" && categoryOptions.length === 0) {
          const { data } = await getFieldValues("category", "students-upskillings");
          setCategoryOptions(data);
        }
      }
    };

    React.useEffect(() => { ensureOptions(); }, [activeFilters]);

    const toggleFilter = (filter) => {
      setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
    };

    const handleApply = async (values) => {
      if (!validate(values)) return;
      const backendFieldMap = {
        "Student Name": "student_id.full_name",
        "Assigned To": "assigned_to.username",
        "Institute Name": "institution.name",
        "Course Name": "course_name",
        "Program Name": "program_name",
        "Category": "category",
        "Start Date From": "start_date_from",
        "Start Date To": "start_date_to",
        "End Date From": "end_date_from",
        "End Date To": "end_date_to",
      };
      const searchFields = [];
      const searchValues = [];
      const chips = [];
      Object.keys(values).forEach(k => {
        let v = values[k];
        if (v !== null && v !== undefined && v !== '') {
          searchFields.push(backendFieldMap[k] || k);
          if (v instanceof Date && !isNaN(v)) {
            chips.push({ label: k, value: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(v) });
            v = v.toISOString();
          } else {
            chips.push({ label: k, value: v });
          }
          searchValues.push(v);
        }
      });
      const baseUrl = "students-upskillings";
      const searchData = { searchFields, searchValues };
      await searchOperationTab(baseUrl, searchData);
      await localStorage.setItem("prevSearchedPropsAndValues", JSON.stringify({ baseUrl, searchData }));
      setPersistentFilterValues(values);
      setAppliedFilters(chips);
      closefilterBox();
    };

    return (
      <Formik
        initialValues={initialFilterValues}
        enableReinitialize={true}
        onSubmit={(values) => handleApply(values)}
        validate={(values) => { validate(values); }}
      >
        {(formik) => (
          <Form>
            <Modal centered size="lg" show={true} onHide={closefilterBox} animation={false} aria-labelledby="contained-modal-title-vcenter" className="form-modal">
              <Modal.Header className="bg-white">
                <Modal.Title id="contained-modal-title-vcenter" className="text--primary latto-bold">Add Filters</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <MultipleFilterBox>
                  <div className="filter-chips">
                    {filters.map((f) => (
                      <button key={f} type="button" className={`chip ${activeFilters.includes(f) ? "active" : ""}`} onClick={() => toggleFilter(f)}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="filter-inputs">
                    {activeFilters.map((f) => {
                      switch (f) {
                        case "Student Name":
                          return (
                            <div key={f}>
                              <label>Student Name</label>
                              <Select
                                options={studentNameOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                                onChange={(sel) => handleChange("Student Name", sel?.value, formik.setFieldValue, formik.values)}
                                placeholder="Select Student..."
                                isClearable isSearchable
                                value={formik.values["Student Name"] ? { label: formik.values["Student Name"], value: formik.values["Student Name"] } : null}
                                styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                              />
                            </div>
                          );
                        case "Start Date":
                        case "End Date":
                          return (
                            <Fragment key={f}>
                              <DateRangeContainer>
                                <div className="date-input-group">
                                  <label>{`${f} From`}</label>
                                  <Input
                                    control="datepicker"
                                    name={`${f} From`}
                                    className="form-control w-300"
                                    onChange={(date) => handleChange(`${f} From`, date, formik.setFieldValue, formik.values)}
                                    value={formik.values[`${f} From`] || null}
                                    showTime={false}
                                  />
                                </div>
                                <div className="date-input-group">
                                  <label>{`${f} To`}</label>
                                  <Input
                                    control="datepicker"
                                    name={`${f} To`}
                                    className="form-control w-300"
                                    onChange={(date) => handleChange(`${f} To`, date, formik.setFieldValue, formik.values)}
                                    minDate={formik.values[`${f} From`] || null}
                                    value={formik.values[`${f} To`] || null}
                                    showTime={false}
                                  />
                                </div>
                              </DateRangeContainer>
                            </Fragment>
                          );
                        case "Assigned To":
                          return (
                            <div key={f}>
                              <label>Assigned To</label>
                              <Select
                                options={assignedToOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                                onChange={(sel) => handleChange("Assigned To", sel?.value, formik.setFieldValue, formik.values)}
                                placeholder="Select Assigned To..."
                                isClearable isSearchable
                                value={formik.values["Assigned To"] ? { label: formik.values["Assigned To"], value: formik.values["Assigned To"] } : null}
                                styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                              />
                            </div>
                          );
                        case "Institute Name":
                          return (
                            <div key={f}>
                              <label>Institute Name</label>
                              <Select
                                options={institutionOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                                onChange={(sel) => handleChange("Institute Name", sel?.value, formik.setFieldValue, formik.values)}
                                placeholder="Select Institute..."
                                isClearable isSearchable
                                value={formik.values["Institute Name"] ? { label: formik.values["Institute Name"], value: formik.values["Institute Name"] } : null}
                                styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                              />
                            </div>
                          );
                        case "Course Name":
                          return (
                            <div key={f}>
                              <label>Course Name</label>
                              <Select
                                options={courseNameOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                                onChange={(sel) => handleChange("Course Name", sel?.value, formik.setFieldValue, formik.values)}
                                placeholder="Select Course..."
                                isClearable isSearchable
                                value={formik.values["Course Name"] ? { label: formik.values["Course Name"], value: formik.values["Course Name"] } : null}
                                styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                              />
                            </div>
                          );
                        case "Program Name":
                          return (
                            <div key={f}>
                              <label>Program Name</label>
                              <Select
                                options={programNameOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                                onChange={(sel) => handleChange("Program Name", sel?.value, formik.setFieldValue, formik.values)}
                                placeholder="Select Program..."
                                isClearable isSearchable
                                value={formik.values["Program Name"] ? { label: formik.values["Program Name"], value: formik.values["Program Name"] } : null}
                                styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                              />
                            </div>
                          );
                        case "Category":
                          return (
                            <div key={f}>
                              <label>Category</label>
                              <Select
                                options={categoryOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                                onChange={(sel) => handleChange("Category", sel?.value, formik.setFieldValue, formik.values)}
                                placeholder="Select Category..."
                                isClearable isSearchable
                                value={formik.values["Category"] ? { label: formik.values["Category"], value: formik.values["Category"] } : null}
                                styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                              />
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                  <div className="filter-actions">
                    <button className="btn apply" type="button" onClick={formik.handleSubmit} disabled={isApplyDisabled}>Apply</button>
                    <button className="btn clear" type="button" onClick={clearModalFiltersAndClose}>Clear</button>
                  </div>
                </MultipleFilterBox>
              </Modal.Body>
            </Modal>
          </Form>
        )}
      </Formik>
    );
  };

  const setSearchItem = (value, index) => {
    const newSelectedSearchFields = [...selectedSearchFields];
    newSelectedSearchFields[index] = value;
    setSelectedSearchFields(newSelectedSearchFields);
    setDisabled(false);
    setIsFieldEmpty(false);

    if (value === "student_id.full_name") {
      setDropdownValues("student_id");
    } else if (value === "assigned_to.username") {
      setDropdownValues("assigned_to");
    } else if (value === "institution.name") {
      setDropdownValues("institution");
    } else if (value === "course_name") {
      setDropdownValues("course_name");
    } else if (value === "program_name") {
      setDropdownValues("program_name");
    } else if (value === "category") {
      setDropdownValues("category");
    }
  };

  const setDropdownValues = async (fieldName) => {
    try {
      const { data } = await getFieldValues(fieldName, "students-upskillings");

      if (fieldName === "student_id") {
        setStudentNameOptions(data);
      } else if (fieldName === "assigned_to") {
        let newSRM = await getAllSearchSrm();
        setAssignedToOptions(newSRM);
      } else if (fieldName === "institution") {
        setInstitutionOptions(data);
      } else if (fieldName === "course_name") {
        setCourseNameOptions(data);
      } else if (fieldName === "program_name") {
        setProgramOptions(data);
      } else if (fieldName === "category") {
        setCategoryOptions(data);
      }
    } catch (error) {
      console.error(error);
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
                          onClick={() => setIsFieldEmpty(true)}
                          disabled
                        />
                      )}

                      {selectedSearchFields[index] === "student_id.full_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={studentNameOptions}
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

                      {selectedSearchFields[index] === "institution.name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={institutionOptions}
                          className="form-control"
                          disabled={disabled}
                        />
                      )}

                      {selectedSearchFields[index] === "course_name" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={courseNameOptions}
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

                      {selectedSearchFields[index] === "category" && (
                        <Input
                          icon="down"
                          name={`searches[${index}].search_by_value`}
                          label="Search Value"
                          control="lookup"
                          options={categoryOptions}
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
                              onChange={(date) => formik.setFieldValue(`searches[${index}].search_by_value_date`, date)}
                              value={formik.values.searches?.[index]?.search_by_value_date || null}
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
                              minDate={formik.values.searches?.[index]?.search_by_value_date || null}
                              onChange={(date) => formik.setFieldValue(`searches[${index}].search_by_value_date_to`, date)}
                              value={formik.values.searches?.[index]?.search_by_value_date_to || null}
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
                              onChange={(date) => formik.setFieldValue(`searches[${index}].search_by_value_date_end_from`, date)}
                              value={formik.values.searches?.[index]?.search_by_value_date_end_from || null}
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
                              minDate={formik.values.searches?.[index]?.search_by_value_date_end_from || null}
                              onChange={(date) => formik.setFieldValue(`searches[${index}].search_by_value_date_end_to`, date)}
                              value={formik.values.searches?.[index]?.search_by_value_date_end_to || null}
                            />
                          </div>
                        </DateRangeContainer>
                      )}
                    </SearchValueContainer>
                  </div>

                  {/* Add/Remove Icons Column */}
                  {/* {index === counter - 1 && (
                    <div className="col-lg-1 col-md-2 col-sm-12">
                      <IconContainer>
                        <FaPlusCircle onClick={addSearchRow} title="Add Search Row" />
                        {counter > 1 && <FaMinusCircle onClick={removeSearchRow} title="Remove Search Row" />}
                      </IconContainer>
                    </div>
                  )} */}
                  <SearchButtonContainer>
                      <button
                        className="btn btn-primary uniform-btn"
                        type="submit"
                        disabled={disabled}
                      >
                        Search
                      </button>
                      <button
                        className="btn btn-primary uniform-btn"
                        type="button"
                        onClick={() => setOnefilter(false)}
                      >
                        Add Filter
                      </button>
                      <button
                        className="btn btn-secondary uniform-btn"
                        type="button"
                        onClick={() => clear(formik)}
                        // disabled={disabled}
                      >
                        CLEAR
                      </button>
                    </SearchButtonContainer>
                </SearchRow>
              ))}

              {/* Action Buttons Row */}
            

              {/* Error Message Row */}
              {isFieldEmpty && (
                <div className="row">
                  <div className="col-lg-2 col-md-4 col-sm-12 mb-2"></div>
                  <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                    <p style={{ color: "red" }}>Please select any field first.</p>
                  </div>
                </div>
              )}
              {appliedFilters.length > 0 && (
                <div className="row">
                  <div className="col-12" style={{ marginTop: "10px" }}>
                    <p style={{ color: '#257b69', marginBottom: '6px' }}>
                      Applied Filters ({appliedFilters.length}):
                    </p>
                    <div className="filter-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {appliedFilters.map((f, idx) => (
                        <span key={`${f.label}-${idx}`} className="chip">
                          {f.label}: {f.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Section>
            {!onefilter && (
              <FilterBox initialFilterValues={(() => {
                const mapped = { ...persistentFilterValues };
                const labelMap = {
                  "student_id.full_name": "Student Name",
                  "assigned_to.username": "Assigned To",
                  "institution.name": "Institute Name",
                  "course_name": "Course Name",
                  "program_name": "Program Name",
                  "category": "Category",
                  "start_date": "Start Date",
                  "end_date": "End Date",
                };
                (formik.values.searches || []).forEach((s) => {
                  if (!s || !s.search_by_field) return;
                  const key = labelMap[s.search_by_field];
                  if (!key) return;
                  if (s.search_by_field === "start_date") {
                    if (s.search_by_value_date) mapped["Start Date From"] = new Date(s.search_by_value_date);
                    if (s.search_by_value_date_to) mapped["Start Date To"] = new Date(s.search_by_value_date_to);
                  } else if (s.search_by_field === "end_date") {
                    if (s.search_by_value_date_end_from) mapped["End Date From"] = new Date(s.search_by_value_date_end_from);
                    if (s.search_by_value_date_end_to) mapped["End Date To"] = new Date(s.search_by_value_date_end_to);
                  } else if (s.search_by_value) {
                    mapped[key] = s.search_by_value;
                  }
                });
                return mapped;
              })()} />
            )}
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(UpskillSearchBar);