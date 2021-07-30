import styled from "styled-components";
import { connectHits } from 'react-instantsearch-dom';

const SearchHitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #FFFFFF;
  border: 1.5px solid #D7D7E0;
  box-sizing: border-box;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  width: 800px;
  position: absolute;
  margin-top: 5px;

  .hit {
    margin-bottom: 5px;
  }
`;

const SearchHits = (props) => {
  console.log("search hits props", props); // debugging on UAT
  let { hits } = props;
  return (
    <SearchHitsContainer>
      {hits.map(hit => (
        <div key={hit.id} className="hit">{hit.name}</div>
      ))}
    </SearchHitsContainer>
  )
};

export default connectHits(SearchHits);
