import styled from "styled-components";
import { connectHits } from 'react-instantsearch-dom';
import { useHistory } from "react-router-dom";

import SearchHighlight from './SearchHighlight';

const SearchHitsContainer = styled.div`
  height: 320px;
  overflow-y: scroll;

  table {
    width: 100%;
    font-size: 14px;
    line-height: 18px;

    thead {

      th {
        position: sticky;
        top: 0;
        padding: 0;

        div {
          height: 40px;
          padding-left: 15px;
          padding-right: 15px;
          background-color: #FAFAFE;
          color: #787B96;
          border-top: 1.5px solid #D7D7E0;
          border-bottom: 1.5px solid #D7D7E0;
          display: flex;
          align-items: center;
        }
      }
    }

    tbody {
      tr {
        height: 40px;
        cursor: pointer;

        &:hover {
          background-color: #F8F9FA;
        }

        td {
          padding-left: 15px;
          padding-right: 15px;
        }

        &:not(:last-child) {
          border-bottom: 1.5px solid #D7D7E0;
        }
      }
    }

  }
  .badge {
    height: 24px;
    padding-left: 12px;
    padding-right: 12px;
    color: white;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
  }
`;

const SearchHits = props => {
  let { hits } = props;
  const history = useHistory();

  const clickHandler = hit => {
    props.setSearchState({
      ...props.searchState,
      query: '',
    });
    history.push(`/institution/${hit.id}`);
  };

  return (
    <SearchHitsContainer>
      <table>
        <thead>
          <tr>
            <th><div>Type</div></th>
            <th><div>Name</div></th>
            <th><div>Area</div></th>
            <th><div>Assigned To</div></th>
          </tr>
        </thead>
        <tbody>
          {hits.map(hit => (
            <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
              <td>
                <div className="badge badge-institutions">Inst.</div>
              </td>
              <td>
                <SearchHighlight hit={hit} attribute="name" />
              </td>
              <td>
                {hit?.address?.medha_area}
              </td>
              <td>
                {hit?.assigned_to?.username}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SearchHitsContainer>
  )
};

export default connectHits(SearchHits);
