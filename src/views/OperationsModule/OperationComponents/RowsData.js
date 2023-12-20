import React, { useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import { useEffect } from "react";
import { filterAssignedTo, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { getAllProgram, getOpsPickList } from "./operationsActions";
import { handleKeyPress, handleKeyPresscharandspecialchar } from "../../../utils/function/OpsModulechecker";
import { MeiliSearch } from 'meilisearch'

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
const Activityoptions = [
  { value: 'Industry talk/Expert talk', label: 'Industry talk/Expert talk' },
  { value: 'Industry visit/Exposure visit', label: 'Industry visit/Exposure visit' },
  { value: 'Workshop/Training Session/Activity (In/Off campus)', label: 'Workshop/Training Session/Activity (In/Off campus)' },
  { value: 'Alumni Engagement', label: 'Alumni Engagement' },
  {value:'Placement Drive',label:'Placement Drive'}
];


const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

export const RowsData = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "",
      institution: "",
      batch: "",
      state: "",
      start_date: "",
      end_date: "",
      topic: "",
      donor: "",
      guest: "",
      designation: "",
      organization: "",
      activity_type: "",
      assigned_to: "",
      area: "",
    },
    // Add more initial rows as needed
  ]);
  const guestname = useRef(null);
  const topic=useRef(null);
  const guestDesignation = useRef(null);
  const [programeName,setProgramName]=useState([])
  const org = useRef(null);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [classvalue, setclassvalue] = useState(props.classValue);
  const [programOptions,setProgramOptions]=useState([])
  const [state,setstate]=useState(true)
  const [activityoption,setActivityOption]=useState([])

  
  const onStateChange = (value, rowid, field) => {
    getStateDistricts(value).then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
    if(value){
      setstate(false)
      props.updateRow(rowid, field, value.value);
    }
    
  };
  const handleInputChange = (id,data,value) => {
    const input = value.current;
    if (input) {
      input.value = capitalizeFirstLetter(input.value);;
      props.updateRow(id,data,input.value)
    }
   
  };

  const capitalizeFirstLetter = (text) => {
    return text
      .split(' ')
      .map((word) => {
        if (word.length > 0) {
          return word[0].toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      })
      .join(' ');
  };

  const filterProgram = async (filterValue) => {
    return await meilisearchClient.index('programs').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'name']
    }).then(data => {
      return data.hits.map(program => {
        return {
          ...program,
          label: program.name,
          value: Number(program.id),
        }
      });
    });
  }
 

  useEffect(async() => {
    
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    let data=await getOpsPickList().then(data=>{
      console.log(data);
      return data.activity_type.map((value) => ({
          key: value,
          label: value,
          value: value,
        }))
    }) 

    setActivityOption(data);
    filterProgram().then(data => {
      setProgramOptions(data);
    });
  }, []);



  const updatestate = () => {
    setstate(!state)
    return true
  };
  

  return (
    <>
    
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.assigned_to
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            defaultValue={()=>setAssigneeOptions(filterAssignedTo('rohit sharma'))}
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          />
        </td>
        <td>
          {/* <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.activity_type
                ? `border-red`
                : ""
            }`}
            type="text"
            onChange={(e) => updateRow(row.id, "activity_type", e.target.value)}
          /> */}
           <Select
            className="basic-single table-input donor"
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={activityoption}
            onChange={(e) => props.handleChange(e, "activity_type", row.id)}
          />
        </td>
        
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.institution
                ? `border-red`
                : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="institution"
            options={props.institutiondata}
            onChange={(e) => props.handleChange(e, "institution", row.id)}
          />
        </td>
        <td>
          <Select
            className={`basic-single table-input ${
              props.classValue[`class${row.id - 1}`]?.state ? `border-red` : ""
            }`}
            classNamePrefix="select"
            isClearable={()=>updatestate()}
            isSearchable={true}
            name="state"
            options={props.statedata}
            onChange={(e) => onStateChange(e, row.id, "state")}
          />
        </td>
        <td>
         
            <Select
              className={`basic-single table-input ${
                props.classValue[`class${row.id - 1}`]?.area ? "border-red" : ""
              }`}
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              name="area"
              options={areaOptions}
              isDisabled={state}
              onChange={(e) => props.handleChange(e, "area", row.id)}
            />
          
        </td>
        <td>
          <Select
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={programOptions}
            filterData={filterProgram}
            onChange={(e) => props.handleChange(e, "program_name", row.id)}
          />
        </td>
        <td>
          <Select
            className={`table-input ${
              props.classValue[`class${row.id - 1}`]?.batch ? `border-red` : ""
            }`}
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={props.batchbdata}
            onChange={(e) => props.handleChange(e, "batch", row.id)}
          />
        </td>
        
       
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.start_date
                ? `border-red`
                : ""
            }`}
            defaultValue={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              props.updateRow(row.id, "start_date", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.end_date
                ? `border-red`
                : ""
            }`}
            min={startDate}
            value={endDate}
            disabled={!startDate ? true:false}
            onChange={(event) => {
              const date = event.target.value;
              setEndDate(date);
              props.updateRow(row.id, "end_date", date);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.topic ? "border-red" : ""
            }`}
            type="text"
            ref={topic}
            onChange={(e) => handleInputChange(row.id, "topic",topic)}
            // onChange={(e) => props.updateRow(row.id, "topic", e.target.value)}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input donor"
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={options}
            onChange={(e) => props.handleChange(e, "donor", row.id)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPresscharandspecialchar}
            ref={guestname}
            onChange={(e) => handleInputChange(row.id, "guest",guestname)}
          />
        </td>
    
        <td>
          <input
            className="table-input h-2"
            type="text"
            onKeyPress={handleKeyPresscharandspecialchar}
            ref={guestDesignation}
            onChange={(e) => handleInputChange(row.id, "designation",guestDesignation)}
          />
        </td>

        <td>
          <input
            className="table-input h-2"
            type="text"
            ref={org}
            onChange={(e) => handleInputChange(row.id, "organization",org)}

          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${
              props.classValue[`class${row.id - 1}`]?.students_attended
                ? `border-red`
                : ""
            }`}
            type="number"
            onChange={(e) =>
              props.updateRow(row.id, "students_attended", e.target.value)
            }
          />
        </td>
        
      
    </>
  );
};
