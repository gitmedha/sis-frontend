
export const GET_DISTRICT_METRICS = `
query MetricsDitric ($district: String){
  metricsDistricts(where: { district_name: $district}) {
      registrations
      certifications
      internships
      placements
    }
  }`;
  export const GET_STATE_METRICS = `
  query MetricsState($state: String) {
    metricsStates(where: {state_name: $state }) {
      registrations
      certifications
      internships
      placements
    }
  }`;
  