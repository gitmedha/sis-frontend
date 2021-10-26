export const GET_PICKLIST = `
  query GET_PICKLIST_VALUES(
    $table: String!
    $field: String
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

export const GET_ASSIGNEES_LIST_OPTS = `
query GET_ALL_USERS {
  users(sort: "username:asc", where:{blocked:"false"}) {
    id
    email
    username
  }
}
`;

export const GET_ASSIGNEES_LIST = `
query GET_ALL_USERS {
  users(sort: "username:asc", where:{blocked:"false"}) {
    id
    username
    email
    provider
    role {
      name
    }
    reports_to {
      id
      username
    }
  }
}
`;

export const GET_ALL_PROGRAMS = `
query TO_GET_ALL_PROGRAMS {
  programs{
    id
    name
    status
  }
}`;

export const GET_ALL_GRANTS = `
query TO_GET_ALL_GRANTS {
  grants{
    id
    name
    status
    donor
  }
}`;
