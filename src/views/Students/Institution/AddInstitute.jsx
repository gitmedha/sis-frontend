import NP from "nprogress";
import {
  ContactValidations,
  NewInstituteValidations,
} from "../../../validations";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Form, Input } from "../../../utils/Form";
import { queryBuilder } from "./instituteActions";
import ImageUploader from "../../../components/content/ImageUploader";
import { CREATE_NEW_INSTITUTE, GET_ASSIGNEES_LIST } from "../../../graphql";
import Skeleton from "react-loading-skeleton";

const AddNewInstitute = () => {
  const [logo, setLogo] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [assigneeOpts, setAssignees] = useState([]);
  // const [isLoading, setLoading] = useState(false);
  const [modalContactShow, setModalContactShow] = useState(false);

  const statusOpts = [
    { key: "Active", value: "active" },
    { key: "In Active", value: "inactive" },
  ];

  const institutionTypeOpts = [
    { key: "Private", value: "private" },
    { key: "Government", value: "government" },
    { key: "ITI", value: "iti" },
  ];

  const instituteData = {
    name: "",
    type: "",
    email: "",
    phone: "",
    status: "",
    state: "",
    website: "",
    pin_code: "",
    medha_area: "",
    address_line: "",
    assigned_to: "",
  };

  const getAssignees = async () => {
    let data = await queryBuilder({
      query: GET_ASSIGNEES_LIST,
    });

    let newAssignees = data.data.users.map((assignee) => ({
      key: assignee.username,
      label: assignee.username,
      value: Number(assignee.id),
    }));

    setAssignees(newAssignees);
  };

  const onSubmit = async (data) => {
    // setLoading(true);
    NP.start();
    try {
      let payload = {
        ...data,
        address: {
          state: data.state,
          pin_code: data.pin_code,
          medha_area: data.medha_area,
          address_line: data.address_line,
        },
      };

      if (logo) {
        payload.logo = logo;
      }

      let resp = await queryBuilder({
        query: CREATE_NEW_INSTITUTE,
        variables: { ...payload, contacts },
      });
      console.log(resp);
    } catch (err) {
      console.log("ERR_ADD", err);
    } finally {
      // setLoading(false);
      NP.done();
    }
  };

  useEffect(() => {
    getAssignees();
  }, []);

  const hideContactModal = (data) => {
    if (data.isTrusted) {
      setModalContactShow(false);
      return;
    }
    setContacts([...contacts, data]);
    setModalContactShow(false);
  };

  const logoUploadHandler = ({ id }) => setLogo(id);

  return (
    <div className="card">
      <div className="card-header bg-white py-2 mt-2">
        <h1 className="bebas-thick text--primary">Add New Institution</h1>
      </div>
      <div className="card-body py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <ImageUploader handler={logoUploadHandler} />
            </div>
          </div>
          <Form
            onSubmit={onSubmit}
            initialValues={instituteData}
            validationSchema={NewInstituteValidations}
          >
            <div className="row">
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="name"
                  control="input"
                  label="Institution Name"
                  className="form-control"
                  placeholder="Institution Name"
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
                  name="email"
                  type="email"
                  label="Email"
                  control="input"
                  placeholder="Email"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="website"
                  label="Website"
                  control="input"
                  placeholder="Wesbite"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {assigneeOpts.length ? (
                  <Input
                    control="lookup"
                    name="assigned_to"
                    label="Assigned To"
                    options={assigneeOpts}
                    className="form-control"
                    placeholder="Assigned To"
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="status"
                  label="Status"
                  control="radio"
                  options={statusOpts}
                  placeholder="Status"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="type"
                  control="radio"
                  placeholder="Type"
                  label="College Type"
                  className="form-control"
                  options={institutionTypeOpts}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  control="input"
                  label="Address"
                  name="address_line"
                  placeholder="Address"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="state"
                  label="State"
                  control="input"
                  placeholder="State"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  control="input"
                  name="medha_area"
                  label="Medha Area"
                  className="form-control"
                  placeholder="Medha Area"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  control="input"
                  name="pin_code"
                  label="Pin Code"
                  placeholder="Pin Code"
                  className="form-control"
                />
              </div>
            </div>
            <div className="d-flex mt-2 py-4">
              <button
                type="button"
                className="btn--secondary"
                style={{ marginLeft: "0px" }}
                onClick={() => setModalContactShow(true)}
              >
                ADD CONTACT
              </button>
            </div>
            <button
              type="submit"
              className="btn--primary mt-3"
              style={{ marginLeft: "0px" }}
            >
              ADD INSTITUTION
            </button>
          </Form>
        </div>
      </div>
      <ContactModal show={modalContactShow} onHide={hideContactModal} />
    </div>
  );
};

const ContactModal = (props) => {
  let { onHide } = props;

  const newContact = {
    phone: "",
    email: "",
    full_name: "",
    designation: "",
  };

  const onSubmit = (data) => onHide(data);

  return (
    <Modal
      {...props}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Add New Contact
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <Form
          onSubmit={onSubmit}
          initialValues={newContact}
          validationSchema={ContactValidations}
        >
          <div className="row">
            <div className="col-md-6 col-sm-12 mt-2">
              <Input
                control="input"
                label="Name"
                name="full_name"
                placeholder="Name"
                className="form-control"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-2">
              <Input
                name="email"
                label="Email"
                control="input"
                placeholder="Email"
                className="form-control"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-2">
              <Input
                name="phone"
                control="input"
                label="Phone Number"
                className="form-control"
                placeholder="Phone Number"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-2">
              <Input
                control="input"
                name="designation"
                label="Designation"
                className="form-control"
                placeholder="Designation"
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
                Add New Contact
              </button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewInstitute;
