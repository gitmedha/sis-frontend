import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../../utils/Form";
import DetailField from "../../../../components/content/DetailField";
import moment from "moment";
import { updatePmusEntry } from "../actions";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import * as Yup from "yup";
import Select from "react-select";
import { getAllMedhaUsers } from "../../../../utils/function/lookupOptions";

const Section = styled.div`
  padding-top: 30px;
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

const FormControlStyles = styled.div`
  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: inline-block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-control, .select__control {
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    min-height: 38px;
    height: 38px;
    
    &:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }

  .error-border {
    border-color: #dc3545 !important;
  }

  .select__control--is-focused {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  }

  .select__menu {
    z-index: 9999;
  }
`;

const customSelectStyles = {
  control: (base) => ({
    ...base,
    minHeight: '38px',
    height: '38px',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '4px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    margin: 0,
  }),
};

const PmusEdit = (props) => {
  const { onHide, show, refreshTableOnDataSaving } = props;
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);
  const [classValue, setClassValue] = useState({});
  const userId = localStorage.getItem("user_id");
  
  const stateOptions = [
    "Uttar Pradesh", "Delhi", "Haryana", "Uttarakhand", "Bihar"
  ].map(state => ({ label: state, value: state }));

  const onSubmit = async (values) => {
    setDisableSaveButton(true);
    const formattedValues = { 
      ...values,
      year: moment(values.year).format("YYYY-MM-DD")
    };

    try {
      const response = await updatePmusEntry(Number(props.id), formattedValues);
      if ((Array.isArray(response) && response.length > 0) || (response && response.status === 200)) {
        setAlert("PMU entry updated successfully", "success");
        if (typeof refreshTableOnDataSaving === "function") {
          await refreshTableOnDataSaving();
        }
        if (typeof onHide === "function") {
          onHide(response);
        }
      } else {
        setAlert("Failed to update PMU entry", "danger");
      }
    } catch (error) {
      setAlert("An error occurred while updating", "danger");
    } finally {
      setDisableSaveButton(false);
    }
  };

  let initialValues = {
    year: "",
    pmu: "",
    State: "",
    medha_poc: ""
  };

  if (props) {
    initialValues = {
      year: props.year ? new Date(props.year) : "",
      pmu: props.pmu || "",
      State: props.State || "",
      medha_poc: props.medha_poc || ""
    };
  }

  const validationSchema = Yup.object().shape({
    year: Yup.date().required("Year is required"),
    pmu: Yup.string().required("PMU name is required"),
    State: Yup.string().required("State is required"),
    medha_poc: Yup.string().required("Medha POC is required")
  });

  const getSelectClass = (field) => {
    return classValue[field] ? "error-border" : "";
  };

  const getSelectedOption = (options, value) => {
    return options.find(option => option.value === value);
  };

  useEffect(() => {
    const fetchMedhaPocs = async () => {
      const data = await getAllMedhaUsers();
      setMedhaPocOptions(data.map(user => ({ label: user.name, value: user.id })));
    };
    fetchMedhaPocs();
  }, []);

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">
            Edit PMU Entry
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <FormControlStyles>
                <Section>
                  <h3 className="section-header">PMU Information</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-3">
                      <Input
                        name="year"
                        label="Year *"
                        required
                        placeholder="Select year"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        showYearPicker
                        dateFormat="yyyy"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <Input
                        control="input"
                        name="pmu"
                        label="PMU Name *"
                        required
                        className="form-control"
                        placeholder="Enter PMU name"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <div className="form-group">
                        <label>State *</label>
                        <Select
                          styles={customSelectStyles}
                          className={`${getSelectClass("State")}`}
                          classNamePrefix="select"
                          name="State"
                          options={stateOptions}
                          value={getSelectedOption(stateOptions, values.State)}
                          onChange={(selectedOption) => 
                            setFieldValue("State", selectedOption?.value || "")
                          }
                          isClearable={true}
                          placeholder="Select state"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <div className="form-group">
                        <label>Medha POC *</label>
                        <Select
                          styles={customSelectStyles}
                          className={`${getSelectClass("medha_poc")}`}
                          classNamePrefix="select"
                          name="medha_poc"
                          options={medhaPocOptions}
                          value={medhaPocOptions.find(option => 
                            option.value === (values.medha_poc?.id || values.medha_poc)
                          )}
                          onChange={(selectedOption) => {
                            setFieldValue("medha_poc", selectedOption?.value || "");
                          }}
                          isClearable={true}
                          placeholder="Select Medha POC"
                        />
                      </div>
                    </div>
                  </div>
                </Section>

                <Section>
                  <h3 className="section-header">System Information</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      <DetailField
                        label="Created By"
                        value={props.createdby?.username || "Not available"}
                      />
                      <DetailField
                        label="Created At"
                        value={
                          props.created_at
                            ? moment(props.created_at).format("DD MMM YYYY, h:mm a")
                            : "Not available"
                        }
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <DetailField
                        label="Updated By"
                        value={props.updatedby?.username || "Not available"}
                      />
                      <DetailField
                        label="Updated At"
                        value={
                          props.updated_at
                            ? moment(props.updated_at).format("DD MMM YYYY, h:mm a")
                            : "Not available"
                        }
                      />
                    </div>
                  </div>
                </Section>

                <div className="row justify-content-end mt-4">
                  <div className="col-auto">
                    <button
                      type="button"
                      onClick={onHide}
                      className="btn btn-secondary btn-regular mr-2"
                    >
                      CANCEL
                    </button>
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn btn-primary btn-regular"
                      disabled={disableSaveButton}
                      onClick={()=>onSubmit(values)}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </FormControlStyles>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default PmusEdit;