import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { StudentValidations } from "../../../validations";
import { urlPath } from "../../../constants";
import { getAddressOptions, getStateDistricts } from "../../Address/addressActions";
import { filterAssignedTo, getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { MeiliSearch } from 'meilisearch'
import {getAllOperations } from '../OperationComponents/operationsActions'


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

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const OperationDataupdateform = (props) => {
  let { onHide, show } = props;
 
 
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);

  useEffect(() => {
    
      getDefaultAssigneeOptions().then(data => {
        setAssigneeOptions(data);
      });
      // console.log("assigneeOptions ; \n ",assigneeOptions);
  }, []);

  useEffect(() => {

    getAddressOptions().then(data => {
      setStateOptions(data?.data?.data?.geographiesConnection.groupBy.state.map((state) => ({
        key: state.id,
        label: state.key,
        value: state.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));

      if (props.state) {
        onStateChange({ value: props.state });
      }
    });

 

  }, []);

  const onStateChange = async value => {
    console.log("value state", value)
    
   await getStateDistricts(value).then(data => {
      setAreaOptions([]);
      setAreaOptions(data?.data?.data?.geographiesConnection?.groupBy?.area.map((area) => ({
        key: area.id,
        label: area.key,
        value: area.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
    });
  };

  const onSubmit = async (values) => {
    console.log("values----")
    setDisableSaveButton(true);
    await onHide(values);
    setDisableSaveButton(false);
  };


  const userId = localStorage.getItem('user_id');
  let initialValues = {
    topic: '',
    assigned_to:userId,
    state:'',
    activity_type:'',
    institution:'',
    guest:'',
    organization:'',
    updated_at:'',
    start_date:'',
    end_date:'',
    designation:'',
    updated_by:'',
    area:'',
    students_attended:''
  }
  // { "Created At": "2023-04-19T12:18:24.383286Z", "Organization": "Goonj", "Activity Type": "Industry Talk/Expert Talk", "Institution": 329, "Updated At": null, "End Date": "2020-07-06", "Designation": "State Head(U.P)", "Start Date": "2020-07-06", "Assigned To": 123, "Other Links": "0", "Topic": "Goonj fellowship and NGO work", "Donor": false, "Batch": 162, "ID": 2201, "Updated By": null, "Students Attended": 14, "Created By": 2, "State": "Uttar Pradesh", "Area": "Gorakhpur (City)", "Guest": "Mr. Shushil Yadav" },

  function createdDateConvert(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  

  
  if (props) {
  

    // console.log("assigne option ", assigneeOptions);
    console.log("Batch",props.institution)
    initialValues['batch']=props.batch.id
    initialValues['topic'] = props.topic;
    initialValues['activity_type'] = props.activity_type
    initialValues['assigned_to']=props.assigned_to.id
    initialValues['start_date'] = new Date(props.start_date)
    initialValues['end_date'] = new Date(props.end_date)
    initialValues['students_attended']=props?.students_attended
    initialValues['created_at'] = props.created_at
    initialValues['organization']=props.organization
    initialValues['designation']=props.designation
    initialValues['guest']=props.guest
    // console.log("props?.institute_name?.name",props?.institution);
    initialValues['state'] = props.state ? props.state : null;
    initialValues['institute_name']=props?.institution?.id
    initialValues['donor']= props.Donor ? props.Donor :"N/A"
    initialValues['area'] = props.area ? props.area: null;
    
  }
  useEffect(() => {
    if ( props.institution) {
      // console.log("props filterInstitution", props.institution)
      filterInstitution(props.institution.name).then(data => {
        
        setInstitutionOptions(data);
      });

      
    }
    if ( props.batch) {
      filterBatch(props.batch.name).then(data => {
        console.log("dataBatch1:",data)  
        setBatchOptions(data);
      });
    }

  }, [])




  const filterInstitution = async (filterValue) => {
     
    return await meilisearchClient.index('institutions').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'name']
    }).then(data => {
      let filterData = data.hits.map(institution => {
        
        return {
          ...institution,
          label: institution.name,
          value: Number(institution.id),
        }
      });
      
      return filterData;
    });
  }

  

  const filterBatch = async (filterValue) => {
    return await meilisearchClient.index('batches').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'name']
    }).then(data => {
      // let programEnrollmentBatch = props.programEnrollment ? props.programEnrollment.batch : null;
  
      let filterData = data.hits.map(batch => {
      
        return {
          ...batch,
          label: batch.name,
          value: Number(batch.id),
        }
      });
     
      console.log(filterData)
      return filterData;
    });
  }

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          {props.id && props.logo ? (
            <img src={urlPath(props.logo.url)} className="avatar mr-2" alt="Student Profile" />
          ) : (
            <div className="flex-row-centered avatar avatar-default mr-2">
              <FaSchool size={25} />
            </div>
          )}
          <h1 className="text--primary bebas-thick mb-0">
            {props.id ? props.full_name : 'Add New Student'}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={StudentValidations}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <h3 className="section-header">Basic Info</h3>
                <div className="row">
                  {/* <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="institute_name"
                      label="Insititute Name"
                      required
                      className="form-control"
                      placeholder="Institue"
                    // filterData={filterAssignedTo}

                    />
                  </div> */}
                  

                  <div className="col-md-6 col-sm-12 mb-2">

                    <Input
                      control="input"
                      name="activity_type"
                      label="Activity Type"
                      // required
                      className="form-control"
                      placeholder="Activity Type"
                    // filterData={filterAssignedTo}

                    />

                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    
                    <Input
                     control="lookupAsync"
                     name="assigned_to"
                     label="Assigned To"
                    //  required/
                     className="form-control"
                     placeholder="Assigned To"
                     filterData={filterAssignedTo}
                     defaultOptions={assigneeOptions}
                    />
                    
                  </div>


                  <div className="col-md-6 col-sm-12 mb-2">
                  
                    <Input
                      control="lookupAsync"
                      name="batch"
                      label="Batch"
                      required
                      filterData={filterBatch}
                      defaultOptions={ batchOptions }
                      className="form-control"
                      placeholder="Batch"
                    />
                    
                  </div>

                  <div className="col-md-6 col-sm-12 mb-2">
                  
                    <Input
                      control="lookupAsync"
                        name="institution"
                        label="Institution"
                        filterData={filterInstitution}
                        defaultOptions={props.id ? institutionOptions : true}
                        placeholder="Institution"
                        className="form-control"
                        isClearable
                    />
                    
                  </div>

                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="start_date"
                      label="Start Date "
                      // required
                      placeholder="Date of Birth"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="end_date"
                      label="End Date"
                      // required
                      placeholder="Date of Birth"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div className="col-md-6 col-sm-12 mb-2">
                    
                    <Input
                      control="input"
                      name="donor"
                      label="Donor"
                      // required
                      className="form-control"
                      placeholder="Donor"
                    
                    />
                    
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                   
                    <Input
                      control="input"
                      name="topic"
                      label="Topic"
                      // required
                      className="form-control"
                      placeholder="Topic"
                    />
                    
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                   
                    <Input
                      icon="down"
                      control="input"
                      name="guest"
                      label="Guest"
                      // required
                      className="form-control"
                      placeholder="Guest"
                    />
                    
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {genderOptions.length ? ( */}
                    <Input
                      icon="down"
                      control="input"
                      name="designation"
                      label="Designation"
                      // required
                      // options={genderOptions}
                      className="form-control"
                      placeholder="Designation"
                    />
                    {/* ) : ( */}
                    {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {genderOptions.length ? ( */}
                    <Input
                      icon="down"
                      control="input"
                      name="organization"
                      label="Organization"
                      // required
                      // options={genderOptions}
                      className="form-control"
                      placeholder="Organization"
                    />
                    
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="students_attended"
                      label="Student Attended"
                      // required
                      placeholder="Student atended"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  {/* <div className="col-md-6 col-sm-12 mb-2">
                  
                      <Input
                        icon="down"
                        control="lookup"
                        name="category"
                        label="Category"
                        required
                        options={categoryOptions}
                        className="form-control"
                        placeholder="Category"
                      />
                   
                  </div> */}
                  {/* <div className="col-md-6 col-sm-12 mb-2">
                    
                      <Input
                        icon="down"
                        control="lookup"
                        name="income_level"
                        label="Income Level (INR)"
                        required
                        options={incomeLevelOptions}
                        className="form-control"
                        placeholder="Income Level (INR)"
                      />
                   
                  </div> */}
                  {/* <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="lookupAsync"
                      name="registered_by"
                      label="Registered By"
                      className="form-control"
                      placeholder="Registered By"
                      filterData={filterAssignedTo}
                      defaultOptions={assigneeOptions}
                      isDisabled={!isAdmin()}
                    />
                  </div> */}
                  {/* <div className="col-md-6 col-sm-12 mb-2">
                    {howDidYouHearAboutUsOptions.length ? (
                      <Input
                        icon="down"
                        control="lookup"
                        name="how_did_you_hear_about_us"
                        label="How did you hear about us?"
                        options={howDidYouHearAboutUsOptions}
                        className="form-control"
                        placeholder="How did you hear about us?"
                        onChange={option => {
                          setSelectedHowDidYouHearAboutUs(option.value);
                        }}
                        required
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div> */}
                  {/* {selectedHowDidYouHearAboutUs?.toLowerCase() === 'other' && <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="how_did_you_hear_about_us_other"
                      label="If Other, Specify"
                      control="input"
                      placeholder="If Other, Specify"
                      className="form-control"
                      required
                    />
                  </div>} */}
                  {/* {(isSRM() || isAdmin()) && <div className="col-sm-12 mb-2">
                    <div className="col-md-6">
                      <Input
                        control="file"
                        name="cv_upload"
                        label="CV"
                        subLabel={showCVSubLabel && <div className="mb-1">
                          {fileName}
                        </div>}
                        className="form-control"
                        placeholder="CV"
                        accept=".pdf, .docx"
                        onChange={(event) => {
                          setFieldValue("cv_file", event.currentTarget.files[0]);
                          setShowCVSubLabel(false);
                        }}
                      />
                    </div>
                  </div>} */}
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Address</h3>
                <div className="row">
                  
                  <div className="col-md-6 col-sm-12 mb-2">
                    {stateOptions.length ? (
                      <Input
                        icon="down"
                        name="state"
                        label="State"
                        control="lookup"
                        options={stateOptions}
                        onChange={onStateChange}
                        placeholder="State"
                        className="form-control"
                        // required
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {areaOptions.length ? (
                      <Input
                      icon="down"
                      name="area"
                      label="Area"
                      control="lookup"
                      options={areaOptions}
                      // onChange={onStateChange}
                      placeholder="Area"
                      className="form-control"
                      // required
                    />
                    ) : (
                      <>
                        {/* <label className="text-heading" style={{ color: '#787B96' }}>Please select State to view Medha Areas</label> */}
                        <Skeleton count={1} height={45} />
                      </>
                    )}
                  </div>

                  {/* <div className="col-md-6 col-sm-12 mb-2">
                  {districtOptions.length ? (
                    <Input
                      icon="down"
                      control="lookup"
                      name="district"
                      label="District"
                      placeholder="District"
                      className="form-control"
                      required
                      options={districtOptions}
                    />
                     ) : (
                      <>
                        <label className="text-heading" style={{color: '#787B96'}}>Please select State to view Districts</label>
                        <Skeleton count={1} height={35} />
                      </>
                    )}
                  </div> */}
                </div>
              </Section>

              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                  <button className="btn btn-primary btn-regular mx-0" type="submit" disabled={disableSaveButton}>SAVE</button>
                  <button
                    type="button"
                    onClick={onHide}
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
  );
};

export default OperationDataupdateform;
