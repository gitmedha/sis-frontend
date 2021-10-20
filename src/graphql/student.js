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
  created_at
  updated_at
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

const programEnrollmentFields = `
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
  course_name_in_current_sis
  medha_program_certificate {
    id
    url
    created_at
  }
  institution {
    id
    name
  }
  batch {
    id
    name
    program {
      name
    }
  }
`;

const employmentConnectionFields = `
  id
  status
  start_date
  end_date
  source
  reason_if_rejected
  salary_offered
  opportunity {
    id
    role_description
    role_or_designation
    type
    employer {
      id
      name
    }
  }
  assigned_to {
    id
    username
    email
  }
`;

export const GET_STUDENTS = `
  query GET_STUDENTS($id: Int, $limit: Int, $start: Int, $sort: String, $status:String, $state:String, $area:String,) {
    studentsConnection (
      sort: $sort
      start: $start
      limit: $limit
      where: {
        assigned_to: {
          id: $id
        }
        medha_area:$area
        state:$state
        status:$status
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

export const CREATE_STUDENT = `
  mutation CREATE_STUDENT(
    $data: StudentInput!
  ) {
    createStudent(
      input: {
        data: $data,
      }
    ) {
      student {
        ${studentFields}
      }
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
      ${programEnrollmentFields}
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
        ${programEnrollmentFields}
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
        ${programEnrollmentFields}
      }
    }
  }
`;

export const DELETE_PROGRAM_ENROLLMENT = `
  mutation DELETE_PROGRAM_ENROLLMENT(
    $id: ID!
  ) {
    deleteProgramEnrollment (
      input:{
        where: { id: $id }
      }
    ){
      programEnrollment {
        id
      }
    }
  }
`;

export const GET_STUDENT_EMPLOYMENT_CONNECTIONS = `
  query GET_STUDENT_EMPLOYMENT_CONNECTIONS ($id: Int, $limit: Int, $start: Int, $sort: String){
    employmentConnectionsConnection (
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
        ${employmentConnectionFields}
      }
      aggregate {
        count
      }
    }
  }
`

export const CREATE_EMPLOYMENT_CONNECTION = `
  mutation CREATE_EMPLOYMENT_CONNECTION (
    $data: EmploymentConnectionInput!
  ) {
    createEmploymentConnection (
      input: {
        data: $data
      }
    ) {
      employmentConnection {
        ${employmentConnectionFields}
      }
    }
  }
`;

export const UPDATE_EMPLOYMENT_CONNECTION = `
  mutation UPDATE_EMPLOYMENT_CONNECTION (
    $data: editEmploymentConnectionInput!
    $id: ID!
  ) {
    updateEmploymentConnection (
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      employmentConnection {
        ${employmentConnectionFields}
      }
    }
  }
`;

export const DELETE_EMPLOYMENT_CONNECTION = `
  mutation DELETE_EMPLOYMENT_CONNECTION(
    $id: ID!
  ) {
    deleteEmploymentConnection (
      input:{
        where: { id: $id }
      }
    ){
      employmentConnection {
        id
      }
    }
  }
`;

export const GET_ALL_STUDENTS = `
query TO_GET_ALL_STUDENTS {
  students{
    id
    first_name
    last_name
  }
}
`;
