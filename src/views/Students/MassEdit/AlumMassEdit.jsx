import React, { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import { getAlumniServicePickList, getStudentAlumniServices, getStudentsPickList } from "../StudentComponents/StudentActions";
import BulkMassEdit from "./BulkMassEdit";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const Section1 = styled.table`
  .create_data_table {
    border: 1px solid #000;
    border-collapse: collapse !important;
    width: 100%;
    overflow: auto;
  }

  th,
  td {
    padding: 8px;
    text-align: left;
    border:1px solid #bebfc0;
  }

  th {
    background-color: #257b69 ;
    color:#fff;
  }

  
  .table-input {
    width: 8rem;
    padding: 2px;
    margin: 0;
    background-color: initial;
    border-radius: 5px;
    border: 1px solid #bebfc0;
    transition: border-color 0.3s; 
  }
  .table-input:active {
    border: 1px solid #257b69 !important; 
  }
  .table-input-select{
    width: 8rem;
    padding: 2px;
    margin: 0;
    background-color: initial;
    border-radius: 5px;
  }
  tr{
    border:1px solid #000;
  }
  .adddeletebtn {
    display: flex;
    justify-content: flex-end;
  }
  .submitbtn{
    position:absolute;
    right:0;
  }
`;

const AlumMassEdit = (props) => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentinput, setstudentinput] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  
  /**
  |--------------------------------------------------
  | file logic start from here
  |--------------------------------------------------
  */

  const filterStudent = async (filterValue) => {
    return await meilisearchClient
      .index("students")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "full_name", "student_id"],
      })
      .then((data) => {
        let filterData = data.hits.map((student) => {
          return {
            ...student,
            label: `${student.full_name} (${student.student_id})`,
            value: Number(student.id),
          };
        });

        return filterData;
      });
  };
  useEffect(() => {
    filterStudent(studentinput).then((data) => {
      setStudentOptions(data);
    });
    
  }, [studentinput]);

  useEffect(() => {
    console.log("studentinput", students);
  }, [students])
  


  useEffect(() => {
    getAlumniServicePickList().then((data) => {
      setTypeOptions(data.subcategory.map((item) => ({ key: item.value, value: item.value, label: item.value, category: item.category })));
      setCategoryOptions(data.category.map((item)=> ({value: item.value, label: item.value})));
      setProgramOptions(data.program_mode.map((item)=> ({value: item.value, label: item.value})));
    });
    getStudentsPickList().then((data) => {
      setLocationOptions( data.alumni_service_location.map((item) => ({ key: item.value, value: item.value, label: item.value })));
    });
  }, []);

  const handleSubmit = async () => {
    try {
        let alumData = await Promise.all(students.map(async (obj) => {
            try {
                let data = await getStudentAlumniServices(obj.id);
                return data.data.data.alumniServicesConnection.values.map(val => 
                  
                  ({

                    assigned_to:val.assigned_to.id,
                    category: val.category,
                    comments: val.comments,
                    end_date: val.end_date,
                    fee_amount: val.fee_amount,
                    fee_submission_date: val.fee_submission_date,
                    location: val.location,
                    program_mode: val.program_mode,
                    receipt_number: val.receipt_number,
                    start_date: val.start_date,
                    type: val.type,
                    student_id: obj.id,
                    id:val.id
                  
                })
                
                );
            } catch (err) {
                // Handle error if necessary
                console.error(err);
                return []; // Return empty array if there's an error
            }
        }));

        setStudents(alumData.flat())

        setFormStatus(true);
    } catch (error) {
        // Handle error if necessary
        console.error(error);
    }
};


const handelChange=(id,newData)=>{
  return setStudents(students.map(obj => {
    if (obj.id === id) {
        return { ...obj, ...newData }; // Update object's properties
    }
    console.log(obj);
    return obj; // Return unchanged object if id doesn't match
}))
}

useEffect(()=>{
  console.log("student data,",students);
},[students])




  return (
    <>
      <Modal
        centered
        size="xl"
        responsive
        show={true}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
        dialogClassName="fullscreen-modal"
      >
        {!formStatus && (
          <div className="col-md-6 col-sm-12 mt-2" style={{marginLeft:"2rem"}}>
            <div>
              <label className="leading-24">Student</label>
              <Select
                //   defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name="student_ids"
                options={studentOptions}
                filterData={filterStudent}
                onInputChange={(e) => {
                  console.log(e);
                  return setstudentinput(e);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(choices) => setStudents(choices)}
              />
            </div>

            <div>
              <button className="btn btn-primary mt-3"  onClick={() => handleSubmit()}>Submit</button>
            </div>
          </div>
        )}
        
        
        {formStatus && (
          <Section1>
            <table className="create_data_table mt-5">
              <thead className="border mt-5">
                <tr>
                  <th className="border">Assigned To</th>
                  <th className="border">Category *</th>
                  <th className="border">Sub Category *</th>
                  <th className="border">Start Date *</th>
                  <th className="border">End Date *</th>
                  <th className="border">Fee Amount</th>
                  <th className="border">Fee Submission Date</th>
                  <th className="border" >Location *</th>
                  <th className="border">Program Mode *</th>
                  <th className="border">Receipt Number *</th>
                  {/* Add other table headings here */}
                </tr>
              </thead>
              <tbody className="mb-4">
                {students.map((student, id) => (
                  <tr key={id} className="mt-4">
                    <BulkMassEdit 
                      categoryOptions={categoryOptions}
                      programOptions={programOptions}
                      typeOptions={typeOptions}
                      locationOptions={locationOptions}
                      dataPoints={student}
                      handelChange={handelChange}
                    />
                    {/* Add other table cells with input fields here */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex ">
              <button className="btn submitbtn btn-primary btn-regular my-5" onClick={handleSubmit}>Submit</button>
            </div>
            {/* Add a submit button here */}
            
            {/* <button onClick={handleCancel}>Cancel</button> */}
          </Section1>
        )}
      </Modal>
    </>
  );
};

export default AlumMassEdit;
