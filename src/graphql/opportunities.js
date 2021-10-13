const opportunitiesFields = `
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
address
city
state
pin_code
medha_area
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
  student {
    id
    first_name
    last_name
  }
  assigned_to {
    id
    username
    email
  }
`;

export const GET_OPPORTUNITIES = `
query GET_OPPORTUNITIES($id: Int, $limit: Int, $start: Int, $sort: String, $status:String, $state:String , $area: String) {
opportunitiesConnection(
  sort: $sort
  start: $start
  limit: $limit
  where: {
    assigned_to: {
      id: $id
    }
     state:$state
     status:$status
     medha_area: $area
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
    ${opportunitiesFields}
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

export const GET_OPPORTUNITY_EMPLOYMENT_CONNECTIONS = `
  query GET_OPPORTUNITY_EMPLOYMENT_CONNECTIONS ($id: Int, $limit: Int, $start: Int, $sort: String){
    employmentConnectionsConnection (
      sort: $sort
      start: $start
      limit: $limit
      where: {
        opportunity: {
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
