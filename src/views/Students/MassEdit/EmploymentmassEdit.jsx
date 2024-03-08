import React, { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import { getAlumniServicePickList, getEmployerOpportunities, getEmploymentConnectionsPickList, getStudentAlumniServices, getStudentEmploymentConnections, getStudentsPickList } from "../StudentComponents/StudentActions";
import BulkMassEdit from "./BulkMassEdit";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import BulkMassEmployerEdit from "./BulkMassEmployerEdit";
import { GET_ALL_OPPORTUNITIES, GET_OPPORTUNITIES } from "../../../graphql";
import api from "../../../apis";

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
  .submitbtnclear{
    position: absolute;
    right:10%;
  }
  
`;

const EmploymentmassEdit = (props) => {


    const [studentOptions, setStudentOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentinput, setstudentinput] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [employerOpportunityOptions, setEmployerOpportunityOptions] = useState([]);
  const [workEngagementOptions, setWorkEngagementOptions] = useState([]);
//   const [selectedOpportunityType, setSelectedOpportunityType] = useState(props.employmentConnection?.opportunity?.type);
//   const [selectedStatus, setSelectedStatus] = useState(props?.employmentConnection?.status);
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDateMandatory, setEndDateMandatory] = useState(false);
  const [rejectionreason,setrejectionreason]=useState([])

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
    

      
    
      const updateEmployerOpportunityOptions = (employer) => {
        setEmployerOpportunityOptions([]);
        console.log("opprtunityemployer",employer);
        getEmployerOpportunities(Number(employer)).then((data) => {
          console.log("opprtunityemployer12",data);
          setEmployerOpportunityOptions(
            data?.data?.data?.opportunities.map((opportunity) => ({
              key: opportunity.role_or_designation,
              label: `${opportunity.role_or_designation} | ${opportunity.type}`,
              type: opportunity.type,
              value: opportunity.id,
            }))
          );
        });
      };

      useEffect(()=>{
         const employers=async()=>{
          let filterData =await  filterEmployer()
          
          console.log(filterData)
         }
         employers()
      },[])


    
      useEffect(() => {
        getEmploymentConnectionsPickList().then((data) => {
          setrejectionreason(data.reason_if_rejected?.map(item=>({ key: item.value, value: item.value, label: item.value })))
          setWorkEngagementOptions(
            data.work_engagement.map((item) => ({
              ...item,
              key: item.value,
              value: item.value,
              label: item.value,
            }))
          );
          setAllStatusOptions(
            data.status.map((item) => ({
              ...item,
              key: item.value,
              value: item.value,
              label: item.value,
            }))
          );
          setSourceOptions(
            data.source.map((item) => ({
              key: item.value,
              value: item.value,
              label: item.value,
            }))
          );
        });
      }, [props]);


      const filterEmployer = async (filterValue) => {
        console.log("filter ",filterValue);
        return await meilisearchClient
          .index("employers")
          .search(filterValue, {
            limit: 100,
            attributesToRetrieve: ["id", "name"],
          })
          .then((data) => {
            console.log("data",data);
            let filterData = data.hits.map((employer) => {
              return {
                ...employer,
                label: employer.name,
                value: Number(employer.id),
              };
            });
            setEmployerOptions(filterData)
            
          });
      };
    

    
      const handleSubmit = async () => {
        try {
            let alumData = await Promise.all(students.map(async (obj) => {
                try {
                    let data = await getStudentEmploymentConnections(obj.id);

                    console.log("data.data.data.employmentConnectionsConnection.values",);
                    return data.data.data.employmentConnectionsConnection.values.map(val => 
                      
                      ({
                        assigned_to:val.assigned_to.id,
                        experience_certificate: val.experience_certificate,
                        number_of_internship_hours: val.number_of_internship_hours,
                        end_date: val.end_date,
                        opportunity: {value:val.opportunity.id,label:val.opportunity.type},
                        employer: {value:val.opportunity.employer.id,label:val.opportunity.employer.name},
                        reason_if_rejected: val.reason_if_rejected,
                        reason_if_rejected_other: val.reason_if_rejected_other,
                        salary_offered: val.salary_offered,
                        start_date: val.start_date,
                        source: val.source,
                        status:val.status,
                        student_id: obj.id,
                        work_engagement:val.work_engagement,
                        id:val.id
                    })
                    );
                } catch (err) {    
                    console.error(err);
                    return []; 
                }
            }));
            setStudents(alumData.flat())
            setFormStatus(true);
        } catch (error) {
            console.error(error);
        }
    };
    
    
    const handelChange=(id,newData)=>{
      return setStudents(students.map(obj => {
        if (obj.id === id) {
        if(newData.hasOwnProperty("opportunity")){
          console.log(newData);
          let data ={opportunity :newData.opportunity}
          return { ...obj, ...data }
        }
        else if(newData.hasOwnProperty("employer")){
          console.log(newData);
          let employerEntryChange ={employer :newData.employer}
          console.log("employerEntryChange",employerEntryChange);
          return { ...obj, ...employerEntryChange }
        }else if(typeof obj.opportunity === "object"  && obj.opportunity !== null){
          obj.opportunity=obj.opportunity.value
        }else if( obj.employer === "object" && obj.employer !== null){
          obj.employer=obj.employer.value
        }
        else{
          return { ...obj, ...newData }; 
        }
            
        }
        
        return obj; 
    }))
    }

    const uploadData =async()=>{
      const modifiedStudents = students.map(obj => {
        if (typeof obj.opportunity === "object" && obj.opportunity !== null) {
          obj.opportunity = obj.opportunity.value;
        }
        if (typeof obj.employer === "object" && obj.employer !== null) {
          obj.employer = obj.employer.value;
        }
        return obj;
      });
      // /employment-connections/bulk-update

     props.handelSubmitMassEdit(modifiedStudents,"EmployerBulkdEdit")
    //   const value = await api
    //   .post("/employment-connections/bulk-update", modifiedStudents)
    //   .then((data) => {
        
    //     console.log("yes");
    //   })
    //   .catch((err) => {
    //     console.log("Unable to create field data .", "error");
    //   });
    }
    
    const handelCancel=()=>{
      props.handelCancel()
    }

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
              <button className="btn btn-primary mt-3" onClick={() => handleSubmit()}>Submit</button>
            </div>
          </div>
        )}
        
        
        {formStatus && (
          <Section1>
            <table className="create_data_table mt-5">
              <thead className="border mt-5">
                <tr>
                  <th className="border">Assigned To</th>
                  <th className="border">Employer *</th>
                  <th className="border">Opportunity* *</th>
                  <th className="border">Start Date *</th>
                  <th className="border">End Date *</th>
                  <th className="border">Status*</th>
                  <th className="border">Salary Offered*</th>
                  <th className="border" >Source *</th>
                  <th className="border">Work Engagement *</th>
                  <th className="border">Rejection Reason *</th>
                  {/* Add other table headings here */}
                </tr>
              </thead>
              <tbody className="mb-4">
                {students.map((student, id) => (
                  <tr key={id} className="mt-4">
                    <BulkMassEmployerEdit
                      statusOptions={allStatusOptions}
                      sourceOptions={sourceOptions}
                      dataPoints={student}
                      handelChange={handelChange}
                      workEngagementOptions={workEngagementOptions}
                      rejectionreason={rejectionreason}
                      employerOptions={employerOptions}
                      filterEmployer={filterEmployer}
                      employerOpportunityOptions={employerOpportunityOptions}
                      updateEmployerOpportunityOptions={updateEmployerOpportunityOptions}
                    />
                    {/* Add other table cells with input fields here */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex ">
            <button className="btn submitbtnclear btn-danger btn-regular my-5" onClick={()=>handelCancel()}>Cancel</button>
              <button className="btn submitbtn btn-primary btn-regular my-5" onClick={()=>uploadData()}>Submit</button>
            </div>
            {/* Add a submit button here */}
            
            {/* <button onClick={handleCancel}>Cancel</button> */}
          </Section1>
        )}
      </Modal>
    </>
  )
}

export default EmploymentmassEdit
