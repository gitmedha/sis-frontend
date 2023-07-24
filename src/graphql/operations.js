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


const usersTotsFields = `
    id
    created_at
    user_name
    Created_by {
        id
        username
    }
    Updated_by {
        id
        username
    }
    trainer_1 {
        id
    }
    start_date
    end_date
    project_name
    certificate_given
    module_name
    project_type
    new_entry
    trainer_2 {
        id
    }
    partner_dept
    college
    city
    state
    age
    gender
    contact
    designation
    published_at
`

export const GET_OPERATIONS = `
    query GET_OPERATIONS ($limit:Int, $start:Int, $sort:String){
        usersOpsActivitiesConnection(
            sort: $sort,
            start: $start,
            limit:$limit,
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


export const GET_USERSTOTS = `
    query GET_USERSTOTS ($limit:Int,$start:Int, $sort:String){
        usersTotsConnection(
            sort:$sort,
            start:$start,
            limit:$limit,
        ){
            values {
                ${usersTotsFields}
            }
            aggregate {
                count
            }
        }
    }
`

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