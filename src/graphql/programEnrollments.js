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
  student{
    id
    full_name
  }
  batch {
    id
    name
    program {
      name
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

export const GET_STUDENTS_ATTENDANCE = `
query GET_STUDENT_ATTENDANCE_TOTAL_FOR_BATCH($id: ID!) {
  attendancesConnection(
    where: { session: { batch: { id: $id } }, present: true }
  ) {
    groupBy {
      program_enrollment {
        key
        connection {
          aggregate {
            count
          }
        }
      }
    }
  }
  
  sessionsConnection (
     where: { batch: { id: $id } }
    ) {
      aggregate {
        count
      }
    }
}
`;