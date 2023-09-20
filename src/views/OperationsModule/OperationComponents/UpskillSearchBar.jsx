import React,{useState, Fragment,useEffect} from 'react'
import {connect} from 'react-redux';
import { Input } from '../../../utils/Form';
import { Formik, FieldArray, Form ,useFormik} from 'formik';
import styled from "styled-components";
import {searchOperationTab,resetSearch} from '../../../store/reducers/Operations/actions';
import {getFieldValues} from './operationsActions';

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
    {key:0,value:'student_id.full_name',label:'Student Name'}, 
    {key:1, value:'assigned_to.username', label:'Assigned to'}, 
    {key:2, value:'institution.name', label:'Institute Name'}, 
    {key:3, value:'course_name', label:'Course Name'},
    {key:4, value:'program_name', label:'Program Name'},

  ]

  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [courseNameOptions, setCourseNameOptions] = useState([]);

  const [programNameOptions] = useState([
    {key:0, label:'B.Com II', value:'B.Com II'},
    {key:1, label:'Employability Skills', value:'Employability Skills'},
    {key:2, label:'Integrative Communication', value:'Integrative Communication'},
    {key:3, label:'ITI Pilot', value:'ITI Pilot'},
    {key:4, label:'School Intervention', value:'School Intervention'},
    {key:5, label:'SEB', value:'SEB'},
    {key:6, label:'Workshop', value:'Workshop'},
    {key:7, label:'In The Bank', value:'In The Bank'},
    {key:8, label:'CAB Plus Work from Home', value:'CAB Plus Work from Home'},
    {key:9, label:'eTAB', value:'eTAB'},
    {key:10, label:'Life Skills Advancement Bootcamp', value:'Life Skills Advancement Bootcamp'},
    {key:11, label:'Svapoorna', value:'Svapoorna'},
    {key:12, label:'eCAB', value:'eCAB'},
    {key:13, label:'Swarambh', value:'Swarambh'},
    {key:14, label:'Career Advancement Bootcamp', value:'Career Advancement Bootcamp'},
    {key:15, label:'Technology Advancement Bootcamp', value:'Technology Advancement Bootcamp'},
    {key:16, label:'BMC Design Lab', value:'BMC Design Lab'}
  ]);

   const [selectedSearchField, setSelectedSearchField] = useState('');
        

    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const handleSubmit = async(values) =>{
      let baseUrl = "students-upskillings";

       await searchOperationTab(baseUrl,values.search_by_field,values.search_by_value)
      
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
