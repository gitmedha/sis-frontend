import styled from "styled-components";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import nProgress from "nprogress";
import { Modal } from "react-bootstrap";
import { queryBuilder } from "./instituteActions";
import { Form, Input } from "../../../utils/Form";
import { Badge } from "../../../components/content/Utils";
import { UPDATE_INSTITUTION } from "../../../graphql";
import { InstituteValidations } from "../../../validations";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { getInstitutionsPickList } from "../../../utils/function/institutions";
import DetailField from "../../../components/content/DetailField";

const UpdateInstituteDetails = (props) => {
  console.log('all values', props);
  console.log('all contacts', props.contacts);
  let { onHide, show } = props;

  const institutionTypeOpts = [
    { key: "Private", value: "private" },
    { key: "Government", value: "government" },
    { key: "ITI", value: "iti" },
  ];

  const onSubmit = (data) => onHide(data);

  const statusOpts = [
    { key: "Active", value: "active" },
    { key: "Inactive", value: "inactive" },
  ];

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
      font-size: 18px;
      line-height: 22px;
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
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Update Institute
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <Form
          onSubmit={onSubmit}
          initialValues={props}
          validationSchema={InstituteValidations}
        >
          <Section>
            <h3 className="section-header">Details</h3>
            <div className="row">
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="name"
                  label="Name"
                  control="input"
                  placeholder="Name"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="phone"
                  label="Phone"
                  control="input"
                  placeholder="Phone"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  control="input"
                  placeholder="Email"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="website"
                  control="input"
                  label="Website"
                  placeholder="Website"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="status"
                  label="Status"
                  control="radio"
                  options={statusOpts}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
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
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  control="input"
                  label="Address"
                  name="address[address_line]"
                  placeholder="Address"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="address[state]"
                  label="State"
                  control="input"
                  placeholder="State"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  control="input"
                  name="address[medha_area]"
                  label="Medha Area"
                  className="form-control"
                  placeholder="Medha Area"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
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
            {props.contacts && props.contacts.length && props.contacts.map((contact, index) => (
              <div className="row mb-4">
                <div className="col-md-6 col-sm-12 mt-2">
                  <Input
                    control="input"
                    name={`contacts[${index}][full_name]`}
                    label="Name"
                    placeholder="Name"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <Input
                    name={`contacts[${index}][email]`}
                    label="Email"
                    control="input"
                    placeholder="Email"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <Input
                    name={`contacts[${index}][phone]`}
                    control="input"
                    label="Phone Number"
                    className="form-control"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <Input
                    name={`contacts[${index}][designation]`}
                    control="input"
                    label="Designation"
                    className="form-control"
                    placeholder="Designation"
                  />
                </div>
              </div>
            ))}
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

const Details = (props) => {
  const {
    name,
    phone,
    assigned_to,
    website,
    email,
    status,
    type,
    done,
    id,
    setAlert,
  } = props;
  console.log('details props', props);

  const [modalShow, setModalShow] = useState(false);
  const [pickList, setPickList] = useState([]);

  const hideUpdateModal = async (data) => {
    console.log("PAYLOAD", data);

    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    delete data["id"];
    delete data["show"];
    delete data["logo"];
    delete data["assigned_to"];

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

  useEffect(() => {
    getInstitutionsPickList().then(data => {
      setPickList(data);
    });
  }, [])

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-md-4">
          <DetailField label="Name" value={name} />
          <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
          <DetailField label="Phone number" value={phone} />
          <DetailField label="Website" value={<a href={website} target="_blank" rel="noreferrer" className="latto-regular">{website}</a>} />
        </div>
        <div className="offset-md-2 col-md-4">
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} />
          <DetailField label="Assigned To" value={assigned_to?.username} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-3">
          <button
            onClick={() => setModalShow(true)}
            style={{ marginLeft: "0px" }}
            className="btn--primary"
          >
            EDIT
          </button>
        </div>
      </div>
      <UpdateInstituteDetails
        {...props}
        show={modalShow}
        type={"governmnet"}
        onHide={hideUpdateModal}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Details);
