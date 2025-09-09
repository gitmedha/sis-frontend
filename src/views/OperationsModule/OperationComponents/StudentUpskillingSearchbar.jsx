import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input } from "../../../../utils/Form";
import { Formik, Form } from "formik";
import styled from "styled-components";
import {
  searchOperationTab,
  resetSearch,
} from "../../../../store/reducers/Operations/actions";
import { getFieldValues } from "../operationsActions";
import { getAllSearchSrm } from "../../../../utils/function/lookupOptions"; // This may not be needed
import Select from "react-select";
import { Modal } from "react-bootstrap";

const Section = styled.div`
  padding-bottom: 30px;
  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }
`;

const SearchRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
  .uniform-btn {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    line-height: 1.2;
    white-space: nowrap;
  }
`;

const SearchFieldContainer = styled.div`
  flex: 0 0 200px;
`;

const SearchValueContainer = styled.div`
  flex: 0 0 300px;
`;

const PlusIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #28a745; /* Green color for the plus icon */
  font-size: 24px;
`;

const SearchButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StudentUpskillingSearchbar = ({ searchOperationTab, resetSearch }) => {
  const [onefilter, setOnefilter] = useState(true);
  const [showAppliedFilterMessage, setShowAppliedFilterMessage] = useState(false); // State for "Multiple filter applied" message

  const options = [
    { key: 0, value: "student_id", label: "Student" },
    { key: 1, value: "certificate_received", label: "Certificate Received" },
    { key: 2, value: "assigned_to", label: "Assigned To" },
    { key: 3, value: "batch", label: "Batch Name" },
    { key: 4, value: "program_name", label: "Program Name" },
    { key: 5, value: "institution", label: "Institution" },
    { key: 6, value: "category", label: "Category" },
    { key: 7, value: "sub_category", label: "Sub Category" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  // State for dropdown options
  const [studentOptions, setStudentOptions] = useState([]);
  const [certificateReceivedOptions] = useState([
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [programNameOptions, setProgramNameOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [categoryOptions] = useState([
    { value: "Career", label: "Career" },
    { value: "Creative", label: "Creative" },
  ]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);

  const initialValues = {
    search_by_field: "",
    search_by_value: "",
  };

  const handleSubmit = async (values) => {
    setShowAppliedFilterMessage(false); // Hide multi-filter applied message on single filter submission
    const baseUrl = "students-upskillings"; // Base URL for Student Upskilling API
    const searchData = {
      searchFields: [values.search_by_field],
      searchValues: [values.search_by_value],
    };

    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem(
      "prevSearchedPropsAndValues",
      JSON.stringify({ baseUrl, searchData })
    );
  };

  const closefilterBox = () => {
    setOnefilter(true);
    setShowAppliedFilterMessage(false); // Hide the message when modal is dismissed
  };

  const clearModalFiltersAndClose = async () => {
    closefilterBox(); // Just close the modal, which also hides the message
  };

  const clear = async (formik) => {
    formik.setValues(initialValues);
    await resetSearch();
    setSelectedSearchField(null);
    setDisabled(true);
    setIsFieldEmpty(false);
    setShowAppliedFilterMessage(false); // Hide multi-filter applied message on clear
  };

  const setSearchItem = async (value) => {
    setSelectedSearchField(value);
    setDisabled(false);
    setIsFieldEmpty(false);

    // Fetch options based on selected field
    const fieldToBackendMap = {
      "student_id": "student_id",
      "assigned_to": "assigned_to",
      "batch": "batch",
      "program_name": "program_name",
      "institution": "institution",
      "sub_category": "sub_category",
    };

    const backendFieldName = fieldToBackendMap[value];
    if (backendFieldName) {
      try {
        let data;
        if (value === "assigned_to") {
          data = await getDefaultAssigneeOptions();
        } else if (value === "sub_category") {
          const upskillingData = await getUpskillingPicklist();
          data = upskillingData.subCategory.map((item) => ({ key: item, value: item, label: item }));
        } else if (value === "program_name") {
            const opsPickListData = await getOpsPickList();
            data = opsPickListData.program_name.map((item) => ({ key: item, value: item, label: item }));
        } else {
          data = await getFieldValues(backendFieldName, "students-upskillings");
        }

        switch (value) {
          case "student_id":
            setStudentOptions(data);
            break;
          case "assigned_to":
            setAssignedToOptions(data);
            break;
          case "batch":
            setBatchOptions(data);
            break;
          case "program_name":
            setProgramNameOptions(data);
            break;
          case "institution":
            setInstitutionOptions(data);
            break;
          case "sub_category":
            setSubCategoryOptions(data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching values for ${value}:`, error);
      }
    }
  };

  const filters = [
    "Student",
    "Certificate Received",
    "Assigned To",
    "Batch Name",
    "Program Name",
    "Institution",
    "Category",
    "Sub Category",
  ];

  const FilterBox = ({
    closefilterBox,
    clear,
    handleSubmit,
    initialSelectedField,
    initialFilterValues,
    formik,
    clearModalFiltersAndClose,
    setShowAppliedFilterMessage,
  }) => {
    const filterMap = {
      "student_id": "Student",
      "certificate_received": "Certificate Received",
      "assigned_to": "Assigned To",
      "batch": "Batch Name",
      "program_name": "Program Name",
      "institution": "Institution",
      "category": "Category",
      "sub_category": "Sub Category",
    };

    const [activeFilters, setActiveFilters] = useState(() => {
      const initialActive = [];
      if (initialSelectedField) {
        const mappedKey = filterMap[initialSelectedField];
        if (mappedKey) {
          initialActive.push(mappedKey);
        }
      }
      return initialActive;
    });
    const [filterValues, setFilterValues] = useState(() => {
      return initialFilterValues || {};
    });
    const [filterErrors, setFilterErrors] = useState({}); // State to store validation errors
    const [isApplyDisabled, setIsApplyDisabled] = useState(true); // State to control Apply button disabled state

    // Options states for dropdowns in FilterBox
    const [studentOptionsFB, setStudentOptionsFB] = useState([]);
    const [certificateReceivedOptionsFB] = useState([
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ]);
    const [assignedToOptionsFB, setAssignedToOptionsFB] = useState([]);
    const [batchOptionsFB, setBatchOptionsFB] = useState([]);
    const [programNameOptionsFB, setProgramNameOptionsFB] = useState([]);
    const [institutionOptionsFB, setInstitutionOptionsFB] = useState([]);
    const [categoryOptionsFB] = useState([
      { value: "Career", label: "Career" },
      { value: "Creative", label: "Creative" },
    ]);
    const [subCategoryOptionsFB, setSubCategoryOptionsFB] = useState([]);

    // Validation function for all active filters
    const validateAllFilters = () => {
      const newErrors = {};
      let allValid = true;

      if (activeFilters.length === 0) {
        setIsApplyDisabled(true);
        return false;
      }

      activeFilters.forEach((filter) => {
        if (
          !filterValues[filter] ||
          (typeof filterValues[filter] === "string" && filterValues[filter].trim() === "")
        ) {
          newErrors[filter] = `Please select a ${filter.toLowerCase()}.`;
          allValid = false;
        }
      });

      setFilterErrors(newErrors);
      setIsApplyDisabled(!allValid);
      return allValid;
    };

    const handleChange = (filter, value) => {
      setFilterValues((prev) => {
        const updatedValues = { ...prev };
        updatedValues[filter] = value;
        validateAllFilters(); // Re-validate after updating filter values
        return updatedValues;
      });
    };

    useEffect(() => {
      validateAllFilters(); // Validate on mount and whenever activeFilters or filterValues change
    }, [activeFilters, filterValues]);

    useEffect(() => {
      activeFilters.forEach(async (filter) => {
        const fieldToBackendMap = {
          "Student": "student_id",
          "Assigned To": "assigned_to",
          "Batch Name": "batch",
          "Program Name": "program_name",
          "Institution": "institution",
          "Sub Category": "sub_category",
        };

        const backendFieldName = fieldToBackendMap[filter];
        if (backendFieldName) {
          try {
            let data;
            if (filter === "Assigned To") {
              data = await getDefaultAssigneeOptions();
            } else if (filter === "Sub Category") {
              const upskillingData = await getUpskillingPicklist();
              data = upskillingData.subCategory.map((item) => ({ key: item, value: item, label: item }));
            } else if (filter === "Program Name") {
                const opsPickListData = await getOpsPickList();
                data = opsPickListData.program_name.map((item) => ({ key: item, value: item, label: item }));
            } else {
              data = await getFieldValues(backendFieldName, "students-upskillings");
            }

            switch (filter) {
              case "Student":
                setStudentOptionsFB(data);
                break;
              case "Assigned To":
                setAssignedToOptionsFB(data);
                break;
              case "Batch Name":
                setBatchOptionsFB(data);
                break;
              case "Program Name":
                setProgramNameOptionsFB(data);
                break;
              case "Institution":
                setInstitutionOptionsFB(data);
                break;
              case "Sub Category":
                setSubCategoryOptionsFB(data);
                break;
              default:
                break;
            }
          } catch (error) {
            console.error(`Error fetching values for ${filter}:`, error);
          }
        }
      });
    }, [activeFilters]);

    const toggleFilter = (filter) => {
      setActiveFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]
      );
    };

    const handleApply = async () => {
      if (!validateAllFilters()) {
        return;
      }

      const backendFieldMap = {
        "Student": "student_id",
        "Certificate Received": "certificate_received",
        "Assigned To": "assigned_to",
        "Batch Name": "batch",
        "Program Name": "program_name",
        "Institution": "institution",
        "Category": "category",
        "Sub Category": "sub_category",
      };

      const searchFields = [];
      const searchValues = [];

      Object.keys(filterValues).forEach((key) => {
        const backendFieldName = backendFieldMap[key] || key;
        let value = filterValues[key];

        searchFields.push(backendFieldName);
        searchValues.push(value);
      });

      const searchData = {
        searchFields,
        searchValues,
      };
      const baseUrl = "students-upskillings";

      await searchOperationTab(baseUrl, searchData);
      await localStorage.setItem(
        "prevSearchedPropsAndValues",
        JSON.stringify({ baseUrl, searchData })
      );
      closefilterBox();
      setShowAppliedFilterMessage(true);
    };

    return (
      <Modal
        centered
        size="lg"
        show={true}
        onHide={closefilterBox}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
      >
        <Modal.Header closeButton className="bg-white">
          <Modal.Title id="contained-modal-title-vcenter" className="text--primary latto-bold">
            Add Filters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="filter-box">
            <h4 className="filter-title">Add Filter</h4>

            <div className="filter-chips">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`chip ${activeFilters.includes(f) ? "active" : ""}`}
                  onClick={() => toggleFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="filter-inputs">
              {activeFilters.map((f) => {
                switch (f) {
                  case "Student":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={studentOptionsFB.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Student", selected?.value)
                          }
                          placeholder="Select Student..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Student"] === "string" &&
                            filterValues["Student"] !== ""
                              ? {
                                  label: filterValues["Student"],
                                  value: filterValues["Student"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Student"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Student"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Certificate Received":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={certificateReceivedOptionsFB}
                          onChange={(selected) =>
                            handleChange("Certificate Received", selected?.value)
                          }
                          placeholder="Select Certificate Received..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Certificate Received"] === "string" &&
                            filterValues["Certificate Received"] !== ""
                              ? {
                                  label: filterValues["Certificate Received"],
                                  value: filterValues["Certificate Received"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Certificate Received"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Certificate Received"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Assigned To":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={assignedToOptionsFB.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Assigned To", selected?.value)
                          }
                          placeholder="Select Assigned To..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Assigned To"] === "string" &&
                            filterValues["Assigned To"] !== ""
                              ? {
                                  label: filterValues["Assigned To"],
                                  value: filterValues["Assigned To"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Assigned To"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Assigned To"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Batch Name":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={batchOptionsFB.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Batch Name", selected?.value)
                          }
                          placeholder="Select Batch Name..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Batch Name"] === "string" &&
                            filterValues["Batch Name"] !== ""
                              ? {
                                  label: filterValues["Batch Name"],
                                  value: filterValues["Batch Name"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Batch Name"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Batch Name"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Program Name":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={programNameOptionsFB.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Program Name", selected?.value)
                          }
                          placeholder="Select Program Name..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Program Name"] === "string" &&
                            filterValues["Program Name"] !== ""
                              ? {
                                  label: filterValues["Program Name"],
                                  value: filterValues["Program Name"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Program Name"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Program Name"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Institution":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={institutionOptionsFB.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Institution", selected?.value)
                          }
                          placeholder="Select Institution..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Institution"] === "string" &&
                            filterValues["Institution"] !== ""
                              ? {
                                  label: filterValues["Institution"],
                                  value: filterValues["Institution"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Institution"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Institution"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Category":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={categoryOptionsFB}
                          onChange={(selected) =>
                            handleChange("Category", selected?.value)
                          }
                          placeholder="Select Category..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Category"] === "string" &&
                            filterValues["Category"] !== ""
                              ? {
                                  label: filterValues["Category"],
                                  value: filterValues["Category"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Category"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Category"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  case "Sub Category":
                    return (
                      <Fragment key={f}>
                        <Select
                          options={subCategoryOptionsFB.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            handleChange("Sub Category", selected?.value)
                          }
                          placeholder="Select Sub Category..."
                          isClearable
                          isSearchable
                          value={
                            typeof filterValues["Sub Category"] === "string" &&
                            filterValues["Sub Category"] !== ""
                              ? {
                                  label: filterValues["Sub Category"],
                                  value: filterValues["Sub Category"],
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {filterErrors["Sub Category"] && (
                          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
                            {filterErrors["Sub Category"]}
                          </p>
                        )}
                      </Fragment>
                    );
                  default:
                    return (
                      <Input
                        key={f}
                        name={f.replace(/ /g, "_").toLowerCase()}
                        control="input"
                        label={f}
                        className="form-control"
                        onChange={(e) =>
                          handleChange(f.replace(/ /g, "_").toLowerCase(), e.target.value)
                        }
                        value={filterValues[f] || ""}
                      />
                    );
                }
              })}
            </div>

            <div className="filter-actions">
              <button
                className="btn apply"
                type="button"
                onClick={handleApply}
                disabled={isApplyDisabled}
              >
                Apply
              </button>
              <button
                className="btn clear"
                type="button"
                onClick={clearModalFiltersAndClose}
              >
                Clear
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <Fragment>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form>
            {onefilter ? (
              <Section>
                <SearchRow>
                  <div className="d-flex gap-2 align-items-end">
                    <SearchFieldContainer>
                      <Input
                        icon="down"
                        name="search_by_field"
                        label="Search Field"
                        control="lookup"
                        options={options}
                        className="form-control"
                        onChange={(e) => setSearchItem(e.value)}
                      />
                    </SearchFieldContainer>

                    <SearchValueContainer>
                      {selectedSearchField === null && (
                        <Input
                          name="search_by_value"
                          control="input"
                          label="Search Value"
                          className="form-control"
                          onClick={() => setIsFieldEmpty(true)}
                          disabled
                        />
                      )}
                      {selectedSearchField === "student_id" && (
                        <Select
                          options={studentOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Student..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "certificate_received" && (
                        <Select
                          options={certificateReceivedOptions}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Certificate Received..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "assigned_to" && (
                        <Select
                          options={assignedToOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Assigned To..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "batch" && (
                        <Select
                          options={batchOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Batch Name..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "program_name" && (
                        <Select
                          options={programNameOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Program Name..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "institution" && (
                        <Select
                          options={institutionOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Institution..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "category" && (
                        <Select
                          options={categoryOptions}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Category..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                      {selectedSearchField === "sub_category" && (
                        <Select
                          options={subCategoryOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          onChange={(selected) =>
                            formik.setFieldValue("search_by_value", selected?.value)
                          }
                          placeholder="Select Sub Category..."
                          isClearable
                          isSearchable
                          value={
                            formik.values.search_by_value
                              ? {
                                  label: formik.values.search_by_value,
                                  value: formik.values.search_by_value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                      )}
                    </SearchValueContainer>

                    <PlusIconContainer onClick={() => setOnefilter(false)}>
                      <i className="fa fa-plus-circle"></i> {/* Using Font Awesome plus circle icon */}
                    </PlusIconContainer>
                  </div>

                  <SearchButtonContainer>
                    <button
                      className="btn btn-primary uniform-btn"
                      type="submit"
                      disabled={disabled}
                    >
                      Search
                    </button>
                    <button
                      className="btn btn-secondary uniform-btn"
                      type="button"
                      onClick={() => clear(formik)}
                      disabled={disabled}
                    >
                      CLEAR
                    </button>
                  </SearchButtonContainer>
                </SearchRow>
                {isFieldEmpty && (
                  <div className="row">
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-2"></div>
                    <div className="col-lg-2 col-md-4 col-sm-12 mb-2">
                      <p style={{ color: "red" }}>
                        Please select any field first.
                      </p>
                    </div>
                  </div>
                )}
              </Section>
            ) : (
              <FilterBox
                closefilterBox={closefilterBox}
                handleSubmit={handleSubmit}
                clear={clear}
                initialSelectedField={selectedSearchField}
                initialFilterValues={(() => {
                  const mappedValues = {};
                  if (formik.values.search_by_field && formik.values.search_by_value) {
                    const filterMap = {
                      "student_id": "Student",
                      "certificate_received": "Certificate Received",
                      "assigned_to": "Assigned To",
                      "batch": "Batch Name",
                      "program_name": "Program Name",
                      "institution": "Institution",
                      "category": "Category",
                      "sub_category": "Sub Category",
                    };
                    const filterKey = filterMap[formik.values.search_by_field];
                    if (filterKey) {
                      mappedValues[filterKey] = formik.values.search_by_value;
                    }
                  }
                  return mappedValues;
                })()}
                formik={formik}
                clearModalFiltersAndClose={clearModalFiltersAndClose}
                setShowAppliedFilterMessage={setShowAppliedFilterMessage}
              />
            )}
          </Form>
        )}
      </Formik>
      {showAppliedFilterMessage && (
        <p style={{ color: '#257b69', marginTop: '10px' }}>Multiple Filter Applied</p>
      )}
    </Fragment>
  );
};

export default connect(null, { searchOperationTab, resetSearch })(StudentUpskillingSearchbar);
