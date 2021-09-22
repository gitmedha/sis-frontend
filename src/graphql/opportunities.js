const opportunitiesFields = `
id
type
role_or_designation
number_of_opportunities
created_at
assigned_to {
  id
  username
}
employer{
  id
  name
  address
  logo{
    url
  }
}
`;

export const GET_OPPORTUNITIES = `
query GET_OPPORTUNITIES($limit: Int, $start: Int, $sort: String, $status: String) {
opportunitiesConnection(
  sort: $sort
  start: $start
  limit: $limit
  where: {
    status: $status
  }
) {
  values {
    ${opportunitiesFields}
  }
  aggregate {
    count
  }
 }
}`
;

export const GET_OPPORTUNITY=`
query OPPORTUNITY($id:ID!) {
  opportunity(id: $id) {
    id
    type
    role_or_designation
    number_of_opportunities
    created_at
    status
    department_or_team
    role_description
    skills_required
    compensation_type
    salary
    assigned_to {
      id
      username
    }
    employer {
      id
      name
      address
      logo {
        url
      }
    }
  }
}
`;

export const CREATE_OPPORTUNITY = `
  mutation CREATE_OPPORTUNITY(
    $data: OpportunityInput!
  ) {
    createOpportunity(
      input: {
        data: $data,
      }
    ) {
      opportunity {
        ${opportunitiesFields}
      }
    }
  }
`;

export const UPDATE_OPPORTUNITY = `
  mutation UPDATE_OPPORTUNITY(
    $data: editOpportunityInput!
    $id: ID!
  ) {
    updateOpportunity(
      input: {
        data: $data,
        where: { id: $id }
      }
    ) {
      opportunity {
        ${opportunitiesFields}
      }
    }
  }
`;

export const DELETE_OPPORTUNITY = `
  mutation DELETE_OPPORTUNITY(
    $id: ID!
  ){
    deleteOpportunity(
      input:{
        where: { id: $id }
      }
    ){
      opportunity {
        id
      }
    }
  }
`


