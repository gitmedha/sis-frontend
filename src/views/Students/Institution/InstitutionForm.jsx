import { Formik, FieldArray, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { InstituteValidations } from "../../../validations";
import { getInstitutionsPickList, getAssigneeOptions } from "./instituteActions";
import ImageUploader from "../../../components/content/ImageUploader";

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
          value: item.value,
        };
      }));
      setStatusOpts(data.status.map((item) => {
        return {
          key: item.value,
          value: item.value,
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

  let initialValues = {...props};
  initialValues['assigned_to'] = props?.assigned_to?.id;
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
      <Modal.Header className="bg-modal">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          {props.id ? 'Update' : 'Add New'} Institute
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-modal">
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
                  <div className="col-12 mb-2">
                    <ImageUploader handler={logoUploadHandler} initialValue={props.id ? props.logo : {}} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="name"
                      label="Name"
                      control="input"
                      placeholder="Name"
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
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      type="email"
                      name="email"
                      label="Email"
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
                        options={assigneeOptions}
                        className="form-control"
                        placeholder="Assigned To"
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="status"
                      label="Status"
                      control="radio"
                      options={statusOpts}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="type"
                      label="Type"
                      control="radio"
                      className="form-control"
                      options={institutionTypeOpts}
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
                      name="address[address_line]"
                      placeholder="Address"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="address[state]"
                      label="State"
                      control="input"
                      placeholder="State"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="address[medha_area]"
                      label="Medha Area"
                      className="form-control"
                      placeholder="Medha Area"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="address[pin_code]"
                      label="Pin Code"
                      placeholder="Pin Code"
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
                              placeholder="Name"
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.email`}
                              label="Email"
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
                              className="form-control"
                              placeholder="Phone Number"
                            />
                          </div>
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              name={`contacts.${index}.designation`}
                              control="input"
                              label="Designation"
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
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-secondary btn-regular mr-2"
                  >
                    CLOSE
                  </button>
                  <div style={{ width: "20px" }} />
                  <button className="btn btn-primary btn-regular" type="submit">
                    {props.id ? 'UPDATE' : 'ADD NEW'} INSTITUTION
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
