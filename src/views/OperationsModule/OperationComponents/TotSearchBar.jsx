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
const TotSearchBar =({searchOperationTab,resetSearch})=> {

  let options = [ 
    {key:0, value:'city',label:'City'}, 
    {key:1, value:'project_name',label:'Project Name'}, 
    {key:2, value:'partner_dept',label:'Project Department'}, 
    {key:6, value:'state',label:'State'},
    {key:3, value:'project_type',label:'Project Type'},
    {key:4, value:'trainer_1',label:'Trainer 1'},
    {key:5, value:'trainer_2',label:'Trainer 2'},  
  ];

  const [cityOptions,setCityOptions] = useState([]);
  const [projectNameOptions, setProjectNameOptions] = useState([]);
  const [partnerDeptOptions, setParnterDeptOptions] = useState([]);

  const [projectTypeOptions] = useState([
    {
      key:0, 
      label:'External',
      value:'External'
  }, 
  {
    key:1,
    label:'Internal',
    value:'Internal'
  }]);

  const [trainerOneOptions,setTrainerOneOptions] = useState([]);
  const [trainerTwoOptions,setTrainerTwoOptions] = useState([]);
  const [selectedSearchField, setSelectedSearchField] = useState('');
  const [stateOptions,setStateOptions] = useState([]);
        
    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const handleSubmit = async(values) =>{
        let baseUrl = 'users-tots'
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
   
      if(value === 'city'){
        setDropdownValues('city')
      }
  
      else if(value === 'project_name'){
        setDropdownValues('project_name')
      }
      else if (value === "partner_dept"){
        setDropdownValues('partner_dept')
      }
      else if (value === "trainer_1"){
        setDropdownValues('trainer_1')
      }
      else if (value === "trainer_2"){
        setDropdownValues('trainer_2')
      }
      else if (value === "state"){
        setDropdownValues('state')
      }

    }

    const setDropdownValues = async (fieldName)=>{
      try {
       const {data} =  await getFieldValues(fieldName,'users-tots')
    
       if(fieldName === 'city'){
        setCityOptions(data)
      }
  
      else if(fieldName === 'project_name'){
        setProjectNameOptions(data)
      }
      else if (fieldName === "partner_dept"){
        setParnterDeptOptions(data)
      }
      else if (fieldName === "trainer_1"){
        setTrainerOneOptions(data)
      }
      else if (fieldName === "trainer_2"){
        setTrainerTwoOptions(data)
      }
      else if (fieldName === "state"){
        setStateOptions(data)
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
                            selectedSearchField === "city" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={cityOptions}
                                className="form-control"
                            />
                          }
                          {
                            selectedSearchField === "project_name" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={projectNameOptions}
                                className="form-control"
                            />
                          }
                          {
                            selectedSearchField === "partner_dept" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={partnerDeptOptions}
                                className="form-control"
                            />
                          }
                          {
                            selectedSearchField === "project_type" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={projectTypeOptions}
                                className="form-control"
                            />
                          }
                          {
                            selectedSearchField === "trainer_1" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={trainerOneOptions}
                                className="form-control"
                            />
                          }
                          {
                            selectedSearchField === "trainer_2" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={trainerTwoOptions}
                                className="form-control"
                            />
                          }
                          {
                            selectedSearchField === "state" &&
                            <Input 
                                icon="down"
                                name="search_by_value"
                                label="Search Value"
                                control="lookup"
                                options={stateOptions}
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


export default connect(null, {searchOperationTab,resetSearch})(TotSearchBar);
