import { Form, Input } from "../../../utils/Form";
import NP from "nprogress";
import {
  AddressValidations,
  ContactValidations,
  NewInstituteValidations,
} from "../../../validations";
import { useState } from "react";
import { queryBuilder } from "./instituteActions";
import { CREATE_NEW_INSTITUTE } from "../../../graphql";
import { Modal } from "react-bootstrap";

const AddNewInstitute = () => {
  const [address, setAddress] = useState({});
  const [contacts, setContacts] = useState([]);
  const [modalContactShow, setModalContactShow] = useState(false);
  const [modalAddressShow, setModalAddressShow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const statusOpts = [
    { key: "Active", value: "active" },
    { key: "In Active", value: "inactive" },
  ];

  const institutionTypeOpts = [
    { key: "Private", value: "private" },
    { key: "Government", value: "governmnet" },
    { key: "ITI", value: "iti" },
  ];

  const assigneeOpts = [
    {
      key: "Someone 1",
      value: "1",
    },
    {
      key: "Someone 2",
      value: "2",
    },
    {
      key: "Someone 3",
      value: "3",
    },
  ];

  const instituteData = {
    name: "",
    type: "",
    email: "",
    phone: "",
    status: "",
    website: "",
    assigned_to: assigneeOpts[0].value,
  };

  const onSubmit = async (data) => {
    console.log("NEW_INSTITUTE_DATA", data);
    setLoading(true);
    NP.start();
    try {
      let resp = await queryBuilder({
        query: CREATE_NEW_INSTITUTE,
        variables: { ...data, contacts, address },
      });
      console.log(resp);
    } catch (err) {
      console.log("ERR_ADD", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const hideContactModal = (data) => {
    if (data.isTrusted) {
      setModalContactShow(false);
      return;
    }
    setContacts([...contacts, data]);
    setModalContactShow(false);
  };

  const hideAddressModal = (data) => {
    if (data.isTrusted) {
      setModalAddressShow(false);
      return;
    }
    setAddress(data);
    setModalAddressShow(false);
  };

  return (
    <div className="card">
      <div className="card-header bg-white py-2 mt-2">
        <h1 className="bebas-thick text--primary">Add New Institution</h1>
      </div>
      <div className="card-body py-5">
        <div className="container">
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
                <Input
                  control="select"
                  name="assigned_to"
                  label="Assigned To"
                  options={assigneeOpts}
                  className="form-control"
                  placeholder="Assigned To"
                />
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
            <div className="d-flex mt-2 py-2">
              <button
                type="button"
                className="btn btn-secondary btn-regular"
                onClick={() => setModalContactShow(true)}
              >
                ADD CONTACT
              </button>
              <div style={{ width: "20px" }} />
              <button
                type="button"
                className="btn btn-secondary btn-regular"
                onClick={() => setModalAddressShow(true)}
              >
                ADD ADDRESS
              </button>
            </div>
            <button type="submit" className="btn btn-primary btn-regular mt-3">
              Add Institution
            </button>
          </Form>
        </div>
        {/* <pre>
          {JSON.stringify({ ...institute, contacts, address }, null, 2)}
        </pre> */}
      </div>
      <ContactModal show={modalContactShow} onHide={hideContactModal} />
      <AddAddressModal show={modalAddressShow} onHide={hideAddressModal} />
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

const AddAddressModal = (props) => {
  const newAddress = {
    address_line: "",
    medha_area: "",
    pin_code: "",
    state: "",
  };

  let { onHide } = props;
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
          Add Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <Form
          onSubmit={onSubmit}
          initialValues={newAddress}
          validationSchema={AddressValidations}
        >
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
          <div className="row mt-3 py-3">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={onHide}
                className="btn btn-secondary btn-regular mr-2"
              >
                CLOSE
              </button>
              <div style={{ width: "20px" }}></div>
              <button className="btn btn-primary btn-regular" type="submit">
                Add Address
              </button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewInstitute;
