import np from "nprogress";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { queryBuilder } from "./instituteActions";
import { Form, Input } from "../../../utils/Form";
import { UPADTE_INSTITUTIONS } from "../../../graphql";
import { AddressValidations } from "../../../validations";

const EditAddressModal = (props) => {
  let { onHide, data } = props;

  const [newAddress, setNewAddress] = useState(data);

  const onSubmit = (data) => onHide(data);

  return (
    <Modal
      {...props}
      centered
      size="lg"
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Update Address
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
                UPDATE ADDRESS
              </button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const Address = ({ address_line, medha_area, pin_code, state, id, done }) => {
  const [modalShow, setModalShow] = useState(false);

  const hideModal = async (data) => {
    if (data.target) {
      setModalShow(false);
      return;
    }
    setModalShow(false);
    np.start();
    try {
      let resp = await queryBuilder({
        query: UPADTE_INSTITUTIONS,
        variables: {
          id,
          data: {
            address: data,
          },
        },
      });
      console.log("UPDATE_ADDRESS_RESPONSE", resp);
    } catch (err) {
      console.log("UPDATE_ADDRESS_ERR", err);
    } finally {
      np.done();
      done();
    }
  };

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-md-4">
          <p className="text-heading">Address</p>
          <p className="latto-regular">{address_line}</p>
        </div>
        <div className="col-md-4">
          <p className="text-heading">Area</p>
          <p className="latto-regular">{medha_area}</p>
        </div>
        <div className="col-md-4">
          <p className="text-heading">Pin Code</p>
          <p className="latto-regular">{pin_code}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-heading">State</p>
          <p className="latto-regular">{state}</p>
        </div>
      </div>
      <div className="mt-2">
        <button className="btn btn-primary" onClick={() => setModalShow(true)}>
          Edit Address
        </button>
      </div>
      <EditAddressModal
        show={modalShow}
        onHide={hideModal}
        data={{ address_line, medha_area, pin_code, state }}
      />
    </div>
  );
};

export default Address;
