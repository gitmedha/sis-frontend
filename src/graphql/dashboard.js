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
query MetricsDitric ($district: String){
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
        status_nin: ["Batch Assigned", "Batch Complete", "Certified by Medha"]
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
        status: "Offer Accepted by Student"
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
