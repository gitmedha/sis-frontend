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

export const IMAGE_UPLOADER = `
mutation UPLOAD_FILE(
  $file: Upload!
) {
  upload(
    file: $file
  ) {
    id
    url
  }
}
`;
