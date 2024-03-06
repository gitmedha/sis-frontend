import React, { useEffect, useState } from "react";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import { filterAssignedTo, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";



const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

function BulkMassEmployerEdit(props) {

  const {dataPoints}=props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [defaultAssignee,setDefaultAssignee]=useState({})
  const [startdate,setStartDate]=useState('');
  const [employerOptions, setEmployerOptions] = useState([]);
  let datavalues={
    assigned_to:dataPoints.assigned_to,
    end_date: dataPoints.end_date,
    start_date: dataPoints.start_date,
    student_id: dataPoints.student_id,
    id:dataPoints.id
  }

  useEffect(async() => {
    // console.log(props.statusOptions);
    // console.log(await filterAssignedTo(datavalues.assigned_to));
    console.log("dataPoints",dataPoints);
    // console.log({value:dataPoints.status,label:dataPoints.status});
   
  }, [props])


  useEffect(()=>{
    const fetchData = async () => {
      // let defaultEmployer = await props.filterEmployer(dataPoints.employer);
      // console.log(defaultEmployer);

      let data = await getDefaultAssigneeOptions(dataPoints.assigned_to);
      setAssigneeOptions(data);
      let value = data.find(obj => obj.value === dataPoints.assigned_to);

      setDefaultAssignee(value);
  };
  fetchData()
  },[])
  
  
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
          defaultValue={defaultAssignee}
          onChange={(e) =>
            props.handelChange(dataPoints.id, { assigned_to: e?.value })
          }
        />
      </td>
      <td>
        <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          options={props.employerOptions}
          defaultValue={dataPoints.employer}
          onInputChange={(e)=>{
            props.filterEmployer(e)
          }}
          onChange={(e) => {
            props.updateEmployerOpportunityOptions(e?.value)
            props.handelChange(dataPoints.id, { employer: e?.value });
          }}
        />
      </td>
      <td>
        <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}

          options={props.employerOpportunityOptions}
          // defaultValue={dataPoints}
          onChange={(e) =>
            props.handelChange(dataPoints.id, { opportunity: e?.value.value })
          }
        />
      </td>
      <td>
        <input
          type="date"
          className={`table-input `}
          defaultValue={dataPoints.start_date}
          onChange={(e) => {
            setStartDate(e.target.value);
            props.handelChange(dataPoints.id, { start_date: e?.target.value });
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
            props.handelChange(dataPoints.id, { end_date: e?.target.value });
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
          options={props.statusOptions}
          defaultValue={{value:dataPoints.status,label:dataPoints.status}}
          onChange={(e) => {
            props.handelChange(dataPoints.id, { status: e?.value });
          }}
        />
      </td>
      <td>
        <input
          className={`table-input`}
          defaultValue={dataPoints.salary_offered}
          onChange={(e) => {
            props.handelChange(dataPoints.id, {
              salary_offered: e?.target.value,
            });
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
          options={props.sourceOptions}
          defaultValue={{
            value: dataPoints.source,
            label: dataPoints.source,
          }}
          onChange={(e) =>
            props.handelChange(dataPoints.id, { source: e?.value })
          }
        />
      </td>
      <td>
        <Select
          className={`table-input-select `}
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="assigned_to"
          options={props.workEngagementOptions}
          defaultValue={{
            value: dataPoints.work_engagement,
            label: dataPoints.work_engagement,
          }}
          onChange={(e) =>
            props.handelChange(dataPoints.id, { work_engagement: e?.value })
          }
        />
      </td>
      {
        dataPoints.reason_if_rejected ? <td>
        <Select
            className={`table-input-select `}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={props.rejectionreason}
            defaultValue={{
              value: dataPoints.reason_if_rejected ?dataPoints.reason_if_rejected:"",
              label: dataPoints.reason_if_rejected ?dataPoints.reason_if_rejected:"",
            }}
            onChange={(e) =>
              props.handelChange(dataPoints.id, { reason_if_rejected: e?.value })
            }
          />
        </td>:<td></td>

      }
      
    </>
  );
}

export default BulkMassEmployerEdit;
