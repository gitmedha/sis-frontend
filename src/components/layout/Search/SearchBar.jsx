import styled from "styled-components";
import { InstantSearch, Hits, Highlight } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import SearchField from './SearchField';

const searchClient = instantMeiliSearch(
  "https://demos.meilisearch.com",
  "dc3fedaf922de8937fdea01f0a7d59557f1fd31832cb8440ce94231cfdde7f25"
);

const HitsContainer = styled.div`
position: absolute;
background-color: #FFFFFF;
border: 1px solid black;
`;

const SearchContainer = styled.div`
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
      <HitsContainer>
        <Hits hitComponent={Hit} />
      </HitsContainer>
    </InstantSearch>
  </SearchContainer>
);

function Hit(props) {
  return <Highlight attribute="name" hit={props.hit} />;
}

export default SearchBar;
