export const GET_STATE_METRICS = `
query MetricsState ($user_state: String){
    metricsStates(where: { state_name: $user_state}) {
      registrations
      certifications
      internships
    }
  }`;