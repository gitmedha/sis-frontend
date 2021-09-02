export const GET_ALL_EMPLOYERS = `
  query GET_ALL_EMPLOYERS {
    employers {
      id
      name
    }
  }
`;

export const GET_EMPLOYER_OPPORTUNITIES = `
  query GET_EMPLOYER_OPPORTUNITIES ($id: ID!){
    opportunities (
      where: {employer: {id: $id}}
    ) {
      id
      number_of_opportunities
      salary
      type
      status
      role_or_designation
      role_description
    }
  }
`;
