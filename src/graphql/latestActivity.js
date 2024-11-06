export const latestAcivity=`
id
activity,
module_name,
users_permissions_users,
changes_in,
event_id
created_at
`


export const GET_ALL_LATEST_ACTIVITY = `
query GET_ALL_LATEST_ACTIVITY($sort: String, $start: Int, $limit: Int) {
  latestactivity(
    sort: $sort
    start: $start
    limit: $limit
  ) {
    id
    activity        
    module_name      
    users_permissions_users {
      id
      username
      email
    }               
    changes_in       
    event_id        
  }
}
`;

export const CREATE_LATEST_ACTIVITY = `
mutation CREATE_LATEST_ACTIVITY($input: createLatestActivityInput!) {
  createLatestActivity(input: $input) {
    latestActivity {        
      id
      activity
      module_name
      users_permissions_users {
        id
        username
        email
      }
      changes_in
      event_id
      created_at
    }
  }
}
`;
