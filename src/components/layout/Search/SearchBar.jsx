import styled from "styled-components";
import { InstantSearch } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';

const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25"
);

const SearchContainer = styled.div`
  font-family: 'Latto-Regular';
  margin-right: auto;
  width: 100%;
`;

const SearchBar = () => (
  <SearchContainer className="mr-auto">
    <InstantSearch
      indexName="steam-video-games"
      searchClient={searchClient}
    >
      <SearchField />
      <SearchStateResults />
    </InstantSearch>
  </SearchContainer>
);


export default SearchBar;
