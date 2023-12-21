import React,{useState, Fragment,useEffect} from 'react'
import {connect} from 'react-redux';
import { Input } from '../../../utils/Form';
import { Formik, FieldArray, Form ,useFormik} from 'formik';
import styled from "styled-components";
import {searchOperationTab,resetSearch} from '../../../store/reducers/Operations/actions';
import {getFieldValues} from './operationsActions';
import * as Yup from "yup";

const Section = styled.div`
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
const UpSkillSearchBar = function UpSkillSearch({searchOperationTab,resetSearch}) {

  let options = [
    {key:1, value:'assigned_to.username', label:'Assigned to'}, 
    {key:3, value:'course_name', label:'Course Name'},
    {key:6, value:'end_date', label:'End Date'},
    {key:2, value:'institution.name', label:'Institute Name'}, 
    {key:5, value:'start_date', label:'Start Date'},
    {key:0,value:'student_id.full_name',label:'Student Name'}, 
    {key:4, value:'program_name', label:'Program Name'},
  ]

  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [courseNameOptions, setCourseNameOptions] = useState([]);

  const [programNameOptions,setProgramOptions] = useState([]);

   const [selectedSearchField, setSelectedSearchField] = useState('');
        
   let today = new Date();
    const initialValues = {
        search_by_field:'',
        search_by_value:'',      
        search_by_value_date_to:new Date(new Date(today).setDate(today.getDate() )),
        search_by_value_date:new Date(new Date(today).setDate(today.getDate() )),
        search_by_value_date_end_from:new Date(new Date(today).setDate(today.getDate() )),
        search_by_value_date_end_to:new Date(new Date(today).setDate(today.getDate() )),
    }
    const validate = Yup.object().shape({
      search_by_value_date: Yup.date().required("Start date is required"),
      search_by_value_date_to: Yup.date()
        .required("End date is required")
        .when("search_by_value_date", (start, schema) => {
          return schema.min(
            start,
            "End date must be greater than or equal to start date"
          );
        }),
        search_by_value_date_end_from :Yup.date().required("Start date is required"),
        search_by_value_date_end_to: Yup.date()
        .required("End date is required")
        .when("search_by_value_date_end_from", (start, schema) => {
          return schema.min(
            start,
            "End date must be greater than or equal to start date"
          );
        }),
        
    });
    const formatdate =(dateval)=>{
      const date = new Date(dateval);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
      const dd = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${yyyy}-${mm}-${dd}`;
      return formattedDate;

    }

    const handleSubmit = async(values) =>{
      let baseUrl = "students-upskillings";
      //  await searchOperationTab(baseUrl,values.search_by_field,values.search_by_value)
      if(values.search_by_field === "start_date" || values.search_by_field === "end_date"){
        // let baseUrl = 'alumni-queries'
        if(values.search_by_field == "start_date"){
          const date1 = formatdate(values.search_by_value_date);
          const date2 = formatdate(values.search_by_value_date_to);
          let val ={
            start_date:date1,
            end_date:date2
          }
          await searchOperationTab(baseUrl,values.search_by_field,val)
        }
        if(values.search_by_field == "end_date"){
          const date1 = formatdate(values.search_by_value_date_end_from);
          const date2 = formatdate(values.search_by_value_date_end_to);
          let val ={
            start_date:date1,
            end_date:date2
          }
          await searchOperationTab(baseUrl,values.search_by_field,val)
        }
      }
      else {
        // let baseUrl = 'alumni-queries'
        await searchOperationTab(baseUrl,values.search_by_field,values.search_by_value)

      }
    }
    const formik = useFormik({ // Create a Formik reference using useFormik
      initialValues,
      onSubmit: handleSubmit,
  });


    const clear = async(formik)=>{
      formik.setValues(initialValues);
      await resetSearch()
    }

    const setSearchItem = (value)=>{

      setSelectedSearchField(value)
   
      if(value === 'student_id.full_name'){
        setDropdownValues('student_id')
      }
  
      else if(value === 'assigned_to.username'){
        setDropdownValues('assigned_to')
      }
      else if (value === "institution.name"){
        setDropdownValues('institution')
      }
      else if (value === "course_name"){
        setDropdownValues('course_name')
      }
      else if (value === "program_name"){
        setDropdownValues('program_name')
  
      }

    }

    const setDropdownValues = async (fieldName)=>{
      try {
       const {data} =  await getFieldValues(fieldName, 'students-upskillings')
    
       if(fieldName === 'student_id'){
        setStudentNameOptions(data)
      }
  
      else if(fieldName === 'assigned_to'){
        setAssignedToOptions(data)
      }
      else if (fieldName === "institution"){
        setInstitutionOptions(data)
      }
      else if (fieldName === "course_name"){
        setCourseNameOptions(data)
      }
      else if (fieldName === "program_name"){
        setProgramOptions(data);
       }
      
      } catch (error) {
        console.error("error", error);
      }
    }

  return (
    <Fragment>
        <Formik 
            initialValues={initialValues}
            onSubmit={handleSubmit}
            >
          {formik=>(<Form>
                <Section>
                    <div className="row align-items-center">
                        <div className='col-lg-2 col-md-4 col-sm-12 mb-2'>
                            <Input
                                icon="down"
                                name="search_by_field"
                                label="Search Field"
                                control="lookup"
                                options={options}
                                className="form-control"
                                onChange = {(e)=>setSearchItem(e.value)}
                            />
                        </div>
                        <div className='col-lg-3 col-md-4 col-sm-12 mb-2'>
                        {
                        selectedSearchField === "" && <Input
                            name="search_by_value"
                            control="input"
                            label="Search Value"
                            className="form-control"
                            disabled={true}
                            />
                            }

{ selectedSearchField === "start_date" && 
                          <div className='d-flex justify-content-between align-items-center'>
                          <div className='mr-3'>
                          <Input
                              name="search_by_value_date"
                              label="From"
                              placeholder="Query start date"
                              control="datepicker"
                              className="form-control "
                              autoComplete="off"

                            />
                          </div>
                          <div className='ml-2'>
                          <Input
                              name="search_by_value_date_to"
                              label="To"
                              placeholder="Query start date"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                            
                            />
                          </div>
                           
                            
                          </div>
                            
                            
                          }

                          { selectedSearchField === "end_date" && 
                            <div className='d-flex justify-content-between align-items-center'>
                            <div className='mr-3'>
                            <Input
                                name="search_by_value_date_end_from"
                                label="From"
                                placeholder="Query start date"
                                control="datepicker"
                                className="form-control "
                                autoComplete="off"
  
                              />
                            </div>
                            <div className='ml-2'>
                            <Input
                                name="search_by_value_date_end_to"
                                label="To"
                                placeholder="Query start date"
                                control="datepicker"
                                className="form-control"
                                autoComplete="off"
                              
                              />
                            </div>
                             
                              
                            </div>
                          }

                        {
                          selectedSearchField === "student_id.full_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={studentNameOptions}
                                className="form-control"
                            />
                          }

                        {
                          selectedSearchField === "assigned_to.username" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={assignedToOptions}
                                className="form-control"
                            />
                          }
                          {
                          selectedSearchField === "institution.name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={institutionOptions}
                                className="form-control"
                            />
                          }

{
                          selectedSearchField === "course_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={courseNameOptions}
                                className="form-control"
                            />
                          }
                          {
                          selectedSearchField === "program_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={programNameOptions}
                                className="form-control"
                            />
                          }
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-start align-items-center">
                        <button className="btn btn-primary btn-regular" type="submit">
                        FIND
                    </button>
                    <button  className="btn btn-secondary btn-regular mr-2" type='button' onClick={() => clear(formik)}>
                        CLEAR
                    </button>
                </div>   
                    </div>
                </Section>
            </Form>)}
        </Formik>
    </Fragment>
  )
}


export default connect(null, {searchOperationTab,resetSearch})(UpSkillSearchBar);
