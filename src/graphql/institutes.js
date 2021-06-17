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

export const CREATE_NEW_INSTITUTE = `
mutation CREATE_INSTITUTIONS(
  $name: String!
  $website: String!
  $phone: String!
  $email: String!
  $assigned_to: ID!
  $status: String!
  $contacts: [ComponentCommonContactInput!]!
  $address: ComponentCommonAddressInput!
  $logo: ID
) {
  createInstitution(
    input: {
      data: {
        name: $name
        website: $website
        assigned_to: $assigned_to
        phone: $phone
        email: $email
        status: $status
        address: $address
        contacts: $contacts
        logo: $logo
      }
    }
  ) {
    institution {
      id
      name
      website
      phone
      status
      email
      logo{
        url
      }
      address {
        id
        pin_code
        address_line
        state
        medha_area
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

export const UPADTE_INSTITUTIONS = `
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
        address {
          id
          pin_code
          address_line
          state
          medha_area
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
      address{
        pin_code
        state
        medha_area
        address_line
      }
      assigned_to{
        username
        email
      }
      logo{
        url
      }
      contacts{
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

export const GET_ALL_INSTITUTES = ``;
