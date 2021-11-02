import { Formik, FieldArray, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";

import { Input } from "../../../utils/Form";
import { StudentValidations } from "../../../validations";
// import { getInstitutionsPickList, getAssigneeOptions } from "./instituteActions";
import { urlPath } from "../../../constants";
import { getStudentsPickList } from './StudentActions';
import { getAddressOptions, getStateDistricts }  from "../../Address/addressActions";
import { getAssigneeOptions } from '../../Institutions/InstitutionComponents/instituteActions';
import { DateRange } from '@material-ui/icons';

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

const StudentForm = (props) => {
  let { onHide, show } = props;
  const [institutionTypeOpts, setInstitutionTypeOpts] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [incomeLevelOptions, setIncomeLevelOptions] = useState([]);
  const [logo, setLogo] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const medhaChampionOptions = [
    {key: true, value: true, label: "Yes"},
    {key: false, value: false, label: "No"},
  ];
  const interestedInEmploymentOpportunitiesOptions = [
    {key: true, value: true, label: "Yes"},
    {key: false, value: false, label: "No"},
  ];

  useEffect(() => {
    getStudentsPickList().then(data => {
      setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setGenderOptions(data.gender.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCategoryOptions(data.category.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setIncomeLevelOptions(data.income_level.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });

    getAssigneeOptions().then(data => {
      setAssigneeOptions(data?.data?.data?.users.map((assignee) => ({
          key: assignee.username,
          label: `${assignee.username} (${assignee.email})`,
          value: assignee.id,
      })));
    });

    getAddressOptions().then(data => {
      setStateOptions(data?.data?.data?.geographies.map((geographies) => ({
          key: geographies.id,
          label: geographies.state,
          value: geographies.state,
      })));      

      if (props.state) {
        onStateChange({
          value: props.state,
        });
      }
    });

  }, [props]);

  const onStateChange = value => {
    setDistrictOptions([]);
    getStateDistricts(value).then(data => { 
      setDistrictOptions(data?.data?.data?.geographies.map((geographies) => ({
        key: geographies.id,
        label: geographies.district,
        value: geographies.district,
      })));
      setAreaOptions([]);
      setAreaOptions(data?.data?.data?.geographies.map((geographies) => ({
        key: geographies.id,
        label: geographies.area,
        value: geographies.area,
      })));
    });
  };

  const onSubmit = async (values) => {
    if (logo) {
      values.logo = logo;
    }
    onHide(values);
  };

  let initialValues = {
    institution:'',
    batch:'',
    full_name:'',
    phone:'',
    name_of_parent_or_guardian:'',
    category:'',
    email:'',
    gender:'',
    assigned_to:'',
    status:'',
    income_level:'',
    date_of_birth:'',
    city:'',
    pin_code:'',
    medha_area:'',
    address:'',
    state:'',
    district:'',
    logo:'',
  };

  if (props.id) {
    initialValues = {...props};
    initialValues['date_of_birth'] = new Date(props?.date_of_birth);
    initialValues['assigned_to'] = props?.assigned_to?.id;
    initialValues['district'] = props.district ? props.district: null ;
    initialValues['medha_area'] = props.medha_area ? props.medha_area: null ;
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
          {({ values }) => (
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
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="name_of_parent_or_guardian"
                      label="Parents Name"
                      required
                      control="input"
                      placeholder="Parents Name"
                      className="form-control"
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
                        options={statusOptions}
                        className="form-control"
                        placeholder="Status"
                      />
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {genderOptions.length ? ( */}
                      <Input
                        icon="down"
                        control="lookup"
                        name="gender"
                        label="Gender"
                        required
                        options={genderOptions}
                        className="form-control"
                        placeholder="Gender"
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
                      type="email"
                      name="email"
                      label="Email"
                      required
                      control="input"
                      placeholder="Email"
                      className="form-control"
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
                    {/* {statusOptions.length ? ( */}
                      <Input
                        control="lookup"
                        name="assigned_to"
                        label="Assigned To"
                        required
                        options={assigneeOptions}
                        className="form-control"
                        placeholder="Assigned To"
                      />
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {statusOptions.length ? ( */}
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
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {statusOptions.length ? ( */}
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
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="logo"
                      label="Upload Image"
                      control="input"
                      accept=".jpg,.jpeg,.png"
                      type="file"
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="cv"
                      label="Upload CV"
                      control="input"
                      accept=".doc, .pdf, .docx"
                      type="file"
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="form-control"
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Address</h3>
                <div className="row">
                  <div className="col-md-12 col-sm-12 mb-2">
                    <Input
                      control="input"
                      label="Address"
                      name="address"
                      placeholder="Address"
                      className="form-control"
                      required
                    />
                  </div>
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
                      required
                    />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
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
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                  {areaOptions.length ? (
                    <Input
                      icon="down"
                      control="lookup"
                      name="medha_area"
                      label="Medha Area"
                      className="form-control"
                      placeholder="Medha Area"
                      required
                      options={areaOptions}
                    />
                     ) : (
                      <>
                        <label className="text-heading" style={{color: '#787B96'}}>Please select State to view Medha Areas</label>
                        <Skeleton count={1} height={35} />
                      </>
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="city"
                      label="City"
                      className="form-control"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="pin_code"
                      label="Pin Code"
                      placeholder="Pin Code"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Additional Info</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {statusOptions.length ? ( */}
                      <Input
                        icon="down"
                        control="lookup"
                        name="medha_champion"
                        label="Medha Champion"
                        options={medhaChampionOptions}
                        className="form-control"
                        placeholder="Medha Champion"
                      />
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {/* {statusOptions.length ? ( */}
                      <Input
                        icon="down"
                        control="lookup"
                        name="interested_in_employment_opportunities"
                        label="Interested in Employment Opportunities"
                        options={interestedInEmploymentOpportunitiesOptions}
                        className="form-control"
                        placeholder="Interested in Employment Opportunities"
                      />
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="old_sis_id"
                      label="ID in SIS 2.0"
                      control="input"
                      placeholder="ID in SIS 2.0"
                      className="form-control"
                    />
                  </div>
                </div>
              </Section>
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                 <button className="btn btn-primary btn-regular mx-0" type="submit">SAVE</button>
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

export default StudentForm;
