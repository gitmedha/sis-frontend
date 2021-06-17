export const GET_PICKLIST = `
query GET_PICKLIST_VALUES(
    $field:String!
    $table:String!
  ) {
    picklistFieldConfigs(where: { 
      table: $table, 
      field: $field 
    }) {
      table
      field
      values
    }
  }  
`;

/**
{
  "table": "institutions",
  "field": "type"
}
*/
