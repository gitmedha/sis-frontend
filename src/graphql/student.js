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
        ${studentFields}
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
      ${studentFields}
    }
  }
`;

export const UPDATE_STUDENT = `
  mutation UPDATE_STUDENT (
      $data: editStudentInput!
      $id: ID!
    ) {
      updateStudent(
        input: {
          data: $data,
          where: { id: $id }
        }
      ) {
        student {
          ${studentFields}
        }
    }
  }
`;

export const DELETE_STUDENT = `
  mutation DELETE_STUDENT(
    $id: ID!
  ) {
    deleteStudent(
      input:{
        where: { id: $id }
      }
    ){
      student {
        id
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
      course_type
      course_level
      year_of_course_completion
      registration_date
      certification_date
      fee_status
      fee_payment_date
      fee_amount
      fee_transaction_id
      fee_refund_status
      fee_refund_date
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

export const CREATE_PROGRAM_ENROLLMENT = `
  mutation CREATE_PROGRAM_ENROLLMENT (
    $data: ProgramEnrollmentInput!
  ) {
    createProgramEnrollment (
      input: {
        data: $data
      }
    ) {
      programEnrollment {
        id
        status
        course_year
        course_type
        course_level
        year_of_course_completion
        registration_date
        certification_date
        fee_status
        fee_payment_date
        fee_amount
        fee_transaction_id
        fee_refund_status
        fee_refund_date
        institution {
          id
          name
        }
        batch {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_PROGRAM_ENROLLMENT = `
  mutation UPDATE_PROGRAM_ENROLLMENT (
    $data: editProgramEnrollmentInput!
    $id: ID!
  ) {
    updateProgramEnrollment(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      programEnrollment {
        id
        status
        course_year
        course_type
        course_level
        year_of_course_completion
        registration_date
        certification_date
        fee_status
        fee_payment_date
        fee_amount
        fee_transaction_id
        fee_refund_status
        fee_refund_date
        institution {
          id
          name
        }
        batch {
          id
          name
        }
      }
    }
  }
`;
