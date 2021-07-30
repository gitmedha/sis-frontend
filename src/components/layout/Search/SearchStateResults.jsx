import { connectStateResults } from 'react-instantsearch-dom';
import SearchHits from './SearchHits';
import { Highlight } from 'react-instantsearch-dom';

const SearchStateResults = (props) => {
  console.log('search state results', props); // debugging on UAT
  let { searchState, searchResults } = props;
  const hasResults = searchResults && searchResults.nbHits !== 0;
  const hasQuery = searchState && searchState.query;

  return (
    <div>
      <div hidden={!hasResults || !hasQuery}>
        <SearchHits hitComponent={Hit} />
      </div>
      <div hidden={hasResults}>There is no results</div>
    </div>
  );
};

function Hit(props) {
  return <Highlight attribute="name" hit={props.hit} />;
}

export default connectStateResults(SearchStateResults);
