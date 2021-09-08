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
  let { hits, searchIndex } = props;
  const history = useHistory();
  let columns = [];
  let tableData = <></>;

  switch (searchIndex) {
    case 'employers':
      columns = ['Type', 'Name', 'Website'];
      tableData = hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <div className="badge badge-employers">Emp.</div>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="name" />
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="website" />
          </td>
        </tr>
      ))
      break;

    case 'batches':
      columns = ['Type', 'Name', 'Start Date', 'End Date', 'Assigned To'];
      tableData = hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <div className="badge badge-batches">Batch.</div>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="name" />
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="start_date" />
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="end_date" />
          </td>
          <td>
            {hit?.assigned_to?.username}
          </td>
        </tr>
      ));
      break;

    case 'institutions':
      columns = ['Type', 'Name', 'Area', 'Assigned To'];
      tableData = hits.map(hit => (
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
      ))
      break;

    case 'students':
    default:
      columns = ['Type', 'First Name', 'Last Name', 'Email'];
      tableData = hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <div className="badge badge-students">Stu.</div>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="first_name" />
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="last_name" />
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="email" />
          </td>
        </tr>
      ));
      break;
  }

  const clickHandler = hit => {
    props.setSearchState({
      ...props.searchState,
      query: '',
    });
    switch (searchIndex) {
      case 'employers':
        history.push(`/employer/${hit.id}`);
        break;

      case 'batches':
        history.push(`/batch/${hit.id}`);
        break;

      case 'institutions':
        history.push(`/institution/${hit.id}`);
        break;

      case 'students':
      default:
        history.push(`/student/${hit.id}`);
        break;
    }
  };

  return (
    <SearchHitsContainer>
      <table>
        <thead>
          <tr>
            {columns.map(column => <th><div>{column}</div></th>)}
          </tr>
        </thead>
        <tbody>
          {tableData}
        </tbody>
      </table>
    </SearchHitsContainer>
  )
};

export default connectHits(SearchHits);
