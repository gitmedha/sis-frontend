import { Formik, Form } from 'formik';
import { Modal ,Button} from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { StudentValidations } from "../../../validations";
import { urlPath } from "../../../constants";
import { getStudentsPickList } from './StudentActions';
import { getAddressOptions, getStateDistricts } from "../../Address/addressActions";
import { filterAssignedTo, getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import { getOpportunitiesPickList } from '../../Opportunities/OpportunityComponents/opportunityAction';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

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

const Operationform = (props) => {
  let { onHide, show } = props;


  const [data, setData] = useState([
    { id: 1, name: "name", age: "2", inst: "vava" },
    // Add more initial rows as needed
  ]);

  const handleValueChange = (e, rowId, property) => {
    const updatedData = data.map((row) => {
      if (row.id === rowId) {
        return { ...row, [property]: e.target.value };
      }
      return row;
    });
    setData(updatedData);
  };
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [incomeLevelOptions, setIncomeLevelOptions] = useState([]);
  const [howDidYouHearAboutUsOptions, setHowDidYouHearAboutUsOptions] = useState([]);
  const [selectedHowDidYouHearAboutUs, setSelectedHowDidYouHearAboutUs] = useState(props?.how_did_you_hear_about_us);
  const [logo, setLogo] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [show1, setShow1] = useState(false);

  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);
  // const [showCVSubLabel, setShowCVSubLabel] = useState(props.CV && props.CV.url);
  // const userId = parseInt(localStorage.getItem('user_id'))
  // const medhaChampionOptions = [
  //   { key: true, value: true, label: "Yes" },
  //   { key: false, value: false, label: "No" },
  // ];
  // const interestedInEmploymentOpportunitiesOptions = [
  //   { key: true, value: true, label: "Yes" },
  //   { key: false, value: false, label: "No" },
  // ];

  // useEffect(() => {
  //   getDefaultAssigneeOptions().then(data => {
  //     setAssigneeOptions(data);
  //   });
  // }, []);

  useEffect(() => {
    getStudentsPickList().then(data => {
      setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setGenderOptions(data.gender.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCategoryOptions(data.category.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setIncomeLevelOptions(data.income_level.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setHowDidYouHearAboutUsOptions(data.how_did_you_hear_about_us.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });

    getAddressOptions().then(data => {
      console.log("data--------------->",data?.data?.data?.geographiesConnection);
      setStateOptions(data?.data?.data?.geographiesConnection.groupBy.state.map((state) => ({
        key: state?.id,
        label: state?.key,
        value: state?.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));

      // if (props.state) {
      //   onStateChange({ value: props.state });
      // }
    });

    // setShowCVSubLabel(props.CV && props.CV.url);

  }, []);

  const onStateChange = value => {
    console.log("--------------------------------------")
    console.log(value);
    setDistrictOptions([]);
    getStateDistricts(value).then(data => {
      setDistrictOptions(data?.data?.data?.geographiesConnection.groupBy.district.map((district) => ({
        key: district.id,
        label: district.key,
        value: district.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
      setAreaOptions([]);
      setAreaOptions(data?.data?.data?.geographiesConnection.groupBy.area.map((area) => ({
        key: area.id,
        label: area.key,
        value: area.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));
    });
  };

  const onSubmit = async (values) => {
    // if (logo) {
    //   values.logo = logo;
    // }
    console.log("onsubmit values----------->",values);
    setDisableSaveButton(true);
    await onHide(values);
    setDisableSaveButton(false);
  };



  const addRow = () => {
    // const newRowId = data.length + 1;
    if (data.length === 10) {
      return ;
    }
    const newRow = { id: data.length + 1, name: 'rojo', age: 10 };
    // Modify the properties as per your requirements
    setData([...data, newRow]);
  };
  const handleSubmit = () => {
    console.log(data); // Logging the data to the console
  };
  useEffect(() => {
    console.log("data", data)
  }, [])


  useEffect(() => {
    getStudentsPickList().then(data => {
      setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setGenderOptions(data.gender.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCategoryOptions(data.category.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setIncomeLevelOptions(data.income_level.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setHowDidYouHearAboutUsOptions(data.how_did_you_hear_about_us.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });

    getAddressOptions().then(data => {
      setStateOptions(data?.data?.data?.geographiesConnection.groupBy.state.map((state) => ({
        key: state.id,
        label: state.key,
        value: state.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));

      
    });


  }, []);


  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setStatusOptions(data.status.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));

      setTypeOptions(data.type.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value,
        };
      }));


    });



  }, []);

  return (
    <Modal
      centered
      size="lg"
      responsive
      // fullscreen={true}
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      id="custom-modal"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter "
          className="d-flex align-items-center justify-content-between"
        >


          <div className='d-flex justify-content-between'>
            {/* <h2 className="section-header">Basic Info</h2> */}
            <div className='d-flex '>
              {props.id && props.logo ? (
                <img src={urlPath(props.logo.url)} className="avatar mr-2" alt="Student Profile" />
              ) : (
                <div className="flex-row-centered avatar avatar-default mr-2">
                  <FaSchool size={25} />
                </div>
              )}
              <h2 className="text--primary bebas-thick mb-0">
                {props.id ? props.full_name : 'Add New Data'}
              </h2>
            </div>

            <div className="d-flex justify-content-start between_class">
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
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
        // onSubmit={onSubmit}
        // initialValues={initialValues}
        // validationSchema={StudentValidations}
        >


          <Section>
            <div className='d-flex justify-content-between'>
              <h2 className="section-header">Basic Info</h2>


            </div>
            
            
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              
              <Table striped bordered responsive >


                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Activity Type</th>
                    <th>Institution</th>

                    <th>Batch</th>
                    <th>State</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Topic</th>
                    <th>Donor</th>
                    <th>Guest</th>
                    <th>Designation</th>
                    <th>Organization</th>
                    <th>Student Attended</th>
                    <th>Area</th>



                    {/* Add more th elements for additional columns */}
                  </tr>
                </thead>
                <tbody>
                  {data && data?.map((row) => (


                    <tr key={row?.id}>
                      <td>{row.id}</td>
                      <td >
                        {/* <input
                          type="text"
                          value={row?.name}
                          onChange={(e) => handleValueChange(e, row?.id, 'name')} /> */}
                        {/* <Form.Control
              type="text"
              value={row?.name}
              onChange={(e) => handleValueChange(e, row?.id, 'name')}
            /> */}
                        {/* {row.name} */}
                        <Input
                          type="text"
                          name="name"
                          // label="Guest"
                          // required
                          control="input"
                          placeholder="Name"
                          className="form-control"
                        />

                      </td>
                      <td>

                        <Input
                          icon="down"
                          name="type"
                          // label="Type"
                          onChange={(e) => handleValueChange(e, row?.id, 'inst')}
                          control="lookup"
                          // placeholder="Type"
                          options={typeOptions}
                          className="form-control"
                        // required
                        />
                      </td>
                      <td>

                        <Input
                          type="Number"
                          name="guest"
                          // label="Guest"
                          // required
                          control="input"
                          placeholder="Batch"
                          onChange={(e) => handleValueChange(e, row?.id, 'batch')}
                          className="form-control"
                        />

                        {/* <input
                          type="Number"
                          value={row?.age}
                          onChange={(e) => handleValueChange(e, row?.id, 'age')} />
                       */}
                      </td>

                      <td>


                        {stateOptions.length ? (
                          <Input
                            icon="down"
                            name="state"
                            // label="State"
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
                      </td>
                      <td>


                        <Input
                          name="start_date"
                          // label="Start Date"
                          // required
                          placeholder="Start Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </td>
                      <td>


                        <Input
                          name="end_date"
                          type='date'
                          // label="End Date"
                          // required
                          placeholder="End Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </td>
                      <td>


                        <Input
                          type="text"
                          name="topic"
                          // label="Topic"
                          // required
                          control="input"
                          placeholder="Topic"
                          className="form-control"
                        />
                      </td>
                      <td>


                        {stateOptions.length ? (
                          <Input
                            icon="down"
                            name="state"
                            // label="State"
                            control="lookup"
                            options={stateOptions}
                            onChange={onStateChange}
                            placeholder="Donor"
                            className="form-control"
                          // required
                          />
                        ) : (
                          <Skeleton count={1} height={45} />
                        )}
                      </td>
                      <td>


                        <Input
                          type="text"
                          name="guest"
                          // label="Guest"
                          // required
                          control="input"
                          placeholder="Guest Name"
                          className="form-control"
                        />
                      </td>
                      <td>


                        <Input
                          type="text"
                          name="designation"
                          // label="Designation"
                          // required
                          control="input"
                          placeholder="Designation"
                          className="form-control"
                        />
                      </td>
                      <td>


                        {stateOptions.length ? (
                          <Input
                            icon="down"
                            name="Organization"
                            // label="State"
                            control="lookup"
                            options={stateOptions}
                            onChange={onStateChange}
                            placeholder="Organization"
                            className="form-control"
                          // required
                          />
                        ) : (
                          <Skeleton count={1} height={45} />
                        )}
                      </td>
                      <td>


                        <Input
                          type="number"
                          name="email"
                          // label="Student Attended"
                          // required
                          control="input"
                          placeholder="Number of student"
                          className="form-control"
                        />
                      </td>
                      <td>

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
                            <label className="text-heading" style={{ color: '#787B96' }}>Please select State to view Medha Areas</label>
                            <Skeleton count={1} height={35} />
                          </>
                        )}
                      </td>



                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
       
            <button className=" btn-primary btn-regular mr-2" onClick={addRow}>Add Row</button>
            <button className="btn btn-secondary btn-regular mr-2" onClick={handleSubmit}>Submit</button>

          </Section>




       

        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Operationform;



// {/* <div className="row">
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     name="full_name"
//     label="Name"
//     required
//     control="input"
//     placeholder="Name"
//     className="form-control"
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2"> */}
// {/* {statusOptions.length ? ( */}
// {/* <Input
//       control="lookupAsync"
//       name="assigned_to"
//       label="Assigned To"
//       required
//       className="form-control"
//       placeholder="Assigned To"
//       filterData={filterAssignedTo}
//       defaultOptions={assigneeOptions}
//     /> */}
// {/* ) : ( */}
// {/* <Skeleton count={1} height={45} /> */}
// {/* )} */}
// {/* </div>  */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     name="name_of_parent_or_guardian"
//     label="Parents Name"
//     required
//     control="input"
//     placeholder="Parents Name"
//     className="form-control"
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2"> */}
// {/* {statusOptions.length ? ( */}
// {/* <Input
//       icon="down"
//       control="lookup"
//       name="status"
//       label="Status"
//       required
//       options={statusOptions}
//       className="form-control"
//       placeholder="Status"
//     /> */}
// {/* ) : ( */}
// {/* <Skeleton count={1} height={45} /> */}
// {/* )} */}
// {/* </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     name="phone"
//     label="Phone"
//     required
//     control="input"
//     placeholder="Phone"
//     className="form-control"
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     name="alternate_phone"
//     label="Alternate Phone"
//     control="input"
//     placeholder="Phone"
//     className="form-control"
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     type="email"
//     name="email"
//     label="Email"
//     // required
//     control="input"
//     placeholder="Email"
//     className="form-control"
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2"> */}
// {/* {genderOptions.length ? ( */}
// {/* <Input
//       icon="down"
//       control="lookup"
//       name="gender"
//       label="Gender_1"
//       required
//       options={genderOptions}
//       className="form-control"
//       placeholder="Gender"
//     /> */}
// {/* ) : ( */}
// {/* <Skeleton count={1} height={45} /> */}
// {/* )} */}
// {/* </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     name="date_of_birth"
//     label="Date of Birth"
//     required
//     placeholder="Date of Birth"
//     control="datepicker"
//     className="form-control"
//     autoComplete="off"
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2"> */}
// {/* {statusOptions.length ? ( */}
// {/* <Input
//       icon="down"
//       control="lookup"
//       name="category"
//       label="Category"
//       required
//       options={categoryOptions}
//       className="form-control"
//       placeholder="Category"
//     /> */}
// {/* ) : ( */}
// {/* <Skeleton count={1} height={45} /> */}
// {/* )} */}
// {/* </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2"> */}
// {/* {statusOptions.length ? ( */}
// {/* <Input
//       icon="down"
//       control="lookup"
//       name="income_level"
//       label="Income Level (INR)"
//       required
//       options={incomeLevelOptions}
//       className="form-control"
//       placeholder="Income Level (INR)"
//     /> */}
// {/* ) : ( */}
// {/* <Skeleton count={1} height={45} /> */}
// {/* )} */}
// {/* </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     control="lookupAsync"
//     name="registered_by"
//     label="Registered By"
//     className="form-control"
//     placeholder="Registered By"
//     filterData={filterAssignedTo}
//     defaultOptions={assigneeOptions}
//     isDisabled={!isAdmin()}
//   />
// </div> */}
// {/* <div className="col-md-6 col-sm-12 mb-2">
//   {howDidYouHearAboutUsOptions.length ? (
//     <Input
//       icon="down"
//       control="lookup"
//       name="how_did_you_hear_about_us"
//       label="How did you hear about us?"
//       options={howDidYouHearAboutUsOptions}
//       className="form-control"
//       placeholder="How did you hear about us?"
//       onChange={option => {
//         setSelectedHowDidYouHearAboutUs(option.value);
//       }}
//       required
//     />
//   ) : (
//     <Skeleton count={1} height={45} />
//   )}
// </div> */}
// {/* {selectedHowDidYouHearAboutUs?.toLowerCase() === 'other' && <div className="col-md-6 col-sm-12 mb-2">
//   <Input
//     name="how_did_you_hear_about_us_other"
//     label="If Other, Specify"
//     control="input"
//     placeholder="If Other, Specify"
//     className="form-control"
//     required
//   />
// </div>} */}
// {/* {(isSRM() || isAdmin()) && <div className="col-sm-12 mb-2">
//   <div className="col-md-6">
//     <Input
//       control="file"
//       name="cv_upload"
//       label="CV"
//       subLabel={showCVSubLabel && <div className="mb-1">
//         {fileName}
//       </div>}
//       className="form-control"
//       placeholder="CV"
//       accept=".pdf, .docx"
//       onChange={(event) => {
//         setFieldValue("cv_file", event.currentTarget.files[0]);
//         setShowCVSubLabel(false);
//       }}
//     />
//   </div>
// </div>} */}
// </div> */}