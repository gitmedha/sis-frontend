import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import { getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import { MeiliSearch } from "meilisearch";
import { Input } from "../../../utils/Form";
import { getUpskillingPicklist } from "../../Students/StudentComponents/StudentActions";

const options = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const categoryOptions = [
  { value: 'Career', label: "Career" },
  { value: 'Creative', label: "Creative" },
];


const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const StudentupskilingBulk = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      assigned_to: "",
      student_id: "",
      institution: "",
      batch: "",
      start_date: "",
      end_date: "",
      course_name: "",
      certificate_received: "",
      category: "",
      sub_category: "",
      issued_org: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [subcategory,setSubcategory]=useState([])
  const [studentinput,setstudentinput]=useState("")
  const handleChange = (options, key) => {
    console.log(options, key);
  };
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

  useEffect(async() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getUpskillingPicklist().then((data) => {
      setSubcategory(data.subCategory.map((item) => ({
        key: item,
        value: item,
        label: item,
      })));
    });
    
    // console.log("assigneeOptions ; \n ",assigneeOptions);
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
  };
  useEffect(() => {
    filterStudent(studentinput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentinput]);

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
      // if (!studentFoundInList)  {
      //   filterData.unshift({
      //     label: programEnrollmentStudent.full_name,
      //     value: Number(programEnrollmentStudent.id),
      //   });
      // }
      return filterData;
    });
  }
  return (
    <>
      <tr key={row.id}>
      <td>
          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          />
        </td>
        <td>
          

          <Select
            className="basic-single table-input "
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            filterData={filterStudent}
            options={studentOptions}
            onInputChange={(e)=>{
              console.log("e",e)
              setstudentinput(e)}}
            onChange={(e) => {
              console.log("filter",row.id);
              props.handleChange(e, "student_id", row.id)}}
          />
        </td>
        <td>
          <Select
            className="basic-single table-input "
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
            className="basic-single table-input "
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="batch"
            options={props.batchbdata}
            onChange={(e) => {
              console.log(e);
              props.handleChange(e, "batch", row.id)}}
          />
        </td>

        {/* <td>{row.id}</td> */}
        <td>
          <input
            className="table-input h-2"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "course_name", e.target.value)}
          />
        </td>
        <td>
          {/* <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "category", e.target.value)
            }
          /> */}
          <Select
            className="basic-single table-input  "
            classNamePrefix="select"
            isSearchable={true}
            name="category"
            options={categoryOptions}
            onChange={(e) =>
              props.handleChange(e, "category", row.id)
            }
          />
        </td>
        <td>
        <Select
            className="basic-single table-input  "
            classNamePrefix="select"
            isSearchable={true}
            name="sub_category"
            options={subcategory}
            onChange={(e) =>
              props.handleChange(e, "sub_category", row.id)
            }
          />
          {/* <input
            className="table-input h-2"
            type="text"
            onChange={(e) => props.updateRow(row.id, "sub_category", true)}
          /> */}
        </td>
        
        
       
        <td>
  
          <input
            type="date"
            className="table-input h-2 "
            defaultValue={startDate}
            onChange={(e) => {
              console.log(e.target.value);

              setStartDate(e.target.value);
              props.updateRow(row.id, "start_date", e.target.value);
            }}
          />
        </td>
        <td>
          
          <input
            type="date"
            className="table-input h-2 "
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
          <Select
            className="basic-single table-input  date"
            classNamePrefix="select"
            isSearchable={true}
            name="area"
            options={options}
            onChange={(e) =>
              props.handleChange(e, "certificate_received", row.id)
            }
          />
        </td>
        
        <td>
          <input
            className="table-input h-2"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "issued_org", e.target.value)
            }
          />
        </td>
      </tr>
    </>
  );
};

export default StudentupskilingBulk;
