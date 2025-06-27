import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { MemberShipValidations } from "../../../validations/Student";
import Textarea from "../../../utils/Form/Textarea";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import moment from "moment";

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }

  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Ended", label: "Ended" },
];

const yesNoOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const MembershipForm = (props) => {
  let { onHide, show ,membership,student} = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState("");

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);


 const calculateInitialTenureDate = (availDate) => {
    return availDate ? moment(availDate).add(3, 'years').toDate() : null;
  };

  let initialValues = {
    student: student.full_name,
    medhavi_member: "",
    membership_fee: "",
    medhavi_member_id: "",
    date_of_payment: null,
    date_of_avail: null,
    date_of_settlement: null,
    receipt_number: "",
    tenure_completion_date: null,
    membership_status: "",
    reason_for_cancellation: "",
    assigned_to: localStorage.getItem("user_id"),
  };

  if (membership) {
    initialValues = { 
      medhavi_member:membership.medhavi_member,
      assigned_to: membership?.assigned_to?.id,
      date_of_payment: membership.date_of_payment ? new Date(membership.date_of_payment) : null,
      date_of_avail: membership.date_of_avail ? new Date(membership.date_of_avail) : null,
      date_of_settlement: membership.date_of_settlement ? new Date(membership.date_of_settlement) : null,
      tenure_completion_date: calculateInitialTenureDate(membership.date_of_avail),
      membership_fee: membership.membership_fee,
      medhavi_member_id: membership.medhavi_member_id,
      receipt_number: membership.receipt_number,
      membership_status: membership.membership_status,
      reason_for_cancellation: membership.reason_for_cancellation || "",
    };
    console.log(initialValues, "initial values in membership form");
  }

  const handleClose = () => {
    onHide();
  };

  const onSubmit = async (values) => {
    onHide(values);
  };

  const handleDateOfAvailChange = (date, setFieldValue) => {
    if (date) {
      const tenureDate = moment(date).add(3, 'years').toDate();
      setFieldValue('tenure_completion_date', tenureDate);
    } else {
      setFieldValue('tenure_completion_date', null);
    }
  };
  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={handleClose}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">
            {props.membership && props.membership.id
              ? "Update"
              : "Add New"}{" "}
            Membership
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={MemberShipValidations}
          enableReinitialize
        >
          {({ values,setFieldValue}) => (
            <Form>
              {
                console.log(values, "values in membership form")
              }
              <Section>
                <div className="row form_sec">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="student"
                      control="input"
                      label="Student"
                      className="form-control capitalize"
                      placeholder="Student"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="lookupAsync"
                      name="assigned_to"
                      label="Assigned To"
                      required
                      className="form-control"
                      placeholder="Assigned To"
                      filterData={filterAssignedTo}
                      defaultOptions={assigneeOptions}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="medhavi_member"
                      label="Medhavi Member"
                      placeholder="Medhavi Member"
                      control="lookup"
                      icon="down"
                      className="form-control"
                      options={yesNoOptions}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="medhavi_member_id"
                      label="Medhavi Member ID"
                      placeholder="Medhavi Member ID"
                      control="input"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="membership_fee"
                      label="Membership Fee (₹)"
                      placeholder="Membership Fee"
                      control="input"
                      type="number"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="receipt_number"
                      label="Receipt Number"
                      placeholder="Receipt Number"
                      control="input"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="date_of_payment"
                      label="Date of Payment"
                      placeholder="Date of Payment"
                      control="datepicker"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="date_of_avail"
                      label="Date of Avail"
                      placeholder="Date of Avail"
                      control="datepicker"
                      className="form-control"
                      required
                      onInput={(date) => handleDateOfAvailChange(date, setFieldValue)}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="date_of_settlement"
                      label="Date of Settlement"
                      placeholder="Date of Settlement"
                      control="datepicker"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="tenure_completion_date"
                      label="Tenure Completion Date"
                      placeholder="Auto-calculated as 3 years after avail date"
                      control="datepicker"
                      className="form-control"
                      readOnly={true}
                      disabled={true}
                      value={values.tenure_completion_date ? 
                        moment(values.tenure_completion_date).format('YYYY-MM-DD') : 
                        ''}
                    />
                    <small className="text-muted">
                      Automatically calculated as 3 years after Date of Avail
                    </small>
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="membership_status"
                      label="Membership Status"
                      placeholder="Membership Status"
                      control="lookup"
                      icon="down"
                      className="form-control"
                      options={statusOptions}
                      onChange={(e) => setMembershipStatus(e.value)}
                      required
                    />
                  </div>
                  {membershipStatus === "Cancelled" && (
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Textarea
                        name="reason_for_cancellation"
                        label="Reason for Cancellation"
                        placeholder="Reason for Cancellation"
                        control="input"
                        className="form-control"
                        required
                      />
                    </div>
                  )}
                </div>
              </Section>

              <div className="row justify-content-end mt-5">
                <div className="col-auto p-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary btn-regular collapse_form_buttons"
                  >
                    CANCEL
                  </button>
                </div>
                <div className="col-auto p-0">
                  <button
                    type="submit"
                    className="btn btn-primary btn-regular collapse_form_buttons"
                  >
                    SAVE
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

export default MembershipForm;