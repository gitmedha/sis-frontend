import styled from "styled-components";
// import { connectHighlight } from 'react-instantsearch-dom';

const HighlightedText = styled.span`
  padding-top: 5px;
  padding-bottom: 5px;
  background: rgba(218, 91, 91, 0.3);
`;

const SearchHighlight = ({ attribute, hit ,searchTerm}) => {

  const value = hit[attribute] ? String(hit[attribute]) : "";
  if (!searchTerm) {
    return <span>{value}</span>;
  }

  const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const parts = value.split(new RegExp(`(${escapedSearchTerm})`, 'gi'));


  return (
    <span>
    {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <HighlightedText key={index}>{part}</HighlightedText>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
  </span>

  );
};

export default SearchHighlight;
