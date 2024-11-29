import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { Input } from "../../../utils/Form";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import {
  getAlumniServicePickList,
  createEvent,
  updateEvent,
} from "./calendarActions";
import { calendarValidations } from "../../../validations/Calendar";
import {
  getStudentsPickList,
} from "../../Students/StudentComponents/StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import NP from "nprogress";
import { compareObjects, createLatestAcivity, findDifferences } from "src/utils/LatestChange/Api";

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

export const EventForm = (props) => {
  const { setAlert } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [statusOptions] = useState([
    {
      key: 0,
      label: "Open",
      value: "Open",
    },
    {
      key: 1,
      label: "Close",
      value: "Close",
    },
  ]);

  const [alumniServiceOptions, setAlumniServiceOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);

  const initialValues = {};

  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    getAlumniServicePickList().then((data) => {
      setAlumniServiceOptions([
        ...data.subcategory.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
          category: item.category,
        })),
        ...data.category.map((item) => ({
          value: item.value,
          label: item.value,
        })),
      ]);
    });

    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });

    getStudentsPickList().then((data) => {
      setLocationOptions(
        data.alumni_service_location.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });

    if (props.eventData) {
      initialValues.assgined_to = props.eventData.assgined_to.id.toString();
      initialValues.start_date = new Date(props.eventData.start_date);
      initialValues.end_date = new Date(props.eventData.end_date);
      initialValues.status = props.eventData.status;
      initialValues.alumni_service = props.eventData.alumni_service;
      initialValues.id = props.eventData.id;
      initialValues.location = props.eventData?.location?props.eventData.location: " ";
      initialValues.participants = props.eventData?.participants ? props.eventData.participants: ""
    } else {
      initialValues.assgined_to = userId.toString();
      initialValues.start_date = props.slotData.start;
      initialValues.end_date = props.slotData.start;
      initialValues.reporting_date = new Date();
      initialValues.status = "Open";
      initialValues.alumni_service = "";
      initialValues.name = localStorage.getItem("user_name");
      initialValues.location = "";
      initialValues.participants = "";
    }
  }, []);

  function findDifferencesFormatted(obj1, obj2) {
    const differences = {};
  
    // Helper to parse dates and compare
    function areDatesEqual(date1, date2) {
      const parsedDate1 = new Date(date1).getTime();
      const parsedDate2 = new Date(date2).getTime();
      return parsedDate1 === parsedDate2;
    }
  
    // Loop through keys in obj2 to identify differences or new values
    for (const key in obj2) {
      if (key === "assgined_to") {
        // Handle "assgined_to" (compare by id)
        const id1 = obj1.assgined_to?.id || obj1.assgined_to;
        const id2 = obj2.assgined_to?.id || obj2.assgined_to;
        if (id1.toString() !== id2.toString()) {
          differences[key] = { previous_value: id1, newValue: id2 };
        }
      } else if (key === "start_date" || key === "end_date") {
        // Handle date comparison
        if (!areDatesEqual(obj1[key], obj2[key])) {
          differences[key] = { previous_value: obj1[key] || null, newValue: obj2[key] };
        }
      } else {
        // Generic comparison
        if (obj1[key] !== obj2[key]) {
          differences[key] = { previous_value: obj1[key] || null, newValue: obj2[key] };
        }
      }
    }
  
    return differences;
  }

  const handleSubmit = async (values) => {
    try {
      NP.start();
      setIsLoading(true);
      if (props.eventData) {
        values.name = values.alumni_service;
        console.log(props.eventData);
        console.log(values);
        console.log(compareObjects(initialValues,values));
        let datavaluesforlatestcreate={module_name:"calender",activity:"Calendar Data Updated",event_id:"",updatedby:userId ,changes_in:findDifferencesFormatted(props.eventData,values)};
        await createLatestAcivity(datavaluesforlatestcreate);
        await updateEvent(values, props.eventData.id);
        setIsLoading(false);

        setAlert("Details updated successfully.", "success");

        NP.done();
        await props.onRefresh();
        props.onHide();
      } else {
        let datavaluesforlatestcreate={module_name:"calender",activity:"Calendar Data Created",event_id:"",updatedby:userId ,changes_in:{name:values.alumni_service}};
        await createLatestAcivity(datavaluesforlatestcreate);
        await createEvent(values);
        setIsLoading(false);
        setAlert("Event created successfully.", "success");
        NP.done();
        await props.onRefresh();
        props.onHide();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <Modal
      centered
      size="lg"
      show={true}
      onHide={props.onHide}
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
            {props.eventData ? "Update Event" : "Add New Event"}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={calendarValidations}
        >
          {({ setFieldValue }) => (
            <Form>
              <Section>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="lookupAsync"
                      name="assgined_to"
                      label="Assigned To"
                      required
                      className="form-control capitalize"
                      placeholder="Assigned To"
                      filterData={filterAssignedTo}
                      defaultOptions={assigneeOptions}
                      onChange={(e) => {
                        setFieldValue("name", e.label.split("(")[0].trim());
                        setFieldValue("assgined_to", Number(e.value));
                      }}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="alumni_service"
                      label="Alumni Engagement"
                      required
                      control="lookup"
                      placeholder="Alumni Engagement"
                      className="form-control capitalize"
                      options={alumniServiceOptions}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="status"
                      label="Status"
                      required
                      options={statusOptions}
                      className="form-control"
                      placeholder="Status"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="start_date"
                      label="Start Date"
                      required
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="end_date"
                      label="End Date"
                      required
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                      placeholder="End Date"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="participants"
                      label="Participants"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Participants"
                      type="number"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      name="location"
                      label="Location"
                      options={locationOptions}
                      control="lookup"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Location"
                    />
                  </div>
                </div>
              </Section>

              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                  <button
                    className="btn btn-primary btn-regular mx-0"
                    type="submit"
                    disabled={isLoading ? true : false}
                  >
                    {props.eventData ? "UPDATE" : "SAVE"}
                  </button>
                  <button
                    type="button"
                    onClick={props.onHide}
                    className="btn btn-secondary btn-regular mr-2"
                    disabled={isLoading ? true : false}
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
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(EventForm);
