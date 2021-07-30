import NP from "nprogress";
import api from "../../apis";
import { useState, useEffect } from "react";
import Details from "./Institution/Details";
import Address from "./Institution/Address";
import { GET_INSTITUTE } from "../../graphql";
import Contacts from "./Institution/Contacts";
import { UPDATE_INSTITUTION } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";

import { Modal } from "react-bootstrap";
import { Form, Input } from "../../utils/Form";
import { InstituteValidations } from "../../validations";
import nProgress from "nprogress";
import { queryBuilder } from "./Institution/instituteActions";
import { setAlert } from "../../store/reducers/Notifications/actions";
import styled from "styled-components";
import { connect } from "react-redux";
import { getInstitutionsPickList } from "./Institution/instituteActions";

const UpdateInstituteDetails = (props) => {
  let { onHide, show } = props;
  const [institutionTypeOpts, setInstitutionTypeOpts] = useState([]);
  const [statusOpts, setStatusOpts] = useState([]);
  const [instituteContacts, setInstituteContacts] = useState(props.contacts || []);

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

  const onSubmit = (data) => onHide(data);

  const addContact = () => {
    const newContact = {
      name: "",
      email: "",
      phone: "",
      type: "",
    };
    setInstituteContacts([
      ...instituteContacts,
      newContact,
    ]);
  }

  const deleteContact = (index) => {
    instituteContacts.splice(index, 1);
    setInstituteContacts([...instituteContacts]);
  }

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
        <Form
          onSubmit={onSubmit}
          initialValues={props}
          validationSchema={InstituteValidations}
        >
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
            {instituteContacts.length && instituteContacts.map((contact, index) => (
              <div key={index} className="row py-2 mx-0 mb-3 border bg-white shadow-sm rounded">
                <div className="col-md-6 col-sm-12 mb-2">
                  <Input
                    control="input"
                    name={`contacts[${index}][full_name]`}
                    label="Name"
                    placeholder="Name"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Input
                    name={`contacts[${index}][email]`}
                    label="Email"
                    control="input"
                    placeholder="Email"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Input
                    name={`contacts[${index}][phone]`}
                    control="input"
                    label="Phone Number"
                    className="form-control"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <Input
                    name={`contacts[${index}][designation]`}
                    control="input"
                    label="Designation"
                    className="form-control"
                    placeholder="Designation"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-2">
                  <button className="btn btn-danger btn-sm" onClick={() => deleteContact(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-2">
              <button className="btn btn-primary btn-sm" onClick={() => addContact()}>
                Add Contact
              </button>
            </div>
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
      </Modal.Body>
    </Modal>
  );
};


const Institute = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [instituteData, setInstituteData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const {setAlert} = props;
  const { address, contacts, ...rest } = instituteData;

  const hideUpdateModal = async (data) => {
    console.log("PAYLOAD", data);

    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    console.log('before Quering');
    const id = data['id'];
    console.log('data id', data['id']);
    console.log(typeof data);

    delete data['id'];
    delete data['show'];
    delete data["logo"];
    delete data["assigned_to"];

    console.log('Quering');

    nProgress.start();
    try {
      await queryBuilder({
        query: UPDATE_INSTITUTION,
        variables: {
          id: Number(id),
          data,
        },
      });
      setAlert("Institution details updated successfully.", "success");
    } catch (err) {
      console.log("UPDATE_DETAILS_ERR", err);
      setAlert("Unable to update instition details.", "error");
    } finally {
      nProgress.done();
      done();
    }
    setModalShow(false);
  };

  const getThisInstitute = async () => {
    setLoading(true);
    NP.start();
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
      NP.done();
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
      </>
    );
  }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Institute);
