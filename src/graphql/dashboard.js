export const GET_STATE_METRICS = `
    query MetricsState($state: String) {
    metricsStates(where: {state_name: $state }) {
        registrations
        certifications
        internships
        placements
    }
    }`
;

export const GET_DISTRICT_METRICS = `
query MetricsDistrict ($district: String){
  metricsDistricts(where: { district_name: $district}) {
      registrations
      certifications
      internships
      placements
    }
  }`
;

export const GET_AREA_METRICS = `
  query MetricsArea($area: String) {
    metricsAreas(where: {area_name: $area }) {
      registrations
      certifications
      internships
      placements
    }
  }`
;

export const GET_ALL_METRICS = `
  query MetricsAll {
    metricsAlls {
      registrations
      certifications
      internships
      placements
    }
  }`
;

export const GET_MY_DATA_REGISTRATIONS = `
  query GET_MY_DATA_REGISTRATIONS ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status_nin: ["Enrollment Request Received", "Enrollment Request Rejected by Medha"]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_CERTIFICATIONS = `
  query GET_MY_DATA_CERTIFICATIONS ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status: "Certified by Medha"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_INTERNSHIPS = `
  query GET_MY_DATA_INTERNSHIPS ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Internship"
        }
        status: "Internship Complete"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_PLACEMENTS = `
  query GET_MY_DATA_PLACEMENTS ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Job"
        }
        status: "Offer Accepted"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const opportunitiesFields = `
id
type
role_or_designation
number_of_opportunities
created_at
status
department_or_team
role_description
skills_required
compensation_type
salary
address
city
state
pin_code
medha_area
assigned_to {
  id
  username
}
employer{
  id
  name
  address
  logo{
    url
  }
}
`;

export const GET_OPPORTUNITIES = `
query GET_OPPORTUNITIES($limit: Int, $start: Int, $status: String) {
  opportunitiesConnection(
    sort:"created_at:desc"
    start: $start
    limit: $limit
    where: {
      status: $status,
    }
    ) {
      values {
        ${opportunitiesFields}
      }
      aggregate {
        count
      }
    }
  }`
;

const studentFields = `
id
first_name
last_name
email
phone
status
name_of_parent_or_guardian
date_of_birth
category
gender
registration_date_latest
certification_date_latest
internship_date_latest
placement_date_latest
course_type_latest
income_level
old_sis_id
medha_champion
interested_in_employment_opportunities
city
pin_code
medha_area
address
state
assigned_to{
  id
  username
  email
}
logo {
  id
  url
}
CV {
  url
  previewUrl
  updated_at
}
`;

export const GET_STUDENTS = `
query GET_STUDENTS($limit: Int, $start: Int, $status: String) {
  studentsConnection (
    sort:"certification_date_latest:desc"
    start: $start
    limit: $limit
    where: {
      status: $status
    }
    ) {
      values {
        ${studentFields}
      }
      aggregate {
        count
      }
    }
  }
`;

export const GET_MY_DATA_REGISTRATIONS_GRAPH = `
  query GET_MY_DATA_REGISTRATIONS_GRAPH ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status_nin: ["Enrollment Request Received", "Enrollment Request Rejected by Medha"]
      }
    ) {
      groupBy {
        registration_date {
          key
          connection {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;

export const GET_MY_DATA_CERTIFICATIONS_GRAPH = `
  query GET_MY_DATA_CERTIFICATIONS_GRAPH ($user: Int){
    programEnrollmentsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        status: "Certified by Medha"
      }
    ) {
      groupBy {
        certification_date {
          key
          connection {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;

export const GET_MY_DATA_INTERNSHIPS_GRAPH = `
  query GET_MY_DATA_INTERNSHIPS_GRAPH ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Internship"
        }
        status: "Internship Complete"
      }
    ) {
      groupBy {
        start_date {
          key
          connection {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;

export const GET_MY_DATA_PLACEMENTS_GRAPH = `
  query GET_MY_DATA_PLACEMENTS_GRAPH ($user: Int){
    employmentConnectionsConnection (
      where:{
        student: {
          assigned_to:{
            id: $user
          }
        }
        opportunity:{
          type: "Job"
        }
        status: "Offer Accepted"
      }
    ) {
      groupBy {
        start_date {
          key
          connection {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;
