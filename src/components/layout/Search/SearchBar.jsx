import styled from "styled-components";
import { InstantSearch } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';

const searchClient = instantMeiliSearch(
  process.env.REACT_APP_MEILISEARCH_HOST_URL,
  process.env.REACT_APP_MEILISEARCH_API_KEY,
);

const SearchContainer = styled.div`
  font-family: 'Latto-Regular';
  margin-right: auto;
  width: 100%;
`;

const SearchBar = () => (
  <SearchContainer className="mr-auto">
    <InstantSearch
      indexName="institutions"
      searchClient={searchClient}
    >
      <SearchField />
      <SearchStateResults />
    </InstantSearch>
  </SearchContainer>
);


export default SearchBar;
