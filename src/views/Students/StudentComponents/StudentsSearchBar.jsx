import React, {useState} from 'react';
import {connect} from 'react-redux';
import { Formik, FieldArray, Form ,useFormik} from 'formik';
import styled from "styled-components";
import { Input } from '../../../utils/Form';


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




function StudentsSearchBar({tab}) {

    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const [selectedSearchField, setSelectedSearchField] = useState(null);
    const [studentsOptions,setStudentsOptions] = useState([
        {key:0, label:'Name',value:'full_name'}, 
        {key:1,label:'Student ID',value:'student_id'},
        {key:2, label:'Area', value:'area'},
        {key:3, label:'Phone',value:'phone'},
        {key:4, label:'Email', value:'email'},
        {key:5, label:'Status',value:'status'},
        {key:6, label:'Registration Date', value:'registration_date'},
        {key:7, label:'Assigned To', value:'assigned_to.username'}
    ]);



    const handleSubmit = async(values) =>{
        let baseUrl = 'users-ops-activities'
        //   await searchOperationTab(baseUrl,values.search_by_field,values.search_by_value)
  
        //   //stores the last searched result in the local storage as cache 
        //   //we will use it to refresh the search results
          
        //   await localStorage.setItem("prevSearchedPropsAndValues", JSON.stringify({
        //     baseUrl:baseUrl,
        //     searchedProp:values.search_by_field,
        //     searchValue:values.search_by_value
        //   }));
  
      }

    const formik = useFormik({ // Create a Formik reference using useFormik
        initialValues,
        onSubmit: handleSubmit,
    });

    const clear = async(formik)=>{
        formik.setValues(initialValues);
        // await resetSearch()
        setSelectedSearchField(null)
        // setDisbaled(true);
      }

  return (
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
                        options={studentsOptions}
                        className="form-control"
                        // onChange = {(e)=>setSearchItem(e.value)}
                    />
                </div>
                <div className='col-lg-3 col-md-4 col-sm-12 mb-2'>
                {
                selectedSearchField === null && <Input
                    name="search_by_value"
                    control="input"
                    label="Search Value"
                    className="form-control"
                    // onClick = {()=>setIsFieldEmpty(true)}
                    disabled={true}
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
   
  )
}

export default StudentsSearchBar