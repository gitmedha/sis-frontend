export const FILTER_USERS_BY_NAME = `
query GET_ALL_USERS($name:String) {
  users(
    sort: "username:asc"
    where: {username_contains: $name, _or: [{ blocked_null: "true" }, { blocked_contains: "false" }] }
  ) {
    id
    username
    email
  }
}
`;
