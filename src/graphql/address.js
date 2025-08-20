export const GET_ALL_ADDRESS = `
query GET_ALL_ADDRESS {
  geographiesConnection {
    groupBy {
      state {
        key
      }
    }
  }
}
  `;
  export const GET_ALL_DISTRICTS = `
  query GET_GEOGRAPHIES($state: String) {
    geographiesConnection(where: { state: $state }) {
      groupBy {
        district {
          key
        }
        area {
          key
        }
        city {
          key
        }
      }
    }
  }
  
`;



export const GET_ALL_CITIES = `
  query GET_GEOGRAPHIES($state: String, $start: Int, $limit: Int) {
    geographies(
      where: { state: $state }, 
      start: $start, 
      limit: $limit
    ) {
      city
      state  # Optionally, return the state field as well if needed for clarity
    }
    geographiesConnection {
      aggregate {
        count
      }
    }
  }
`;