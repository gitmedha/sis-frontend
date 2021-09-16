export const GET_ALL_EMPLOYERS = `
  query GET_ALL_EMPLOYERS {
    employers {
      id
      name
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
  }
}
`;

export const GET_USER_EMPLOYERS = `
query GET_EMPLOYERS($id: Int, $limit: Int, $start: Int, $sort: String) {
  employersConnection(
    sort: $sort
    start: $start
    limit: $limit
    where: { assigned_to: { id: $id } }
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
    name
    phone
    status
    website
    type
    logo {
      id
      url
    }
    assigned_to{
      id
      username
    }
    pin_code
    state
    medha_area
    address
    city
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
