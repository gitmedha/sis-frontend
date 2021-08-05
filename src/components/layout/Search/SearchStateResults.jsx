import styled from "styled-components";
import { connectStateResults } from 'react-instantsearch-dom';
import SearchHits from './SearchHits';
import { Highlight } from 'react-instantsearch-dom';

const SearchStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border: 1.5px solid #D7D7E0;
  box-sizing: border-box;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  width: 800px;
  position: absolute;
  margin-top: 5px;
  font-size: 14px;
  line-height: 18px;

  .header {
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: center;
  }

  .filter-by-text {
    font-family: 'Latto-Bold';
    color: #C4C4C4;
    margin-right: 15px;
  }
  .badges {
    display: flex;
    align-items: center;

    .badge {
      height: 30px;
      padding-left: 20px;
      padding-right: 20px;
      margin-right: 15px;
      color: white;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      min-width: auto;

      &.badge-institutions {
        background-color: #FC636B;
      }
      &.badge-students {
        background-color: #FF9700;
      }
      &.badge-employers {
        background-color: #1AAFD0;
      }
      &.badge-batches {
        background-color: #AA223C;
      }
      &.badge-disabled {
        background-color: #C4C4C4;
      }
    }
  }
  .no-results {
    padding: 15px;
  }
`;

const SearchStateResults = (props) => {
  console.log('search state results', props); // debugging on UAT
  let { searchState, searchResults } = props;
  const hasResults = searchResults && searchResults.nbHits !== 0;
  const hasQuery = searchState && searchState.query;

  return (
    <SearchStateContainer hidden={!hasQuery}>
      <div className="header pt-4 pb-2">
        <div className="filter-by-text">Filter by</div>
        <div className="badges">
          <div className="badge badge-institutions">
            Institutions
          </div>
          <div className="badge badge-students badge-disabled">
            Students
          </div>
          <div className="badge badge-employers badge-disabled">
            Employers
          </div>
          <div className="badge badge-batches badge-disabled">
            Batches
          </div>
        </div>
      </div>
      {hasResults ? (
        <SearchHits hitComponent={Hit} />
      ) : (
        <div className="no-results">
          No results found
        </div>
      )}

    </SearchStateContainer>
  );
};

function Hit(props) {
  return <Highlight attribute="name" hit={props.hit} />;
}

export default connectStateResults(SearchStateResults);
