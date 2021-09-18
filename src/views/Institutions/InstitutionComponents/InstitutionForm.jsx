import { Formik, FieldArray, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";

import { Input } from "../../../utils/Form";
import { InstituteValidations } from "../../../validations";
import { getInstitutionsPickList, getAssigneeOptions } from "./instituteActions";
import { urlPath } from "../../../constants";

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

const InstitutionForm = (props) => {
  let { onHide, show } = props;
  const [institutionTypeOpts, setInstitutionTypeOpts] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    getInstitutionsPickList().then(data => {
      setInstitutionTypeOpts(data.type.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value.toLowerCase(),
        };
      }));
      setStatusOpts(data.status.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value.toLowerCase(),
        };
      }));
    });

    getAssigneeOptions().then(data => {
      setAssigneeOptions(data?.data?.data?.users.map((assignee) => ({
          key: assignee.username,
          label: assignee.username,
          value: assignee.id,
      })));
    });
  }, []);

  const onSubmit = async (values) => {
    if (logo) {
      values.logo = logo;
    }
    onHide(values);
  };

  const logoUploadHandler = ({ id }) => setLogo(id);

  let initialValues = {
    name: '',
    type:'',
    email:'',
    phone:'',
    status:'',
    address:'',
    assigned_to:'',
    state:'',
    pin_code:'',
    city:'',
    medha_area:'',
  };

  if (props.id) {
    initialValues = {...props}
    initialValues['assigned_to'] = props?.assigned_to?.id;
  }

  if (!props.contacts) {
    // create an empty contact if no contacts are present
    initialValues['contacts'] = [];
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
            <img src={urlPath(props.logo.url)} className="avatar mr-2" alt="Institution Logo" />
          ) : (
          <div className="flex-row-centered avatar avatar-default mr-2">
            <FaSchool size={25} />
          </div>
          )}
          <h1 className="text--primary bebas-thick mb-0">
            {props.id ? props.name : 'Add New Institute'}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={InstituteValidations}
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
                      required
                      control="input"
                      placeholder="Name"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="phone"
                      label="Phone"
                      required
                      control="input"
                      placeholder="Phone"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      type="email"
                      name="email"
                      label="Email"
                      required
                      control="input"
                      placeholder="Email"
                      className="form-control"
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
                    {assigneeOptions.length ? (
                      <Input
                        control="lookup"
                        name="assigned_to"
                        label="Assigned To"
                        required
                        options={assigneeOptions}
                        className="form-control"
                        placeholder="Assigned To"
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {statusOpts.length ? (
                      <Input
                        icon="down"
                        control="lookup"
                        name="status"
                        label="Status"
                        required
                        options={statusOpts}
                        className="form-control"
                        placeholder="Status"
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {institutionTypeOpts.length ? (
                      <Input
                        icon="down"
                        control="lookup"
                        name="type"
                        label="Type"
                        required
                        options={institutionTypeOpts}
                        className="form-control"
                        placeholder="Type"
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
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
                      required
                      name="address"
                      placeholder="Address"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="state"
                      label="State"
                      required
                      control="input"
                      placeholder="State"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="medha_area"
                      label="Medha Area"
                      required
                      className="form-control"
                      placeholder="Medha Area"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="pin_code"
                      label="Pin Code"
                      required
                      placeholder="Pin Code"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="city"
                      label="City"
                      required
                      placeholder="City"
                      className="form-control"
                    />
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
                              required
                              placeholder="Name"
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.email`}
                              label="Email"
                              required
                              control="input"
                              placeholder="Email"
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.phone`}
                              control="input"
                              label="Phone Number"
                              required
                              className="form-control"
                              placeholder="Phone Number"
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.designation`}
                              control="input"
                              label="Designation"
                              required
                              className="form-control"
                              placeholder="Designation"
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
                          })
                        }}>
                          Add Contact
                        </button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Section>
              <div className="row mt-3 py-3">
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

export default InstitutionForm;
