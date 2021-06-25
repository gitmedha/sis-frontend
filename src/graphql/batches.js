export const GET_BATCHES = `
query GET_ALL_BATCHES ($id: Int, $limit: Int, $start: Int, $sort: String){
    batches(
      sort: $sort
      start: $start
      limit: $limit
      where: { assigned_to: { id: $id } }
    ){
      id
      created_at
      updated_at
      name
      start_date
      end_date
      status
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
    name
    start_date
    end_date
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
    assigned_to{
      id
      email
      username
    }
    number_of_sessions_planned
  }
}
`;

export const GET_SESSIONS = `
query GET_SESSIONS($id: ID!) {
  sessions (where: {batch: {id: $id}}) {
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
