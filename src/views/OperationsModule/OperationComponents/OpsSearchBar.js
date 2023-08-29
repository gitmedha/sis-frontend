import React,{useState, Fragment} from 'react'
import {connect} from 'react-redux';
import { Input } from '../../../utils/Form';
import { Formik, FieldArray, Form } from 'formik';
import styled from "styled-components";
import {searchOperationTab} from '../../../store/reducers/Operations/actions';

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
const OpsSearchDropdown = function OpsSearchBar({searchOptions,searchOperationTab}) {

    const [options] = useState(
        searchOptions.map(object => ({
          key: object.Header,
          value: object.Header,
          label: object.Header
        }))
      );
      
    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const handleSubmit = async(values) =>{

      let searchField;
      if(values.search_by_field === "Activity type"){
        searchField = "activity_type";
      }

        await searchOperationTab(searchField,values.search_by_value)
    }


  return (
    <Fragment>
        <Formik 
            initialValues={initialValues}
            onSubmit={handleSubmit}
            >
            <Form>
                <Section>
                    <div className="row">
                        <div className='col-lg-2 col-md-6 col-sm-12 mb-2'>
                            <Input
                                icon="down"
                                name="search_by_field"
                                label="Search Field"
                                control="lookup"
                                options={options}
                                className="form-control"
                            />
                        </div>
                        <div className='col-lg-3 col-md-6 col-sm-12 mb-2'>
                        <Input
                            name="search_by_value"
                            control="input"
                            label="Search Value"
                            className="form-control"
                            />
                        </div>   
                    </div>
                </Section>
                <div className="d-flex justify-content-start mb-2">
                    <button  className="btn btn-secondary btn-regular mr-2" type='button'>
                        CLEAR
                    </button>
                    <button className="btn btn-primary btn-regular" type="submit">
                        FIND
                    </button>
                </div>
          


            </Form> 
        </Formik>
    </Fragment>
  )
}


export default connect(null, {searchOperationTab})(OpsSearchDropdown);
