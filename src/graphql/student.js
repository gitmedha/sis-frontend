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
      name_of_parent_or_guardian
      date_of_birth
      category
      gender
      logo {
        id
        url
      }
      CV {
        url
        previewUrl
      }
    }
    aggregate {
      count
    }
  }
}
`;
