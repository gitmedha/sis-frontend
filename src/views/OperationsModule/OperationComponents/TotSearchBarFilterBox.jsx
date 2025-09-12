import React, { Fragment, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Input } from "../../../utils/Form";
import Select from "react-select";
import Modal from 'react-bootstrap/Modal';
import styled from "styled-components";
import { getFieldValues } from "./operationsActions";
import { getAllSearchSrm } from "src/utils/function/lookupOptions";

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

  .btn { 
    min-width: 80px; 
    height: 36px; 
    border-radius: 6px; 
    border: none; 
    font-size: 14px; 
    font-weight: 500; 
    cursor: pointer; 
    transition: background 0.2s ease; 
  }
  .btn.apply { background: #21867a; color: white; }
  .btn.apply:hover { background: #18645a; }
  .btn.clear { background: #6c757d; color: white; }
  .btn.clear:hover { background: #565e64; }
`;

const FilterBox = ({ 
  initialFilterValues, 
  closefilterBox, 
  clearModalFiltersAndClose,
  searchOperationTab,
  setPersistentFilterValues,
  setAppliedFilters,
  setAppliedFiltersSummary,
  setShowAppliedFilterMessage,
  appliedFilters
}) => {
  const filters = [
    "City",
    "Project Name", 
    "Project Department",
    "State",
    "Project Type",
    "Facilitator 1",
    "Facilitator 2",
    "Start Date",
    "End Date",
    "Gender",
    "Participant Name",
  ];

  const [activeFilters, setActiveFilters] = useState(() => {
    const s = new Set();
    Object.keys(initialFilterValues || {}).forEach(k => {
      const v = initialFilterValues[k];
      if (v !== null && v !== '') {
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
  const [cityOptions, setCityOptions] = useState([]);
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [partnerDeptOptions, setPartnerDeptOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [facilitator1Options, setFacilitator1Options] = useState([]);
  const [facilitator2Options, setFacilitator2Options] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [participantOptions, setParticipantOptions] = useState([]);

  const projectTypeOptions = [
    { label: "External", value: "External" },
    { label: "Internal", value: "Internal" },
  ];

  const validate = (vals) => {
    if (activeFilters.length === 0) { 
      setIsApplyDisabled(true); 
      return false; 
    }
    let ok = false;
    activeFilters.forEach(f => {
      if (f === "Start Date" || f === "End Date") {
        const fromVal = vals[`${f} From`];
        const toVal = vals[`${f} To`];
        if (fromVal && toVal) {
          if (fromVal instanceof Date && toVal instanceof Date && fromVal <= toVal) {
            ok = true;
          }
        }
      } else {
        const v = vals[f];
        if (v && (typeof v !== 'string' || v.trim() !== '')) {
          ok = true;
        }
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
    for (const f of activeFilters) {
      if (f === "City" && cityOptions.length === 0) {
        const { data } = await getFieldValues("city", "users-tots");
        setCityOptions(data || []);
      } else if (f === "Project Name" && projectNameOptions.length === 0) {
        const { data } = await getFieldValues("project_name", "users-tots");
        setProjectNameOptions(data || []);
      } else if (f === "Project Department" && partnerDeptOptions.length === 0) {
        const { data } = await getFieldValues("partner_dept", "users-tots");
        setPartnerDeptOptions(data || []);
      } else if (f === "State" && stateOptions.length === 0) {
        const { data } = await getFieldValues("state", "users-tots");
        setStateOptions(data || []);
      } else if (f === "Facilitator 1" && facilitator1Options.length === 0) {
        const { data } = await getFieldValues("trainer_1.username", "users-tots");
        setFacilitator1Options(data || []);
      } else if (f === "Facilitator 2" && facilitator2Options.length === 0) {
        const { data } = await getFieldValues("trainer_2.username", "users-tots");
        setFacilitator2Options(data || []);
      } else if (f === "Gender" && genderOptions.length === 0) {
        const { data } = await getFieldValues("gender", "users-tots");
        setGenderOptions(data || []);
      } else if (f === "Participant Name" && participantOptions.length === 0) {
        const { data } = await getFieldValues("user_name", "users-tots");
        setParticipantOptions(data || []);
      }
    }
  };

  useEffect(() => { 
    ensureOptions(); 
  }, [activeFilters]);

  const toggleFilter = (filter, modalFormik) => {
    setActiveFilters(prev => {
      const isCurrentlyActive = prev.includes(filter);
      const newActiveFilters = isCurrentlyActive
        ? prev.filter(f => f !== filter) 
        : [...prev, filter];
      
      if (isCurrentlyActive) {
        const fm = modalFormik;
        fm.setFieldValue(filter, null);
        if (filter === "Start Date" || filter === "End Date") {
          fm.setFieldValue(`${filter} From`, null);
          fm.setFieldValue(`${filter} To`, null);
        }
      }
      
      return newActiveFilters;
    });
  };

  const handleApply = async (values) => {
    if (!validate(values)) return;
    
    const backendFieldMap = {
      "City": "city",
      "Project Name": "project_name",
      "Project Department": "partner_dept",
      "State": "state",
      "Project Type": "project_type",
      "Facilitator 1": "trainer_1.username",
      "Facilitator 2": "trainer_2.username",
      "Start Date From": "start_date_from",
      "Start Date To": "start_date_to",
      "End Date From": "end_date_from",
      "End Date To": "end_date_to",
      "Gender": "gender",
      "Participant Name": "user_name",
    };

    const searchFields = [];
    const searchValues = [];
    const chips = [];
    const appliedFiltersSummaryParts = [];
    
    Object.keys(values).forEach(k => {
      let v = values[k];
      if (v !== null && v !== undefined && v !== '') {
        searchFields.push(backendFieldMap[k] || k);
        let displayValue = v;
        
        if (v instanceof Date && !isNaN(v)) {
          displayValue = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(v);
          v = v.toISOString();
        }
        
        if (k === "Start Date From") {
          const toValue = values["Start Date To"];
          const formattedTo = toValue instanceof Date && !isNaN(toValue) 
            ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(toValue)
            : '';
          chips.push({ label: "Start Date", value: `${displayValue} - ${formattedTo}` });
          appliedFiltersSummaryParts.push(`Start Date: ${displayValue} - ${formattedTo}`);
        } else if (k === "End Date From") {
          const toValue = values["End Date To"];
          const formattedTo = toValue instanceof Date && !isNaN(toValue) 
            ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(toValue)
            : '';
          chips.push({ label: "End Date", value: `${displayValue} - ${formattedTo}` });
          appliedFiltersSummaryParts.push(`End Date: ${displayValue} - ${formattedTo}`);
        } else if (k !== "Start Date To" && k !== "End Date To") {
          chips.push({ label: k, value: displayValue });
          appliedFiltersSummaryParts.push(`${k}: ${displayValue}`);
        }
        
        searchValues.push(v);
      }
    });
    
    const baseUrl = "users-tots";
    const searchData = { searchFields, searchValues };
    await searchOperationTab(baseUrl, searchData);
    await localStorage.setItem("prevSearchedPropsAndValues", JSON.stringify({ baseUrl, searchData }));
    
    setPersistentFilterValues(values);
    setAppliedFilters(chips);
    
    if (appliedFiltersSummaryParts.length > 0) {
      setAppliedFiltersSummary("Multiple Filter Applied: " + appliedFiltersSummaryParts.join(", "));
      setShowAppliedFilterMessage(true);
    } else {
      setAppliedFiltersSummary("");
      setShowAppliedFilterMessage(false);
    }
    
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
                    <button key={f} type="button" className={`chip ${activeFilters.includes(f) ? "active" : ""}`} onClick={() => toggleFilter(f, formik)}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className="filter-inputs">
                  {activeFilters.map((f) => {
                    switch (f) {
                      case "City":
                        return (
                          <div key={f}>
                            <label>City</label>
                            <Select
                              options={cityOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("City", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select City..."
                              isClearable isSearchable
                              value={formik.values["City"] ? { label: formik.values["City"], value: formik.values["City"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Project Name":
                        return (
                          <div key={f}>
                            <label>Project Name</label>
                            <Select
                              options={projectNameOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("Project Name", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Project..."
                              isClearable isSearchable
                              value={formik.values["Project Name"] ? { label: formik.values["Project Name"], value: formik.values["Project Name"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Project Department":
                        return (
                          <div key={f}>
                            <label>Project Department</label>
                            <Select
                              options={partnerDeptOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("Project Department", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Department..."
                              isClearable isSearchable
                              value={formik.values["Project Department"] ? { label: formik.values["Project Department"], value: formik.values["Project Department"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "State":
                        return (
                          <div key={f}>
                            <label>State</label>
                            <Select
                              options={stateOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("State", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select State..."
                              isClearable isSearchable
                              value={formik.values["State"] ? { label: formik.values["State"], value: formik.values["State"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Project Type":
                        return (
                          <div key={f}>
                            <label>Project Type</label>
                            <Select
                              options={projectTypeOptions}
                              onChange={(sel) => handleChange("Project Type", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Type..."
                              isClearable isSearchable
                              value={formik.values["Project Type"] ? { label: formik.values["Project Type"], value: formik.values["Project Type"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Facilitator 1":
                        return (
                          <div key={f}>
                            <label>Facilitator 1</label>
                            <Select
                              options={facilitator1Options.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("Facilitator 1", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Facilitator 1..."
                              isClearable isSearchable
                              value={formik.values["Facilitator 1"] ? { label: formik.values["Facilitator 1"], value: formik.values["Facilitator 1"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Facilitator 2":
                        return (
                          <div key={f}>
                            <label>Facilitator 2</label>
                            <Select
                              options={facilitator2Options.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("Facilitator 2", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Facilitator 2..."
                              isClearable isSearchable
                              value={formik.values["Facilitator 2"] ? { label: formik.values["Facilitator 2"], value: formik.values["Facilitator 2"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Gender":
                        return (
                          <div key={f}>
                            <label>Gender</label>
                            <Select
                              options={genderOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("Gender", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Gender..."
                              isClearable isSearchable
                              value={formik.values["Gender"] ? { label: formik.values["Gender"], value: formik.values["Gender"] } : null}
                              styles={{ container:(base)=>({ ...base, width:"300px" }) }}
                            />
                          </div>
                        );
                      case "Participant Name":
                        return (
                          <div key={f}>
                            <label>Participant Name</label>
                            <Select
                              options={participantOptions.map(opt => ({ label: opt.label || opt.value, value: opt.value || opt.label }))}
                              onChange={(sel) => handleChange("Participant Name", sel?.value, formik.setFieldValue, formik.values)}
                              placeholder="Select Participant..."
                              isClearable isSearchable
                              value={formik.values["Participant Name"] ? { label: formik.values["Participant Name"], value: formik.values["Participant Name"] } : null}
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
                      default:
                        return null;
                    }
                  })}
                </div>
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

export default FilterBox;
