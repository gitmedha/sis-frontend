import React,{useState,useEffect} from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { Input } from "../../../utils/Form";
import { filterAssignedTo,getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';
import {getAlumniServicePickList,createEvent} from './calendarActions';
import {calendarValidations} from '../../../validations/Calendar';
import NP from "nprogress";

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


export const EventForm = (props) => {

  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [statusOptions] = useState([
    {
      key:0,
      label:'Open',
      value:'Open'
    },
  {
    key:1,
    label:'Close',
    value:'Close'
  }
]);

const [alumniServiceOptions,setAlumniServiceOptions] = useState([]);
const initialValues = {};

  const userId = parseInt(localStorage.getItem('user_id'))

  useEffect(() => {
    getDefaultAssigneeOptions().then(data => {
      setAssigneeOptions(data);
    });

    getAlumniServicePickList().then(data=>{
      setAlumniServiceOptions([...data.subcategory.map((item) => ({ key: item.value, value: item.value, label: item.value, category: item.category })),...data.category.map((item)=> ({value: item.value, label: item.value}))])
    })

if(props.eventData){

}
else {
  
  initialValues.assgined_to = userId.toString()
  initialValues.start_date = new Date()
  initialValues.end_date = new Date()
  initialValues.reporting_date = new Date()
  initialValues.status = ''
  initialValues.alumni_service = ''
  initialValues.name = localStorage.getItem('user_name')
}
  }, []);


  const handleSubmit = async(values)=>{
    try {
      NP.start()
      await createEvent(values);
      NP.done();
      await props.onEventCreated();
      props.onHide();

    } catch (error) {
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
            Add New Event
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={calendarValidations}
        >
          {({ values, setFieldValue }) => (
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
                        onChange={(e)=>{
                          setFieldValue('name',e.label.split('(')[0].trim())
                          setFieldValue('assgined_to',Number(e.value))
                        }}
                      />
                   
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="alumni_service"
                      label="Alumni Service"
                      required
                      control="lookup"
                      placeholder="Alumni Service"
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
                </div>
              </Section>
           
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                 <button className="btn btn-primary btn-regular mx-0" type="submit" onClick={()=>handleSubmit(values)}>SAVE</button>
                    <button
                      type="button"
                      onClick={props.onHide}
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

export default EventForm;