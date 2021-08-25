export const GET_STUDENTS = `
query GET_STUDENTS($limit: Int, $start: Int, $sort: String, $status: String) {
  studentsConnection (
    sort: $sort
    start: $start
    limit: $limit
    where: {
      status: $status
    }
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
      registration_date_latest
      certification_date_latest
      internship_date_latest
      placement_date_latest
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

export const GET_STUDENT = `
query GET_STUDENT($id: ID!) {
  student (
    id: $id
  ) {
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
    income_level
    logo {
      id
      url
    }
    CV {
      url
      previewUrl
    }
  }
}
`;
