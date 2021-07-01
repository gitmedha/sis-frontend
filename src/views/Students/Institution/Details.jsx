import { useState } from "react";
import nProgress from "nprogress";
import { Modal } from "react-bootstrap";
import { queryBuilder } from "./instituteActions";
import { Form, Input } from "../../../utils/Form";
import Badge from "../../../components/content/Badge";
import { UPADTE_INSTITUTIONS } from "../../../graphql";
import { InstituteValidations } from "../../../validations";

const UpdateInstituteDetails = (props) => {
  let { onHide, show, logo, id, ...rest } = props;

  const institutionTypeOpts = [
    { key: "Private", value: "private" },
    { key: "Government", value: "governmnet" },
    { key: "ITI", value: "iti" },
  ];

  const onSubmit = (data) => onHide(data);

  const statusOpts = [
    { key: "Active", value: "active" },
    { key: "Inactive", value: "inactive" },
  ];

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
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
          initialValues={rest}
          validationSchema={InstituteValidations}
        >
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
  const { name, phone, assigned_to, website, email, status, type, done, id } =
    props;

  const [modalShow, setModalShow] = useState(false);

  const hideUpdateModal = async (data) => {
    console.log("PAYLOAD", data);

    if (data.isTrusted) {
      setModalShow(false);
      return;
    }

    delete data["logo"];
    delete data["assigned_to"];

    nProgress.start();
    try {
      let resp = await queryBuilder({
        query: UPADTE_INSTITUTIONS,
        variables: {
          id: Number(id),
          data,
        },
      });

      console.log(resp, "DETAILS_UPDATE_RESPOSE");
    } catch (err) {
      console.log("UPDATE_DETAILS_ERR", err);
    } finally {
      nProgress.done();
      done();
    }
    setModalShow(false);
  };

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-md-4">
          <p className="text-heading text--md">Name</p>
          <p className="latto-regular">{name}</p>
        </div>
        <div className="col-md-4">
          <p className="text-heading text--md">Phone</p>
          <p className="latto-regular">{phone}</p>
        </div>
        <div className="col-md-4">
          <p className="text-heading text--md">Assigned To</p>
          <p className="latto-regular">{assigned_to?.username}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-heading text--md">Website</p>
          <a
            href={website}
            target="_blank"
            className="latto-regular"
            rel="noreferrer"
          >
            {website}
          </a>
        </div>
        <div className="col-md-4">
          <p className="text-heading text--md">Email</p>
          <a target="_blank" href={`mailto:${email}`} rel="noreferrer">
            {email}
          </a>
        </div>
        <div className="col-md-4">
          <p className="text-heading text--md">Status</p>
          <Badge type={status} text={status} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <p className="text-heading text--md">Type</p>
          <Badge type={type} text={type} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-3">
          <button
            onClick={() => setModalShow(true)}
            className="btn btn-primary btn-regular"
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

export default Details;
