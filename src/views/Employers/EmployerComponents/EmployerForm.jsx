import { Formik, FieldArray, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";

import { Input } from "../../../utils/Form";
import { EmployerValidations } from "../../../validations";
import  {getEmployersPickList, getAssigneeOptions} from "./employerAction";
import { urlPath } from "../../../constants";
import { getAddressOptions , getStateDistricts }  from "../../Address/addressActions";
import { filterAssignedTo, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { yesOrNoOptions } from "../../../common/commonConstants";

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const EmployerForm = (props) => {
  let { onHide, show } = props;
  const [industryOptions, setIndustryOptions] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);
  const [employerTypeOpts, setEmployerTypeOpts] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [logo, setLogo] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    getDefaultAssigneeOptions().then(data => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    getEmployersPickList().then(data => {
      setStatusOpts(data.status.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));

      setIndustryOptions(data.industry.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));
    });

    getAddressOptions().then(data => {
      setStateOptions(data?.data?.data?.geographiesConnection.groupBy.state.map((state) => ({
        key: state.id,
        label: state.key,
        value: state.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));

      if (props.state) {
        onStateChange({
          value: props.state,
        });
      }
    });

  }, [props]);

  const onStateChange = value => {
    setDistrictOptions([]);
    getStateDistricts(value).then(data => {
      setDistrictOptions(data?.data?.data?.geographiesConnection.groupBy.district.map((district) => ({
        key: district.id,
        label: district.key,
        value: district.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
      setAreaOptions([]);
      setAreaOptions(data?.data?.data?.geographiesConnection.groupBy.area.map((area) => ({
        key: area.id,
        label: area.key,
        value: area.key,
      })));
    });
  };

  const onSubmit = async (values) => {
    setFormValues(values);
    if (logo) {
      values.logo = logo;
    }
    onHide(values);
  };
  const logoUploadHandler = ({ id }) => setLogo(id);

  let initialValues = {
    name: "",
    industry:"",
    email:"",
    phone:"",
    status:"active",
    address:"",
    assigned_to:userId.toString(),
    state:"",
    pin_code:"",
    city:"",
    medha_area:"",
    district:"",
  };

  if (props.id) {
    initialValues = {...props};
    initialValues["assigned_to"] = props?.assigned_to?.id;
    initialValues["district"] = props.district ? props.district: null ;
    initialValues["medha_area"] = props.medha_area ? props.medha_area: null ;
  }

  if (!props.contacts) {
    // create an empty contact if no contacts are present
    initialValues["contacts"] = [];
  }

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
          {props.id && props.logo ? (
            <img src={urlPath(props.logo.url)} className="avatar mr-2" alt="Employer Avatar" />
          ) : (
          <div className="flex-row-centered avatar avatar-default mr-2">
            <FaSchool size={25} />
          </div>
          )}
          <h1 className="text--primary bebas-thick mb-0">
            {props.id ? props.name : "Add New Employer"}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
         onSubmit={onSubmit}
         initialValues={initialValues}
         validationSchema={EmployerValidations}
        >
          {({ values }) => (
            <Form>
              <Section>
                <h3 className="section-header">Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="name"
                      label="Name"
                      control="input"
                      placeholder="Name"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {assigneeOptions.length ? (
                      <Input
                        control="lookupAsync"
                        name="assigned_to"
                        label="Assigned To"
                        filterData={filterAssignedTo}
                        defaultOptions={assigneeOptions}
                        className="form-control"
                        placeholder="Assigned To"
                        required
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="industry"
                      label="Industry"
                      control="lookup"
                      options={industryOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="status"
                      label="Status"
                      control="lookup"
                      options={statusOpts}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="website"
                      control="input"
                      label="Website"
                      placeholder="Website"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="phone"
                      label="Phone"
                      control="input"
                      placeholder="Phone"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="email"
                      label="Email"
                      control="input"
                      placeholder="Email"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Address</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      label="Address"
                      name="address"
                      placeholder="Address"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="pin_code"
                      label="Pin Code"
                      placeholder="Pin Code"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="city"
                      label="City"
                      className="form-control"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                  {areaOptions.length ? (
                    <Input
                      icon="down"
                      control="lookup"
                      name="medha_area"
                      label="Medha Area"
                      className="form-control"
                      placeholder="Medha Area"
                      required
                      options={areaOptions}
                    />
                    ) : (
                      <>
                        <label className="text-heading" style={{color: "#787B96"}}>Please select State to view Medha Areas</label>
                        <Skeleton count={1} height={35} />
                      </>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                  {districtOptions.length ? (
                    <Input
                      icon="down"
                      control="lookup"
                      name="district"
                      label="District"
                      placeholder="District"
                      className="form-control"
                      required
                      options={districtOptions}
                    />
                     ) : (
                      <>
                        <label className="text-heading" style={{color: "#787B96"}}>Please select State to view Districts</label>
                        <Skeleton count={1} height={35} />
                      </>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                  {stateOptions.length ? (
                    <Input
                      icon="down"
                      name="state"
                      label="State"
                      control="lookup"
                      options={stateOptions}
                      onChange={onStateChange}
                      placeholder="State"
                      className="form-control"
                      required
                    />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Contacts</h3>
                <FieldArray name="contacts">
                  {({ insert, remove, push }) => (
                    <div>
                      {values.contacts && values.contacts.length > 0 && values.contacts.map((contact, index) => (
                        <div key={index} className="row py-2 mx-0 mb-3 border bg-white shadow-sm rounded">
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              control="input"
                              name={`contacts.${index}.full_name`}
                              label="Name"
                              placeholder="Name"
                              className="form-control"
                              required
                              />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.email`}
                              label="Email"
                              control="input"
                              placeholder="Email"
                              className="form-control"
                              required
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.phone`}
                              control="input"
                              label="Phone Number"
                              className="form-control"
                              placeholder="Phone Number"
                              required
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.designation`}
                              control="input"
                              label="Designation"
                              className="form-control"
                              placeholder="Designation"
                              required
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <button className="btn btn-danger btn-sm" type="button" onClick={() => remove(index)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-2">
                        <button className="btn btn-primary btn-sm" type="button" onClick={() => {
                          push({
                            full_name: "",
                            email: "",
                            phone: "",
                            designation: "",
                          });
                        }}>
                          Add Contact
                        </button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Section>
              <Section>
                <h3 className="section-header">Additional Info</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="paid_leaves"
                      label="Paid Leaves"
                      options={yesOrNoOptions}
                      className="form-control"
                      placeholder="Paid Leaves"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="employee_benefits"
                      label="Employee Benefits"
                      options={yesOrNoOptions}
                      className="form-control"
                      placeholder="Employee Benefits"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="employment_contract"
                      label="Employment Contract"
                      options={yesOrNoOptions}
                      className="form-control"
                      placeholder="Employment Contract"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="offer_letter"
                      label="Offer Letter"
                      options={yesOrNoOptions}
                      className="form-control"
                      placeholder="Offer Letter"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="medha_partner"
                      label="Medha Partner"
                      options={yesOrNoOptions}
                      className="form-control"
                      placeholder="Medha Partner"
                    />
                  </div>
                </div>
              </Section>
              <div className="row mt-3 py-3">
              <div className="col-12">
                  {props.errors ? props.errors.length !== 0 &&
                    <div className="alert alert-danger">
                      <span>There are some errors. Please resolve them and save again:</span>
                      <ul className="mb-0">
                        {props.errors.map((error, index) => (
                          <li key={index}>{error.message.toLowerCase() === "duplicate entry" ? `Employer with "${formValues.name}" already exists.` : error.message}</li>
                        ))}
                      </ul>
                    </div>
                   :null
                  }
                </div>
                <div className="d-flex justify-content-start">
                <button className="btn btn-primary btn-regular mx-0" type="submit">SAVE</button>
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-secondary btn-regular mr-2"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
              </Form>
              )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default EmployerForm;
