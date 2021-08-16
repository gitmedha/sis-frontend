export const GET_STUDENTS = `
query GET_STUDENTS($limit: Int, $start: Int, $sort: String) {
  studentsConnection (
    sort: $sort
    start: $start
    limit: $limit
  ) {
    values {
      id
      first_name
      last_name
      email
      phone
      status
      logo {
        id
        url
      }
    }
    aggregate {
      count
    }
  }
}
`;
