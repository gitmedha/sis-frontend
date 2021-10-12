export const GET_MY_INSTITUTES = `
query GET_INSTITUTES($id: Int, $limit: Int, $start: Int, $sort: String) {
  institutions(
    sort: $sort
    start: $start
    limit: $limit
    where: {
      assigned_to: {
        id: $id
      }
    }
  ) {
    id
    name
    logo{
      url
    }
    assigned_to{
      id
      username
    }
    status
    assigned_to {
      id
      email
    }
    type
    created_at
  }
}
`;

export const GET_USER_INSTITUTES = `
query GET_INSTITUTES($id: Int, $limit: Int, $start: Int, $sort: String) {
  institutionsConnection(
    sort: $sort
    start: $start
    limit: $limit
    where: {
      assigned_to: {
        id: $id
      }
    }
  ) {
    values {
      id
      name
      contacts{
        id
        email
        phone
        full_name
        designation
      }
      logo{
        url
      }
      assigned_to{
        id
        username
        email
      }
      status
      type
      created_at
    }
    aggregate {
      count
    }
  }
}
`;

export const CREATE_NEW_INSTITUTE = `
mutation CREATE_INSTITUTIONS(
  $data: InstitutionInput!
) {
  createInstitution(
    input: {
      data: $data,
    }
  )
  {
    institution {
      id
      name
      type
      phone
      email
      status
      website
      address
      pin_code
      state
      medha_area
      city
      logo{
        url
      }
      contacts {
        full_name
        email
        phone
      }
    }
  }
}
`;

/**
 * SAMPLE PAYLOAD TO CREATE NEW INSTITUTE
{
    "assigned_to": 2,
    "status": "active",
    "phone": "1234567890",
    "email": "someone@au1.com",
    "name": "Awesome University 1",
    "website": "www.awesome2-university.com",
    "contacts": [
        {
            "last_name": "Maurya",
            "phone": "6360535414",
            "first_name": "Narendra",
            "email": "mauryanarendra09@gmail.com",
            "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow"
        }
    ],
    "address": {
        "pin_code": "226101",
        "medha_area": "lucknow",
        "state": "Uttar_Pradesh",
        "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow"
    }
}
*/

export const UPDATE_INSTITUTION = `
mutation UPDATE_INSTITUTIONS(
    $data: editInstitutionInput!
    $id: ID!
  ) {
    updateInstitution(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      institution {
        id
        name
        website
        phone
        status
        email
        pin_code
        address
        state
        medha_area
        city
        contacts {
          full_name
          email
          phone
        }
      }
  }
}
`;
/**
 * SAMPLE PAYLOAD TO UPDATE INSTITUTION
 {
  "data": {
    "name": "Awesome University 3",
    "website": "www.awesome3-university.com",
    "phone": "1234567891",
    "email": "someone123@au1.com",
    "status": "active",
    assigned_to: 4,
    "contacts": [
      {
        "first_name": "Narendra",
        "last_name": "Maurya",
        "email": "mauryanarendra09@gmail.com",
        "phone": "6360535414",
        "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow"
      }
    ],
    "address": {
      "pin_code": "226101",
      "address_line": "29,30, Varsha Enclave, Narona, Kakori Road, Lucknow",
      "state": "Uttar_Pradesh",
      "medha_area": "lucknow"
    }
  },
  "id": 8
}
 */

export const DELETE_INSTITUTION = `
mutation DELETE_INSTITUTION(
    $id: ID!
  ){
    deleteInstitution(
      input:{
        where: { id: $id }
      }
    ){
      institution{
        id
      }
    }
}
`;
/**
 * SAMPLE PLAYLOAD TO DELETE AN INSTITUTE
{
  "id": 8
}
*/

export const GET_INSTITUTE = `
query INSTITUTION(
    $id: ID!
  ){
    institution(id: $id){
      name
      id
      email
      phone
      status
      website
      type
      address
      state
      pin_code
      medha_area
      city
      logo {
        id
        url
      }
      assigned_to {
        id
        username
        email
      }
      logo {
        url
      }
      contacts {
        id
        email
        phone
        full_name
        designation
      }
    }
  }
`;
/**
 * SAMPLE PLAYLOAD TO AN INSTITUTE DETAILS
{
  "id": 8
}
*/

export const GET_ALL_INSTITUTES = `
query TO_GET_ALL_INSTITUTES {
  institutions{
    id
    name
    status
  }
}
`;

export const GET_INSTITUTION_STUDENTS = `
query GET_STUDENTS_IN_INSTITUTION ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort
    start: $start
    limit: $limit
    where: {
      institution: {
        id: $id
      }
    }
  ) {
    values {
      id
      status
      course_year
      year_of_course_completion
      institution {
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
        address 
        city
      }
    }
    aggregate {
      count
    }
  }
}
`;

export const GET_INSTITUTION_STUDENTS_DETAILS = `
query GET_STUDENT ($id: ID!){
  student(id: $id){
    first_name
    last_name
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
    first_name
    last_name
  }
  batch {
    id
    name
    program {
      name
    }
  }
`;

export const GET_INSTITUTION_PROGRAM_ENROLLMENTS = `
query GET_INSTITUTION_PROGRAM_ENROLLMENTS ($id: Int, $limit: Int, $start: Int, $sort: String){
  programEnrollmentsConnection (
    sort: $sort
    start: $start
    limit: $limit
    where: {
      institution: {
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