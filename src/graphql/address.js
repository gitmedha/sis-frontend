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