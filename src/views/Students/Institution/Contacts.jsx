import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Input } from "../../../utils/Form";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Table from "../../../components/content/Table";
import { ContactValidations } from "../../../validations";

const AddContactModal = (props) => {
  let { onHide } = props;

  const newContact = {
    phone: "",
    email: "",
    last_name: "",
    first_name: "",
    designation: "",
  };

  const onSubmit = (data) => {
    console.log("NEW_CONTACT_DATA", data);
    onHide(data);
  };

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
                name="first_name"
                label="First Name"
                placeholder="First Name"
                className="form-control"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-2">
              <Input
                control="input"
                name="last_name"
                label="Last Name"
                placeholder="Last Name"
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

const Contacts = ({ contacts }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="container-fluid my-3">
      <Table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Full Name</th>
            <th scope="col">Designation</th>
            <th scope="col">Phone</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact.id}>
              <th scope="row">{index + 1}</th>
              <td>{contact.full_name}</td>
              <td>{contact.designation}</td>
              <td>{contact.phone}</td>
              <td className="d-flex">
                <div className="mr-2">
                  <FaTrashAlt size={18} />
                </div>
                <div>
                  <FaEye size={18} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => setModalShow(true)}>
          Add NEW CONTACT
        </button>
      </div>
      <AddContactModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default Contacts;
