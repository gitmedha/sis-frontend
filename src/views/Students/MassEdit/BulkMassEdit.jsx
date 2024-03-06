import React, { useEffect, useState } from "react";
import Textarea from "../../../utils/Form/Textarea";
import { Input } from "../../../utils/Form";
import styled from "styled-components";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import Select from "react-select";

const BulkMassEdit = (props) => {

  const {dataPoints}=props;

  let datavalues={
    assigned_to:dataPoints.assigned_to,
    category: dataPoints.category,
    comments: dataPoints.comments,
    end_date: dataPoints.end_date,
    fee_amount: dataPoints.fee_amount,
    fee_submission_date: dataPoints.fee_submission_date,
    location: dataPoints.location,
    program_mode: dataPoints.program_mode,
    receipt_number: dataPoints.receipt_number,
    start_date: dataPoints.start_date,
    type: dataPoints.type,
    student_id: dataPoints.student_id,
    id:dataPoints.id
  }
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startdate,setStartDate]=useState('')
  const [categoryOption,setcategoryOption]=useState([{
    value:datavalues.category,
    label:datavalues.category
  }
  ])

  const [subCategoryOption,setsubCategoryOption]=useState([{
    value:datavalues.type,
    label:datavalues.type
  }
  ])

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      console.log("data", data);
      setAssigneeOptions(data);
    });
  }, []);

  return (
    <>
      <td>
        <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="assigned_to"
          options={assigneeOptions}
          defaultValue={() => filterAssignedTo(datavalues.assigned_to)}
          onChange={(e) =>  props.handelChange(dataPoints.id , {assigned_to:e?.value} )}
        />
      </td>
      <td>
        <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="assigned_to"
          options={props.categoryOptions}
          defaultValue={categoryOption[0]}
          onChange={(e) =>{
            setSelectedCategory(e?.value)
            props.handelChange(dataPoints.id , {category:e?.value} )}}
        />
      </td>
      <td>
        <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="assigned_to"
          options={props.typeOptions.filter(
            (option) => option.category === dataPoints.category
          )}
          defaultValue={subCategoryOption[0]}
          onChange={(e) => props.handelChange(dataPoints.id , {type:e?.value} )}
        />
      </td>
      <td>
        <input
          type="date"
          className={`table-input `}
          defaultValue={dataPoints.start_date}
          onChange={(e) => {
            setStartDate(e.target.value);
            props.handelChange(dataPoints.id , {start_date:e?.target.value} );
          }}
        />
      </td>
      <td>
      <input
            type="date"
            className={`table-input`}
            defaultValue={dataPoints.end_date}
            min={startdate}
            onChange={(e) => {
              
              props.handelChange(dataPoints.id , {end_date:e?.target.value})
            }}
          />
      </td>
      <td>
        <input className="table-input" onChange={(e)=>props.handelChange(dataPoints.id , {fee_amount:e?.target.value})} defaultValue={dataPoints.fee_amount} type="text" name="sub_category" />
      </td>
      <td>
      <input
            type="date"
            className={`table-input`}
            defaultValue={dataPoints.fee_submission_date}
            onChange={(e) => {
              props.handelChange(dataPoints.id , {fee_submission_date:e?.target.value})
            }}
          />
      </td>
      <td>
      <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="assigned_to"
          options={props.locationOptions}
          defaultValue={{value:dataPoints.location,label:dataPoints.location}}
          onChange={(e) => props.handelChange(dataPoints.id , {location:e?.value})}
        />
      </td>
      <td>
      <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="assigned_to"
          options={props.programOptions}
          defaultValue={{value:dataPoints.program_mode,label:dataPoints.program_mode}}
          onChange={(e) => props.handelChange(dataPoints.id , {program_mode:e?.value})}
        />
      </td>
      <td>
        <input className="table-input" defaultValue={dataPoints.receipt_number} type="text" name="sub_category" />
      </td>
    </>
  );
};

export default BulkMassEdit;
