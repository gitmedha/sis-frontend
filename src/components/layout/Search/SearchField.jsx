import styled from "styled-components";
import { connectSearchBox } from 'react-instantsearch-dom';

const SearchInput = styled.div`
  width: 100%;
  padding-right: 10px;
  font-family: 'Latto-Bold';
  font-size: 14px;
  line-height: 1.2px;

  form {
    display: flex;
  }

  input {
    padding: 8px 30px;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #C4C4C4;

    &:focus {
      outline: none;
    }
  }
`;


const SearchField = ({ currentRefinement, isSearchStalled, refine }) => (
  <SearchInput>
    <form noValidate action="" role="search">
      <input
        type="search"
        placeholder="search for..."
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
      />
      {/* <button onClick={() => refine('')}>Reset</button> */}
      {/* {isSearchStalled ? 'Loading...' : ''} */}
    </form>
  </SearchInput>
);

export default connectSearchBox(SearchField);
