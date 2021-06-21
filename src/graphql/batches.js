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
      status
      number_of_sessions_planned
      program{
        name
      }
    }
}`;

/**
 {
     id: 2
 }
 */

export const GET_BATCH = `
query GET_BATCH ($id:ID!) {
  batch(id: $id) {
    name
    start_date
    end_date
    created_at
    updated_at
    status
    program {
      id
      name
      status
      start_date
      end_date
    }
    assigned_to{
      id
      email
      username
    }
    number_of_sessions_planned
  }
}
`;
