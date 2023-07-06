import { Formik, Form } from 'formik';
import { Modal, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { urlPath } from "../../../constants";
import { getAddressOptions, getStateDistricts } from "../../Address/addressActions";
import { filterAssignedTo, getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';
import { isAdmin, isSRM } from "../../../common/commonFunctions";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import { MeiliSearch } from 'meilisearch'

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
  .table {
    overflow: auto;
    display: block;
    table-layout: auto;
    }
    .table-container {
      overflow-x: auto;
    }
    th{
      width:15rem
    }
    .id{
      width:3rem !important;
    }
`;

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const OperationCreateform = (props) => {
  let { onHide, show } = props;


  const [data, setData] = useState([
    { id: 1,
    no_of_student:"",
    name:"",
    institution:"",
    batch:"",
    state:"",
    start_date:"",
    end_date:"",
    topic:"",
    donor:"",
    guest:"",
    designation:"",
    organization:"" },
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

  const handleDeleteRow = (rowId) => {
    setData((prevRows) => prevRows.filter((row) => row.id !== rowId));
    console.log("123",data);
  };

  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [show1, setShow1] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);


  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);

  useEffect(() => {


    getAddressOptions().then(data => {
      console.log("data--------------->", data?.data?.data?.geographiesConnection);
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

  const handleInputChange = (e, index, field) => {
    const { value } = e;
    console.log(e.target.value);
    setData((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const onSubmit = async (values) => {
    // if (logo) {
    //   values.logo = logo;
    // }
    console.log("onsubmit values----------->", values);
    setDisableSaveButton(true);
    await onHide(values);
    setDisableSaveButton(false);
  };



  const addRow = () => {
    // const newRowId = data.length + 1;
    if (data.length === 10) {
      return;
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

    getAddressOptions().then(data => {
      setStateOptions(data?.data?.data?.geographiesConnection.groupBy.state.map((state) => ({
        key: state.id,
        label: state.key,
        value: state.key,
      })).sort((a, b) => a.label.localeCompare(b.label)));


    });


  }, []);





  const handleRowData = (rowData) => {
    // Do something with the row data
    console.log(rowData);
  };

  useEffect(() => {
    
      
      filterInstitution().then(data => {
        console.log("data institute",data)
        setInstitutionOptions(data);
      });


    
   
      filterBatch().then(data => {
        console.log("dataBatch1:", data)
        setBatchOptions(data);
      });
    
      
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
      size="xl"
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
          onSubmit={onSubmit}
        >


          <Section>
            <div className='d-flex justify-content-between'>
              <h2 className="section-header">Basic Info</h2>


            </div>


            <div  >

              <Table style={{ width: '150%' }} striped bordered responsive >


                <thead>
                  <tr>
                    <th className='id'>ID</th>
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
                <tbody className='mb-5'>
                  {data && data?.map((row) => (


                    <tr key={row?.id}>
                      <td>{row.id}</td>
                      <td >

                        <Input
                          type="text"
                          name="name"
                          label="Name"
                          control="input"
                          placeholder="Name"
                          className="form-control"
                          onChange={(e)=>console.log(e.target.value)}
                        />

                      </td>
                      <td>

                        <Input
                          control="lookupAsync"
                          name="institution"
                          label="Institution"
                          filterData={filterInstitution}
                          defaultOptions={institutionOptions}
                          placeholder="Institution"
                          className="form-control"
                          isClearable
                          // onChange={(e)=>console.log(e.target.value)}
                        />
                        
                      </td>
                      <td>

                        <Input
                          control="lookupAsync"
                          name="batch"
                          label="Batch"
                          required
                          filterData={filterBatch}
                          defaultOptions={batchOptions}
                          className="form-control"
                          placeholder="Batch"
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
                          label="Topic"
                          // required
                          control="input"
                          placeholder="Topic"
                          className="form-control"
                        />
                        

                      </td>
                      <td>

                      <Input
                          type="text"
                          name="donor"
                          label="Donor"
                          // required
                          control="input"
                          placeholder="Topic"
                          className="form-control"
                        />
                        {/* {stateOptions.length ? (
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
                        )} */}
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
                          onChange={(e)=>handleInputChange(e,row.id,"guest")}
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
                          onChange={(e)=>handleInputChange(e,row.id,"designation")}
                        />
                      </td>
                      <td>
                          

                       
                          <Input
                            icon="down"
                            control="input"
                            name="organization"
                            // label="State"
                           
                            // options={stateOptions}
                            onChange={(e)=>handleInputChange(e,row.id,"organization")}
                            placeholder="Organization"
                            className="form-control"
                          // required
                          />
                        
                      </td>
                      <td>


                        <Input
                          type="number"
                          name="no_of_student"
                          // label="Student Attended"
                          // required
                          control="input"
                          placeholder="Number of student"
                          className="form-control"
                          onChange={(e)=>handleInputChange(e,row.id,"no_of_student")}
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

                      <td>
                        <button className="btn btn-secondary btn-regular mr-1" onClick={() => handleDeleteRow(row.id)}>Delete</button>
                      </td>

                    </tr>
                  ))}
                </tbody>

                <button className=" btn-primary btn-regular mr-2 mt-5" onClick={addRow}>Add Row</button>
                <button className="btn btn-secondary btn-regular mr-2 " onClick={handleSubmit}>Submit</button>

              </Table>
            </div>



          </Section>






        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default OperationCreateform;



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