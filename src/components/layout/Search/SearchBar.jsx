import styled from "styled-components";
import { InstantSearch } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';
import { useState } from "react";

const searchClient = instantMeiliSearch(
  process.env.REACT_APP_MEILISEARCH_HOST_URL,
  process.env.REACT_APP_MEILISEARCH_API_KEY,
);

const SearchContainer = styled.div`
  font-family: 'Latto-Regular';
  margin-right: auto;
  width: 100%;
`;

const SearchBar = () => {
  const [searchState, setSearchState] = useState({});
  const [searchIndexName, setSearchIndexName] = useState('institutions');

  return (
    <SearchContainer className="mr-auto">
      <InstantSearch
        searchClient={searchClient}
        indexName={searchIndexName}
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <SearchField />
        <SearchStateResults searchState={searchState} setSearchState={setSearchState} searchIndex={searchIndexName} onSearchIndexUpdate={setSearchIndexName} />
      </InstantSearch>
    </SearchContainer>
  );
}


export default SearchBar;
