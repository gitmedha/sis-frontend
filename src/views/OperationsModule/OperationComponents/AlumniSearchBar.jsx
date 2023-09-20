import React,{Fragment,useState} from 'react'
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
const AlumniSearchBar =({searchOperationTab,resetSearch})=> {

  let options = [
    {key:0, value:'student_name', label:'Student Name'}, 
    {key:1, value:'phone', label:'Mobile'}, 
    {key:2, value:'student_id.student_id', label:'Student ID'},
    {key:3,value:'email', label:'Email'},
    {key:4, value:'status', label:'Status'}
  ]

  const [studentNameOptions,setStudentNameOptions] = useState([]);
  const [phoneOptions,setPhoneOptions] = useState([]);
  const [studentIdOptions,setStudentIdOptions] = useState([]);
  const [emailOptions,setEmailOptions] = useState([]);
  const [selectedSearchField, setSelectedSearchField] = useState('');
  const [statusOptions] = useState([
    {key:0, value:'Resolved', label:'Resolved'},
    {key:1, value:'Open', label:'Open'},
    {key:2, value:'Closed', label:'Closed'}
]);


const setSearchItem = (value)=>{
  setSelectedSearchField(value)

  if(value === 'student_name'){
    setDropdownValues(value)
  }

  else if(value === 'phone'){
    setDropdownValues(value)
  }
  else if (value.includes("student_id")){
    setDropdownValues("student_id")
  }
  else if (value === "email"){
    setDropdownValues(value)
  }
}
const setDropdownValues = async (fieldName)=>{
  try {
   const {data} =  await getFieldValues(fieldName, 'alumni-queries')

   if(fieldName === 'student_name'){
    setStudentNameOptions(data)
  }

  else if(fieldName === 'phone'){
    setPhoneOptions(data)
  }
  else if (fieldName === "student_id"){
    setStudentIdOptions(data)
  }
  else if (fieldName === "email"){
    setEmailOptions(data)
  }
  
  } catch (error) {
    console.error("error", error);
  }
}
        

    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }



    const handleSubmit = async(values) =>{
        let baseUrl = 'alumni-queries'
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
                          selectedSearchField === "student_name" &&
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
                          selectedSearchField === "phone" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={phoneOptions}
                                className="form-control"
                            />
                          }
                          {
                          selectedSearchField === "student_id.student_id" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={studentIdOptions}
                                className="form-control"
                            />
                          }
                          {
                          selectedSearchField === "email" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={emailOptions}
                                className="form-control"
                            />
                          }
                          {
                          selectedSearchField === "status" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={statusOptions}
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


export default connect(null, {searchOperationTab,resetSearch})(AlumniSearchBar);
