import styled from "styled-components";
import { InstantSearch } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';
import { useEffect, useState } from "react";
import axios from "axios";
import { MeiliSearch } from 'meilisearch'

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
  const [searchIndexName, setSearchIndexName] = useState('students');

  const client = new MeiliSearch({
    host: 'https://sis-meilisearch.medha.org.in',
    apiKey: 'sis-medha-meilisearch',
  })



  useEffect(() => {
    console.log('search index name changed', searchIndexName);
    console.log('searchStateChanged', searchState);

    // make api call to students
    client.index('students').search(searchState.query).then(data => {
      console.log('data', data);
    });
    // make api call to institutions
    client.index('institutions').search(searchState.query).then(data => {
      console.log('data', data);
    });
    // make api call to batches
    client.index('batches').search(searchState.query).then(data => {
      console.log('data', data);
    });
    // make api call to employers
    client.index('employers').search(searchState.query).then(data => {
      console.log('data', data);
    });
  }, [searchIndexName, searchState])

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
