import { queryBuilder } from "../../apis";

import {
  GET_ALL_GRANTS,
  GET_ALL_PROGRAMS,
  GET_ALL_INSTITUTES,
  GET_ASSIGNEES_LIST_OPTS,
  GET_ALL_STUDENTS,
  GET_ALL_BATCHES,
} from "../../graphql";

export const batchLookUpOptions = async () => {
  const statusOptions = [
    {
      label: "Enrollment Ongoing",
      value: "Enrollment Ongoing",
    },
    { label: "Enrollment Complete -- To Be Started", value: "Enrollment Complete -- To Be Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Complete", value: "Complete" },
    { label: "Certified", value: "Certified" },
    { label: "Discontinued", value: "Discontinued" },
  ];

  let data = await queryBuilder({
    query: GET_ASSIGNEES_LIST_OPTS,
  });
  let assigneesOptions = data.data.users.map((assignee) => ({
    label: `${assignee.username} (${assignee.email})`,
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
    label: `${grant.name} | ${grant.donor}`,
    value: Number(grant.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_INSTITUTES,
  });
  let instituteOptions = data.data.institutions.map((institution) => ({
    label: institution.name,
    value: Number(institution.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_STUDENTS,
  });
  let studentOptions = data.data.students.map((student) => ({
    label: student.full_name,
    value: Number(student.id),
  }));

  data = await queryBuilder({
    query: GET_ALL_BATCHES,
  });
  let batchOptions = data.data.batches.map((batches) => ({
    label: batches.name,
    value: Number(batches.id),
  }));

  return {
    grantOptions,
    statusOptions,
    programOptions,
    instituteOptions,
    assigneesOptions,
    studentOptions,
    batchOptions,
  };
};
