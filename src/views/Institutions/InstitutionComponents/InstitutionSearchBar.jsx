import React, {useState,useEffect} from 'react';
import { Formik, Form ,useFormik} from 'formik';
import styled from "styled-components";
import { Input } from '../../../utils/Form';
import { getFieldValues } from './instituteActions';


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




function InstitutionSearchBar({selectedSearchField,setSelectedSearchField,setIsSearchEnable,setSelectedSearchedValue,tab,info}) {

    const initialValues = {
        search_by_field:'',
        search_by_value:''
    }

    const [searchValueOptions,setSearchValueOptions] = useState([])
    const [progress, setProgress] = useState(0);

    const [institutionsOptions] = useState([
        {key:0, label:'Area',value:'medha_area'}, 
        {key:1,label:'Type',value:'type'},
        {key:2, label:'State',value:'state'},
        {key:3, label:'Status',value:'status'},
        {key:4, label:'Assigned To', value:'assigned_to'}
    ]);

    const [isDisabled,setDisbaled] = useState(true);

    const handleSubmit = async(values) =>{
        try {
         
            await setSelectedSearchedValue(values.search_by_value)
            setIsSearchEnable(true);
            
        } catch (error) {
            console.error("error",error)
        }
  
        ///stores the last searched result in the local storage as cache 
        ///we will use it to refresh the search results
          
        //   await localStorage.setItem("prevSearchedPropsAndValues", JSON.stringify({
        //     baseUrl:baseUrl,
        //     searchedProp:values.search_by_field,
        //     searchValue:values.search_by_value
        //   }));
  
      }

      const handleStundentsOptions = async (value)=>{
        await setSearchValueOptions([])
        setIsSearchEnable(false);
        setSelectedSearchField(value);
      }

    const formik = useFormik({ // Create a Formik reference using useFormik
        initialValues,
        onSubmit: handleSubmit,
    });

    const clear = async(formik)=>{
        formik.setValues(initialValues);
        setSelectedSearchField(null)
        setIsSearchEnable(false);
        setDisbaled(true);
        setSearchValueOptions([])
      }

      //setting the value of the value drop down

    
      const filterSearchValue = async(newValue)=>{
      
        const matchedObjects = searchValueOptions.filter(obj =>obj.label && obj.label.toLowerCase().includes(newValue.toLowerCase())
          )
        return matchedObjects;
      }

const handleLoaderForSearch = async ()=>{
  setProgress(0)
}
    
useEffect(()=>{
    
    const setSearchValueDropDown = async () =>{
      try {
        const interval = setInterval(() => {
          // Simulate progress update
          setProgress((prevProgress) =>
            prevProgress >= 90 ? 0 : prevProgress + 5
          );
          
        }, 1000);

        const {data} = await getFieldValues(selectedSearchField,'institutions',tab,info)
        clearInterval(interval)
        handleLoaderForSearch();
        await setSearchValueOptions(data);
        

      } catch (error) {
        console.error("error",error)
      }

    }

    if(selectedSearchField){
        setDisbaled(false);
        setSearchValueDropDown();
    }

}, [selectedSearchField])

useEffect(()=>{
  async function refreshOnTabChange(){
  await clear(formik);
}

refreshOnTabChange()
},[tab])

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
                        options={institutionsOptions}
                        className="form-control"
                        onChange = {(e)=>handleStundentsOptions(e.value)}
                    />
                </div>
                <div className='col-lg-3 col-md-4 col-sm-12 mb-2' style={{position:'relative'}}>
                    {searchValueOptions.length ? (
                      <>
                      <Input
                        name="search_by_value"
                        label="Search Value"
                        className="form-control"
                        control="lookupAsync"
                        defaultOptions={searchValueOptions.slice(0, 100)}
                        filterData={filterSearchValue}
                        onChange={()=>setIsSearchEnable(false)}
                      />
                      <div
                          style={
                            {
                            position: "absolute",
                            width: `${progress}%`,
                            height: "4px",
                            backgroundColor: "#198754",
                          }
                        }
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          name="search_by_value"
                          control="input"
                          label="Search Value"
                          className="form-control"
                          disabled={true} 
                        />
                        <div
                          style={
                            {
                            position: "absolute",
                            width: `${progress}%`,
                            height: "4px",
                            backgroundColor: "#198754",
                          }
                        }
                        />
                      </>
                    )}
                  </div>

                <div className="col-lg-3 col-md-4 col-sm-12 mt-3 d-flex justify-content-start align-items-center">
                <button className="btn btn-primary btn-regular" type="submit" disabled={isDisabled?true:false}>
                FIND
            </button>
            <button  className="btn btn-secondary btn-regular mr-2" type='button' onClick={() => clear(formik)} disabled={isDisabled?true:false}>
                CLEAR
            </button>
        </div>   
            </div>
        </Section>
    </Form>)}
</Formik>
   
  )
}

export default InstitutionSearchBar;