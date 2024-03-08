import React, { useEffect } from 'react'

const CheckBoxForm = (props) => {


  const handleChange = (event,key) => {
    if(event.target.checked && key=="massEdit"){
      props.setMassEditCheck(true);
      props.setBulkAddCheck(false)
    }else{
      props.setBulkAddCheck(true)
    }
  };

  const handleBulkChange = (event,key) => {
    if(event.target.checked && key=="bulk"){
      props.setBulkAddCheck(true);
      props.setMassEditCheck(false)
    }else{
      props.setMassEditCheck(true)
      
    }
  };



  

  return (
    <>
      <div className="d-flex">
            <div className="mr-3">
              <input type="checkbox" id="scales" name="scales" checked={props.bulkcheck} onChange={(e)=>handleBulkChange(e,'bulk')}  />
              <label for="scales">{props.bulkAdd}</label>
            </div>

            <div className="ml-3">
              <input type="checkbox" id="scales" name="scales" checked={props.masscheck} onChange={(e)=>handleChange(e,"massEdit")}  />
              <label for="scales">{props.massEdit} </label>
            </div>
          </div>
    </>
  )
}

export default CheckBoxForm;


