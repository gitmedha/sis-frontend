import styled from "styled-components";
import { InstantSearch } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';

const searchClient = instantMeiliSearch(
  "http://127.0.0.1:7700",
  "sis-medha-meilisearch"
);

const SearchContainer = styled.div`
  font-family: 'Latto-Regular';
  margin-right: auto;
  width: 100%;
`;

const SearchBar = () => (
  <SearchContainer className="mr-auto">
    <InstantSearch
      indexName="sis-medha"
      searchClient={searchClient}
    >
      <SearchField />
      <SearchStateResults />
    </InstantSearch>
  </SearchContainer>
);


export default SearchBar;
