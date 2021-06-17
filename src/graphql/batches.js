export const GET_BATCHES = `
query GET_ALL_BATCHES ($id: Int, $limit: Int, $start: Int, $sort: String){
    batches(
      sort: $sort
      start: $start
      limit: $limit
      where: { assigned_to: { id: $id } }
    ){
      id
      created_at
      updated_at
      name
      start_date
      end_date
      assigned_to{
        id
        email
        username
      }
      status
      number_of_sessions_planned
      program{
        name
        status
        start_date
        end_date
      }
    }
}`;

/**
 {
     id: 2
 }
 */
