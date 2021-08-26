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
    course_type_latest
    income_level
    old_sis_id
    medha_champion
    interested_in_employment_opportunities
    logo {
      id
      url
    }
    CV {
      url
      previewUrl
      updated_at
    }
  }
}
`;

export const GET_STUDENT_PROGRAM_ENROLLMENTS = `
query GET_STUDENT_PROGRAM_ENROLLMENTS ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort
    start: $start
    limit: $limit
    where: {
      student: {
        id: $id
      }
    }
  ) {
    values {
      id
      status
      course_year
      year_of_course_completion
      fee_status
      registration_date
      institution {
        id
        name
      }
      batch {
        id
        name
      }
      student {
        id
        phone
        last_name
        first_name
        logo {
          url
        }
        address {
          city
        }
      }
    }
    aggregate {
      count
    }
  }
}
`;
