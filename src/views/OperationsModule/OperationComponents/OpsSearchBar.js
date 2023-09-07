import React,{useState, Fragment,useEffect} from 'react'
import {connect} from 'react-redux';
import { Input } from '../../../utils/Form';
import { Formik, FieldArray, Form ,useFormik} from 'formik';
import styled from "styled-components";
import {searchOperationTab,resetSearch} from '../../../store/reducers/Operations/actions';

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
const OpsSearchDropdown = function OpsSearchBar({searchOperationTab,tab,resetSearch}) {

    const initialOptions = ()=>{
 
      switch(tab){
        case "opsTab":
        return [{key:0,value:'assigned_to.username',label:'Assigned To'}, {key:1,value:'activity_type',label:'Activity type'}, {key:2, value:'batch.name', label:'Batch'},{key:3, value:'area', label:'Area'}];

        case "totTab":
          return [{key:0, value:'username',label:'User Name'}, {key:1, value:'city',label:'City'}, {key:2, value:'project_name',label:'Project Name'}, {key:3, value:'project_department',label:'Project Department'}];
        case "upSkillingTab":
          return [{key:0,value:'student_name',label:'Student Name'}, {key:1, value:'assigned_to', label:'Assigned to'}, {key:2, value:'institution', label:'Institute Name'}, {key:3, value:'course_name', label:'Course Name'}]
        case "sditTab":
          return [{key:0, value:'student_name',label:'Student Name'}, {key:1, value:'institution', label:'Institute Name'}, {key:2, value:'course_name',label:'Course Name'}]
        case "alumniTab":
          return [{key:0, value:'student', label:'Student Name'}, {key:1, value:'mobile', label:'Mobile'}]
        case "collegePitchTab":
          return [{key:0, value:'student', label:'Student Name'}, {key:1,value:'area', label:'Area'}, {key:2,value:'mobile',label:'Mobile'}, {key:3, value:'college', label:'College Name'}]
        
       
        default:
          return;
      }

    }

    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const handleSubmit = async(values) =>{
        await searchOperationTab(values.search_by_field,values.search_by_value)
    }

    const options = initialOptions()
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
                            />
                        </div>
                        <div className='col-lg-3 col-md-4 col-sm-12 mb-2'>
                        <Input
                            name="search_by_value"
                            control="input"
                            label="Search Value"
                            className="form-control"
                            />
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


export default connect(null, {searchOperationTab,resetSearch})(OpsSearchDropdown);
