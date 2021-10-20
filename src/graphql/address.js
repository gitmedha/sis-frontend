export const GET_ALL_ADDRESS = `
query GET_ALL_ADDRESS {
    geographies(sort: "state:asc"){
      id
      state
      district
      area
    }
  }
  `;
  export const GET_ALL_DISTRICTS = `
  query GET_GEOGRAPHIES($state: String) {
    geographies(where: { state: $state }) {
      district
      area
    }
  }
`;
