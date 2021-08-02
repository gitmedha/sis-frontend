import nProgress from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { connect } from "react-redux";
import { Formik, FieldArray, Form } from 'formik';
import SweetAlert from "react-bootstrap-sweetalert";

import api from "../../apis";
import Address from "./Institution/Address";
import Contacts from "./Institution/Contacts";
import Details from "./Institution/Details";
import { GET_INSTITUTE, UPDATE_INSTITUTION, DELETE_INSTITUTION } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import { Input } from "../../utils/Form";
import { InstituteValidations } from "../../validations";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { queryBuilder, getInstitutionsPickList } from "./Institution/instituteActions";

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

const UpdateInstituteDetails = (props) => {
  let { onHide, show } = props;
  const [institutionTypeOpts, setInstitutionTypeOpts] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);

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
  }, []);

  const onSubmit = async (values) => {
    onHide(values);
  };

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
          Update Institute
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-modal">
        <Formik
          onSubmit={onSubmit}
          initialValues={props}
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
                    UPDATE INSTITUTION
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


const Institute = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [instituteData, setInstituteData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const {setAlert} = props;
  const { address, contacts, ...rest } = instituteData;

  const hideUpdateModal = async (data) => {
    console.log("PAYLOAD", data);

    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove id, show, logo, assigned_to from the payload
    let {id, show, logo, assigned_to, ...dataToSave} = data;

    nProgress.start();
    try {
      await queryBuilder({
        query: UPDATE_INSTITUTION,
        variables: {
          id: Number(id),
          data: dataToSave,
        },
      });
      setAlert("Institution updated successfully.", "success");
    } catch (err) {
      console.log("UPDATE_DETAILS_ERR", err);
      setAlert("Unable to update institution.", "error");
    } finally {
      nProgress.done();
      done();
    }
    setModalShow(false);
  };

  const handleDelete = async () => {
    nProgress.start();
    try {
      let data = await queryBuilder({
        query: DELETE_INSTITUTION,
        variables: {
          id: instituteData.id,
        },
      });
      console.log("INSTITUTION_DELETED", data);
      setAlert("Institution deleted successfully.", "success");
    } catch (err) {
      console.log("INSTITUTION_DELETE_ERR", err);
      setAlert("Unable to delete institution.", "error");
    } finally {
      setShowDeleteAlert(false);
      nProgress.done();
      history.push("/institutions");
    }
  };

  const getThisInstitute = async () => {
    setLoading(true);
    nProgress.start();
    try {
      const instituteID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_INSTITUTE,
        variables: { id: instituteID },
      });
      setInstituteData(data.data.institution);
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
      nProgress.done();
    }
  };

  const done = () => getThisInstitute();

  useEffect(() => {
    getThisInstitute();
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <>
        <Collapsible
          opened={true}
          titleContent={
            <TitleWithLogo
              done={done}
              id={rest.id}
              logo={rest.logo}
              title={rest.name}
              query={UPDATE_INSTITUTION}
            />
          }
        >
          <Details {...instituteData} />
        </Collapsible>
        <div className="row" style={{padding: '0 30px', marginBottom: '30px'}}>
          <div className="col-12">
            <button
              onClick={() => setModalShow(true)}
              style={{ marginLeft: "0px" }}
              className="btn--primary"
            >
              EDIT
            </button>
            <button onClick={() => setShowDeleteAlert(true)} className="btn--primary">
              DELETE
            </button>
          </div>
        </div>
        <Collapsible title="Address">
          <Address {...address} id={rest.id} />
        </Collapsible>
        <Collapsible title="Contacts">
          <Contacts contacts={contacts} id={rest.id} />
        </Collapsible>
        <UpdateInstituteDetails
          {...instituteData}
          show={modalShow}
          onHide={hideUpdateModal}
        />
        <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete {instituteData.name}?</span>
          }
          customButtons={
            <>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete()} className="btn btn-danger mx-2 px-4">
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure, you want to delete this institution?</p>
        </SweetAlert>
      </>
    );
  }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Institute);
