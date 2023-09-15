import React,{useState, Fragment,useEffect} from 'react'
import {connect} from 'react-redux';
import { Input } from '../../../utils/Form';
import { Formik, FieldArray, Form ,useFormik} from 'formik';
import styled from "styled-components";
import {searchOperationTab,resetSearch} from '../../../store/reducers/Operations/actions';

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
const CollegePitchSearch = ({searchOperationTab,resetSearch}) =>{



  let options = [{key:0, value:'student_name', label:'Student Name'}, {key:1,value:'area', label:'Area'}, {key:2,value:'phone',label:'Mobile'}, {key:3, value:'college_name', label:'College Name'}]
        

    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const handleSubmit = async(values) =>{
        
      let baseUrl = "college-pitches";
        await searchOperationTab(baseUrl,values.search_by_field,values.search_by_value)
    }
    const formik = useFormik({
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


export default connect(null, {searchOperationTab,resetSearch})(CollegePitchSearch);
