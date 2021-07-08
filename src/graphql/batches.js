export const GET_BATCHES = `
query GET_ALL_BATCHES ($id: Int, $limit: Int, $start: Int, $sort: String){
    batches(
      sort: $sort
      start: $start
      limit: $limit
      where: { assigned_to: { id: $id } }
    ){
      id
      name
      start_date
      end_date
      status
      logo{
        url
      }
      number_of_sessions_planned
      program{
        name
      }
    }
}`;

/**
 {
     id: 2
 }
 */

export const GET_BATCH = `
query GET_BATCH ($id:ID!) {
  batch(id: $id) {
    id
    name
    end_date
    start_date
    created_at
    updated_at
    status
    program {
      id
      name
      status
      start_date
      end_date
    }
    assigned_to {
      id
      email
      username
    }
    logo {
      url
    }
    grant {
      id
    }
    institution {
      id
      name
    }
    per_student_fees
    name_in_current_sis
    number_of_sessions_planned
  }
}
`;

export const GET_SESSIONS = `
query GET_SESSIONS($id: ID!) {
  sessions (
    where: {batch: { id: $id }},
    sort: "date:desc"
  ) {
    id
    date
    batch {
      id
    }
    created_at
    updated_at
    topics_covered
  }
}
`;

export const GET_BATCH_STUDENTS = `
query GET_STUDENTS_IN_BATCH ($id: ID!){
  programEnrollments (where: {batch: {id: $id}}) {
    id
    status
    batch {
      id 
      name
    }
    institution {
      id
      name
    }
    student {
      id 
      phone
      last_name
      first_name
    }
  }
}
`;

export const GET_BATCH_STUDENTS_ONLY = `
query GET_STUDENTS_IN_BATCH ($id: ID!){
  programEnrollments (where: {batch: {id: $id}}) {
    id
    student {
      id 
      last_name
      first_name
    }
  }
}
`;

export const GET_STUDENT_DETAILS = `
query GET_STUDENT ($id: ID!){
  student(id: $id){
    name_of_parent_or_guardian
    phone
    status
    gender
    date_of_birth
    email
    category
    CV {
      id
    }
  }
}
`;

export const CREATE_SESSION = `
mutation CREATE_SESSION($batchID: ID!, $date: Date!, $topics: String!) {
  createSession(
    input: { 
      data: { 
        date: $date, 
        batch: $batchID, 
        topics_covered: $topics 
      }
    }
  ) {
    session {
      id
      date
      batch {
        id
      }
      topics_covered
    }
  }
}
`;

/**
 * Payload Sample
  {
    "batchID": 6,
    "date": "2021-07-22",
    "topics": "Something Someone"
  }
 */

export const MARK_ATTENDANCE = `
mutation CREATE_ATTENDANCE_RECORD (
  $session: ID
  $present: Boolean
  $program_enrollment_id: ID
) {
  createAttendance (
    input : {
        data:   {
          present: $present
          session: $session
          program_enrollment: $program_enrollment_id
        }
    }
  ) {
    attendance {
      id
      program_enrollment {
        id
      }
      session {
        id
      }
      present
    }
  }
}
`;

export const CREATE_NEW_BATCH = `
mutation CREATE_NEW_BATCH(
  $data: BatchInput!
) {
  createBatch(
    input: {
      data: $data,
    }
  ) {
    batch {
      id
      name
      status
      logo {
        url
      }
    }
  }
}
`;

export const DELETE_BATCH = `
mutation DELETE_BATCH($batch: ID!) {
  deleteBatch(input: { where: { id: $batch } }) {
    batch {
      id
    }
  }
}
`;

export const UPDATE_BATCH = `
mutation UPDATE_BATCH($id: ID!, $data: editBatchInput!){
  updateBatch(input:{
    where: { id: $id },
    data: $data
  }){
    batch {
      id
    }
  }
}`;

export const GET_SESSION = `
query GET_SESSION($id: ID!){
  session(id: $id){
    id
    date
    topics_covered
    date
    created_at
    updated_at
  }
}
`;

export const GET_SESSION_ATTENDANCE = `
query GET_SESSION_ATTENDANCE($sessionID: ID!){
  attendances(where: { session: { id: $sessionID } }){
    id
    present
    created_at
    program_enrollment{
      id
      student{
        first_name
        last_name
      }
    }
  }
}
`;

export const UPDATE_SESSION_ATTENDANCE = `
mutation UPDATE_ATTENDANCE(
  $id: ID!,
  $data: editAttendanceInput!
) {
  updateAttendance(
    input:{ 
      data: $data, 
      where: { 
        id: $id 
      } 
    }
  ){
    attendance{
      id
    }
  }
}
`;
/**
 * Payload
{
  "id": 67,
  "data": {
    "present": false,
  }
}
 */
export const UPDATE_SESSION_QUERY = `
mutation UPDATE_SESSION(
    $id: ID!,
    $data: editSessionInput!
  ){
  updateSession(
    input: {
      data: $data,
      where: { 
        id: $id 
      }
    }
  ){
    session {
      id
    }
  }
}
`;

export const GET_SESSION_ATTENDANCE_STATS = `
query GET_SESSION_ATTENDANCE_TEST($id: ID!) {
  attendancesConnection(
    where: { session: { batch: { id: $id } }, present: true }
  ) {
    groupBy {
      session {
        sessionId: key
        connection {
          aggregate {
            studentsPresent: count
          }
        }
      }
    }
  }
  programEnrollmentsConnection(where: { batch: { id: $id } }) {
    groupBy {
      batch {
        batchId: key
        connection {
          aggregate {
            studentsEnrolled: count
          }
        }
      }
    }
  }
}
`;
