import { connectHighlight } from 'react-instantsearch-dom';

const SearchHighlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <span>
      {parsedHit.map(
        (part, index) =>
          part.isHighlighted ? (
            <mark key={index}><u>{part.value + 'test'}</u></mark>
          ) : (
            <span key={index}><u>{part.value + 'test'}</u></span>
          )
      )}
    </span>
  );
};

export default connectHighlight(SearchHighlight);
