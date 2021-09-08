const opportunitiesFields = `
id
type
role_or_designation
number_of_opportunities
created_at
employer{
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