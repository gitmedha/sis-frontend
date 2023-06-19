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
    student_attended
    other_links
    assigned_to{
    username
  }
  created_by {
    username
  }
`

export const GET_OPERATIONS = `
    query GET_OPERATIONS ($id: Int, $start:Int, $sort:String){
        users_ops_activities(
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