const operationFields = `
    id
    activity_type
    created_at
    institution {
        name
    }
    area
    state
    batch {
        name
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
  }
  Created_by {
    username
  }
  Updated_by {
    username
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
        $data:OperationInput!
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
        $data:editOperationInput!
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