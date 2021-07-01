import { queryBuilder } from "../../apis";

import {
  GET_ALL_GRANTS,
  GET_ALL_PROGRAMS,
  GET_ASSIGNEES_LIST,
  GET_ALL_INSTITUTES,
} from "../../graphql";

export const batchLookupHandler = async () => {
  let data = await queryBuilder({
    query: GET_ASSIGNEES_LIST,
  });
  let assigneesOptions = data.data.users.map((assignee) => ({
    key: assignee.username,
    label: assignee.username,
    value: Number(assignee.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_PROGRAMS,
  });
  let programOptions = data.data.programs.map((program) => ({
    key: program.name,
    label: program.name,
    value: Number(program.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_GRANTS,
  });
  let grantOptions = data.data.grants.map((grant) => ({
    key: grant.name,
    label: grant.name,
    value: Number(grant.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_INSTITUTES,
  });
  let instituteOptions = data.data.institutions.map((institution) => ({
    key: institution.name,
    label: institution.name,
    value: Number(institution.id),
  }));

  return {
    grantOptions,
    programOptions,
    instituteOptions,
    assigneesOptions,
  };
};
