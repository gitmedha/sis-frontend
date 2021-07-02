import { queryBuilder } from "../../apis";

import {
  GET_ALL_GRANTS,
  GET_ALL_PROGRAMS,
  GET_ALL_INSTITUTES,
  GET_ASSIGNEES_LIST_OPTS,
} from "../../graphql";

export const batchLookUpOptions = async () => {
  const statusOptions = [
    {
      label: "Enrollment Ongoing",
      value: "Enrollment Ongoing",
    },
    { label: "To Be Started", value: "To Be Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Complete", value: "Complete" },
    { label: "Certified", value: "Certified" },
    { label: "Discontinued", value: "Discontinued" },
  ];

  let data = await queryBuilder({
    query: GET_ASSIGNEES_LIST_OPTS,
  });
  let assigneesOptions = data.data.users.map((assignee) => ({
    label: assignee.username,
    value: Number(assignee.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_PROGRAMS,
  });
  let programOptions = data.data.programs.map((program) => ({
    label: program.name,
    value: Number(program.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_GRANTS,
  });
  let grantOptions = data.data.grants.map((grant) => ({
    label: grant.name,
    value: Number(grant.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_INSTITUTES,
  });
  let instituteOptions = data.data.institutions.map((institution) => ({
    label: institution.name,
    value: Number(institution.id),
  }));

  return {
    grantOptions,
    statusOptions,
    programOptions,
    instituteOptions,
    assigneesOptions,
  };
};
