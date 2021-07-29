import { useState, useMemo } from "react";
import nProgress from "nprogress";
import { Modal } from "react-bootstrap";
import { Form, Input } from "../../../utils/Form";
import { queryBuilder } from "./instituteActions";
import { FaPen } from "react-icons/fa";
import { Table as BTable } from "react-bootstrap";
import Table from "../../../components/content/Table";
import { UPDATE_INSTITUTION } from "../../../graphql";
import { ContactValidations } from "../../../validations";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import { Anchor } from "../../../components/content/Utils";

const AddContactModal = (props) => {
  let { onHide, show } = props;

  const newContact = {
    phone: "",
    email: "",
    full_name: "",
    designation: "",
  };

  const onSubmit = async (data) => {
    onHide(data);
  };

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
                name="full_name"
                label="Name"
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

const Contacts = ({ contacts, id, done, setAlert }) => {
  const [modalShow, setModalShow] = useState(false);

  contacts = contacts.map((contact) => {
    contact.email = <Anchor text={contact.email} href={'mailto:' + contact.email} />
    contact.actions = <div className="d-flex">
      <FaPen size={18} style={{cursor: 'pointer'}} />
    </div>
    return contact;
  });

  const hideUpdateContactModal = async (data) => {
    if (data.isTrusted) {
      setModalShow(false);
      return;
    }

    nProgress.start();
    try {
      await queryBuilder({
        query: UPDATE_INSTITUTION,
        variables: {
          id,
          data: {
            contacts: [data, ...contacts],
          },
        },
      });
      setAlert("Institution contacts updated successfully.", "success");
    } catch (err) {
      console.log("UPDATE_CONTACT_ERR", err);
      setAlert("Unable to update institution contacts.", "error");
    } finally {
      nProgress.done();
      done();
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'full_name',
      },
      {
        Header: 'Designation',
        accessor: 'designation',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: '',
        accessor: 'actions',
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <Table columns={columns} data={contacts} paginationPageSize={1} totalRecords={contacts.length} fetchData={() => {}} loading={false} />
      <div className="mt-4">
        <button className="btn btn-primary" onClick={() => setModalShow(true)}>
          Add NEW CONTACT
        </button>
      </div>
      <AddContactModal show={modalShow} onHide={hideUpdateContactModal} />
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Contacts);
