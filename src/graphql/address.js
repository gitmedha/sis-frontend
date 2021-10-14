export const GET_ALL_ADDRESS = `
query GET_ALL_ADDRESS {
    geographies{
      id
      state
      district
      area
      pin_code
    }
  }
  `;
  export const GET_ALL_DISTRICTS = `
  query GET_GEOGRAPHIES($state: String) {
    geographies(where: { state: $state }) {
      district
    }
  }
`;

export const GET_ALL_AREA = `
query GET_GEOGRAPHIES($district: String) {
  geographies(where: { district: $district }) {
    area
  }
}
`;