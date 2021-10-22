export const GET_ALL_EMPLOYERS = `
  query GET_ALL_EMPLOYERS {
    employers {
      id
      name
      address
      medha_area
      city
      state
      pin_code
      district
    }
  }
`;

export const GET_EMPLOYER_OPPORTUNITIES = `
  query GET_EMPLOYER_OPPORTUNITIES ($id: ID!){
    opportunities (
      where: {employer: {id: $id}}
    ) {
      id
      number_of_opportunities
      salary
      type
      status
      role_or_designation
      role_description
    }
  }
`;

export const GET_MY_EMPLOYER = `
  query GET_EMPLOYERS($id: Int, $limit: Int, $start: Int, $sort: String) {
    employers(
      sort: $sort
      start: $start
      limit: $limit
      where: { assigned_to: { id: $id } }
    ) {
      id
      name
      logo {
        url
      }
      assigned_to {
        id
        username
      }
      contacts {
        email
        phone
        designation
        full_name
      }
      industry
      address
      city
      medha_area
      pin_code
      state
    }
  }
`;

export const GET_USER_EMPLOYERS = `
  query GET_EMPLOYERS($id: Int, $limit: Int, $start: Int, $sort: String, $state: String, $area: String) {
    employersConnection(
      sort: $sort,
      start: $start,
      limit: $limit,
      where: {
        assigned_to: {
          id: $id
        },
        state:$state,
        medha_area:$area,
      }
    ) {
      values {
        id
        name
        contacts {
          id
          email
          phone
          full_name
          designation
        }
        logo {
          url
        }
        assigned_to {
          id
          username
        }
        industry
        address
        city
        medha_area
        pin_code
        state
        created_at
      }
      aggregate {
        count
      }
    }
  }
`;

export const GET_EMPLOYER = `
  query EMPLOYER($id: ID!) {
    employer(id: $id) {
      id
      name
      phone
      status
      website
      email
      type
      industry
      logo {
        id
        url
      }
      assigned_to{
        id
        username
      }
      address
      pin_code
      state
      medha_area
      address
      city
      created_at
      updated_at
      district
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

export const CREATE_EMPLOYER = `
  mutation CREATE_EMPLOYER(
    $data: EmployerInput!
  ) {
    createEmployer(
      input: {
        data: $data,
      }
    ) {
      employer {
        id
        name
        website
        type
        phone
        status
        industry
        address
        pin_code
        city
        state
        medha_area
        district
        assigned_to{
          username
        }
        contacts {
          full_name
          email
          phone
          designation
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYER = `
  mutation UPDATE_EMPLOYER(
    $data: editEmployerInput!
    $id: ID!
  ) {
    updateEmployer(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      employer{
        id
        name
        website
        type
        phone
        status
        industry
        address
        pin_code
        city
        state
        medha_area
        district
        assigned_to{
          username
        }
        contacts {
          full_name
          email
          phone
          designation
        }
      }
    }
  }
`;

export const DELETE_EMPLOYER = `
  mutation DELETE_EMPLOYER(
    $id: ID!
  ){
    deleteEmployer(
      input:{
        where: { id: $id }
      }
    ){
      employer{
        id
      }
    }
  }
`
