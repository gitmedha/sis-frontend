const operationFields = `
    id
    activity_type
    created_at
    institution {
        name
        id
    }
    area
    state
    batch {
        name
        id
    }
    topic
    start_date
    end_date
    donor
    guest
    designation
    organization
    students_attended
    other_links
    assigned_to{
    username
    id
  }
  Created_by {
    username
    id
  }
  Updated_by {
    username
    id
  }
`

export const GET_OPERATIONS = `
    query GET_OPERATIONS ($limit:Int, $start:Int, $sort:String){
        usersOpsActivitiesConnection(
            sort: $sort,
            start: $start,
            limit:$limit
        ){
            values {
                ${operationFields}
            }
            aggregate {
                count
            }
        }
    } 
`;


export const CREATE_OPERATION = `
    mutation CREATE_OPERATION (
        $data:UsersOpsActivityInput!
    ){
        createUsersOpsActivity(
            input: {
                data:$data
            }
        ){
            usersOpsActivity {
                ${operationFields}
            }
        }
    }
`

export const UPDATE_OPERATION = `
    mutation UPDATE_OPERATION (
        $data:UsersOpsActivityInput!
        $id:ID!
    ){
        updateUsersOpsActivity(
            input: {
                data:$data,
                where: {id: $id}
            }
        ){
            usersOpsActivity{
                ${operationFields}
            }
        }
    }

`