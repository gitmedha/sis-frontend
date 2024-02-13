import React,{useState} from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { Input } from "../../../utils/Form";

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


export const CreateEventForm = (props) => {
  return (
    <Modal 
    centered
    size="lg"
    show={true}
    // onHide={onHide}
    animation={false}
    aria-labelledby="contained-modal-title-vcenter"
    className="form-modal"
    >
        <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          {/* {props.id && props.logo ? (
            <img src={urlPath(props.logo.url)} className="avatar mr-2" alt="Student Profile" />
          ) : (
          <div className="flex-row-centered avatar avatar-default mr-2">
            <FaSchool size={25} />
          </div>
          )} */}
          <h1 className="text--primary bebas-thick mb-0">
            {/* {props.id ? props.full_name : 'Add New Student'} */}
            Add New Event
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
        //   onSubmit={onSubmit}
        //   initialValues={initialValues}
        //   validationSchema={StudentValidations}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <h3 className="section-header">Basic Info</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="full_name"
                      label="Name"
                      required
                      control="input"
                      placeholder="Name"
                      className="form-control capitalize"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {statusOptions.length ? ( */}
                      <Input
                        control="lookupAsync"
                        name="assigned_to"
                        label="Assigned To"
                        required
                        className="form-control capitalize"
                        placeholder="Assigned To"
                        // filterData={filterAssignedTo}
                        // defaultOptions={assigneeOptions}
                      />
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="name_of_parent_or_guardian"
                      label="Parents Name"
                      required
                      control="input"
                      placeholder="Parents Name"
                      className="form-control capitalize"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {statusOptions.length ? ( */}
                      <Input
                        icon="down"
                        control="lookup"
                        name="status"
                        label="Status"
                        required
                        // options={statusOptions}
                        className="form-control"
                        placeholder="Status"
                      />
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="phone"
                      label="Phone"
                      required
                      control="input"
                      placeholder="Phone"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="alternate_phone"
                      label="Alternate Phone"
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
                      // required
                      control="input"
                      placeholder="Email"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {genderOptions.length ? ( */}
                      <Input
                        icon="down"
                        control="lookup"
                        name="gender"
                        label="Gender"
                        required
                        // options={genderOptions}
                        className="form-control"
                        placeholder="Gender"
                      />
                
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="date_of_birth"
                      label="Date of Birth"
                      required
                      placeholder="Date of Birth"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="category"
                        label="Category"
                        required
                        // options={categoryOptions}
                        className="form-control"
                        placeholder="Category"
                      />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="income_level"
                      label="Income Level (INR)"
                      required
                    //   options={incomeLevelOptions}
                      className="form-control"
                      placeholder="Income Level (INR)"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      min={0}
                      type="number"
                      name="family_annual_income"
                      label="Family Annual Income"
                      control="input"
                      placeholder="Family Annual Income"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="lookupAsync"
                      name="registered_by"
                      label="Registered By"
                      className="form-control"
                      placeholder="Registered By"
                    //   filterData={filterAssignedTo}
                    //   defaultOptions={assigneeOptions}
                    //   isDisabled={!isAdmin()}

                    />
                  </div>
                </div>
              </Section>
           
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                 <button className="btn btn-primary btn-regular mx-0" type="submit">SAVE</button>
                    <button
                      type="button"
                    //   onClick={onHide}
                      className="btn btn-secondary btn-regular mr-2"
                    >
                      CANCEL
                    </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    
    
    </Modal>
  )
}

export default CreateEventForm;