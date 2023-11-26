import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { MeiliSearch } from "meilisearch";
import { handleKeyPress, handleKeyPresscharandspecialchar, isEmptyValue, mobileNochecker } from "../../../utils/function/OpsModulechecker";
import { getAlumniPickList,getStudent } from "./operationsActions";


const options = [
  { value: 'Open', label: "Open" },
  { value: 'Resolved', label: "Resolved" },
  { value: 'Closed', label: "Closed" }
];
// 1. Resolved

// 2. Closed

// 3. Open
const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const AlumunniBulkrow = (props) => {
  const [name,setName]=useState("")
  const [rows, setRows] = useState([
    {
      id: 1,
      query_start: "",
      student_name: name,
      student_id:"",
      father_name: "",
      email: "",
      phone: "",
      location: "",
      query_type: "",
      query_desc: "",
      conclusion: "",
      status: "",
      query_end: "",
      // published_at: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentinput,setstudentinput]=useState("")
  const [queryTypes,setQueryType]=useState([])
  const [Father,setFatherName]=useState("")
  const [email,setEmail]=useState("")
  const [phone,setPhone]=useState('')
  const handleChange = (options, key) => {
    console.log(options, key);
  };
  const filterStudent = async (filterValue) => {
    console.log("filtervalue",filterValue);
    return await meilisearchClient.index('students').search(filterValue, {
      limit: 1000,
      attributesToRetrieve: ['id', 'full_name', 'student_id']
    }).then(data => {
      let programEnrollmentStudent =  '112';
      let studentFoundInList = false;
      let filterData = data.hits.map(student => {
        if (student.id === Number(props?.id)) {
          studentFoundInList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        }
      });

      return filterData;
    });
  }
  useEffect(() => {
    filterStudent(studentinput).then((data) => {
     
      setStudentOptions(data);
      // console.log("filterStudent",data);
    });
  }, [studentinput]);

  useEffect(() => {
    getStudent(name?.id).then(data=>{
      if(!isEmptyValue(data?.name_of_parent_or_guardian)){
        setFatherName(data?.name_of_parent_or_guardian)
        
      }
      if(!isEmptyValue(data?.email)){
        setEmail(data?.email)
        // 
      }
      if( !isEmptyValue(data?.phone)){
        setPhone(data?.phone)
        // 
      }
    })
  }, [name])
  
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
    props.updateRow(rowid, field, value.value);
  };

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getAlumniPickList().then((data) => {
      setAreaOptions(
        data.medha_area.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setQueryType(
        data.query_type.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
  }, []);

  const updateRow = (id, field, value) => {
    // row[field] = value;
    props.updateRow(id, field, value);
    // props.handleInputChange()
    // setRows(updatedRows);
  };
  useEffect(() => {
    console.log("Father",Father);
    props.updateRow(row.id, 'father_name', Father);
  props.updateRow(row.id, 'email', email);
  props.updateRow(row.id, 'phone', phone);

  }, [Father,email,phone])
  
//  const updateOther =()=>{
//   
//  }

  return (
    <>
      <tr key={row.id}>
        {/* <td>{row.id}</td> */}
        <td>
          

          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            filterData={filterStudent}
            options={studentOptions}
            onInputChange={(e)=>{
             
              setstudentinput(e)}}
            onChange={async(e) => {
              
              
              setName(e)
              // await props.updateRow(row.id, "student_name",e.full_name)
              await props.handleChange(e, "student_id", row.id)
              // await updateOther()
            }}
          />
        </td>
        <td>
          <input
            type="date"
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.query_start ? `border-red`:"table-input h-2"}`}
            defaultValue={startDate}
            onChange={(e) => {

              setStartDate(e.target.value);
              props.updateRow(row.id, "query_start", e.target.value);
            }}
          />
        </td>
        <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.student_name ? `border-red`:"table-input h-2"}`}
            type="text"
            defaultValue={name?.full_name}
            onKeyPress={handleKeyPresscharandspecialchar}
            onChange={(e) => props.updateRow(row.id, "student_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            defaultValue={Father}
            onKeyPress={handleKeyPress}
            onChange={(e) => props.updateRow(row.id, "father_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"

            defaultValue={email}
            onChange={(e) => props.updateRow(row.id, "email", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            defaultValue={phone}

            onKeyPress={mobileNochecker}
            onChange={(e) => props.updateRow(row.id, "phone", e.target.value)}
          />
        </td>
       <td>
          {/* <input
            className="table-input h-2"
            type="text"

            onChange={(e) => props.updateRow(row.id, "location", e.target.value)}
          /> */}
          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isSearchable={true}
            options={areaOptions}
            onChange={(e) => props.handleChange(e, "location", row.id)}
          />
        </td>
         <td>
          
          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isSearchable={true}
            options={queryTypes}
            onChange={(e) => props.handleChange(e, "query_type", row.id)}
          />
        </td>

       
       
        
       
        <td>
          <input
            className={`table-input h-2 ${props.classValue[`class${row.id-1}`]?.query_desc ? `border-red`:"table-input h-2"}`}
            type="text"
            onChange={(e) => props.updateRow(row.id, "query_desc", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "conclusion", e.target.value)}
          />
           
        </td>

        
        <td>
          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isSearchable={true}
            options={options}
            onChange={(e) => props.handleChange(e, "status", row.id)}
          />
        </td>
        <td>
          <input
            type="date"
            className="table-input h-2 "
            defaultValue={startDate}
            min={startDate}
            value={endDate}
            disabled={!startDate ? true:false}
            onChange={(e) => {

              setEndDate(e.target.value);
              props.updateRow(row.id, "query_end", e.target.value);
            }}
          />
        </td>

        
      </tr>
    </>
  );
};

export default AlumunniBulkrow;
