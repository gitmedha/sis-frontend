import React, { useEffect, useState } from "react";
import Select from "react-select";
import { filterAssignedTo, getDefaultAssignee, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";


function BulkMassEmployerEdit(props) {

  const { dataPoints } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [defaultAssignedTo, setDefaultAssignedTo] = useState({});
  const [startdate,setStartDate]=useState('');
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDefaultAssigneeOptions();
        setAssigneeOptions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignee options:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
    console.log(assigneeOptions);


    console.log("\n ",defaultAssignedTo)
  },[assigneeOptions,defaultAssignedTo])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDefaultAssignee(dataPoints.assigned_to);
        const userId = data.find((user) => user.value === dataPoints.assigned_to);
        setDefaultAssignedTo(userId || { value: "", label: "" });
      } catch (error) {
        console.error("Error fetching default assignee:", error);
      }
    };
    fetchData();
  }, [dataPoints.assigned_to]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     let datavalue = await getDefaultAssignee(dataPoints.assigned_to);
  //     const userId = datavalue.find((user) => user.value === dataPoints.assigned_to);
  //     console.log(userId);
  //     setDefaultAssignee(userId || { value: "", label: "" });
  //   };
  
  //   fetchData();
  // }, [dataPoints.assigned_to]);
  
  
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
        value={defaultAssignedTo} 
        onChange={(selectedOption) => props.handelChange(dataPoints.id, { assigned_to: selectedOption?.value })}
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
