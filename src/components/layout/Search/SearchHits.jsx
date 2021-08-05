import styled from "styled-components";
import { connectHits } from 'react-instantsearch-dom';

const SearchHitsContainer = styled.div`
  table {
    width: 100%;
    font-size: 14px;
    line-height: 18px;

    thead {
      background-color: #FAFAFE;
      border-top: 1.5px solid #D7D7E0;
      border-bottom: 1.5px solid #D7D7E0;

      tr {
        background: #FAFAFE;
        border-top: 1.5px solid #D7D7E0;
        border-bottom: 1.5px solid #D7D7E0;
      }

      th, td {
        color: #787B96;
      }
    }

    tr {
      height: 40px;

      th, td {
        padding-left: 15px;
        padding-right: 15px;
      }

      &:not(:last-child) {
        border-bottom: 1.5px solid #D7D7E0;
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

const SearchHits = (props) => {
  console.log("search hits props", props); // debugging on UAT
  let { hits } = props;
  return (
    <SearchHitsContainer>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Area</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {hits.map(hit => (
            <tr key={hit.id} className="hit">
              <td>
                <div className="badge badge-institutions">Inst.</div>
              </td>
              <td>{hit.name}</td>
              <td>{hit?.address?.medha_area}</td>
              <td>{hit?.assigned_to?.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SearchHitsContainer>
  )
};

export default connectHits(SearchHits);
