import styled from "styled-components";
// import { connectHits } from 'react-instantsearch-dom';
import { useHistory } from "react-router-dom";

import SearchHighlight from './SearchHighlight';
import {useEffect} from 'react';
import { func } from "prop-types";

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
  let { hits, searchIndex ,searchState} = props;

  let columns = [];
  let tableData = <></>;

  switch (searchIndex) {
    
    case 'employers':
      columns = ['Name','District','State','Industry','Assigned To'];
      tableData = hits[searchIndex].hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <SearchHighlight hit={hit} attribute="name" searchTerm={searchState}/>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="district" searchTerm={searchState}/>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="state" searchTerm={searchState}/>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="industry" searchTerm={searchState}/>
          </td>
          <td>
          {hit?.assigned_to?.username}
          </td>
        </tr>
      ))
      break;

    case 'batches':
      columns = ['Name', 'Program', 'Status', 'Student Enrolled', 'Start Date', 'Enrollment Type', 'Area', 'Assigned To'];
      tableData = hits[searchIndex].hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <SearchHighlight hit={hit} attribute="name" searchTerm={searchState}/>
          </td>
          <td>
          {hit?.program?.name }
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="status" searchTerm={searchState}/>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="student_count" searchTerm={searchState}/>
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="start_date" searchTerm={searchState}/>
          </td>
          <td>
           {hit?.enrollment_type} 
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="medha_area" searchTerm={searchState}/>
          </td>
          <td>
            {hit?.assigned_to?.username}
          </td>
        </tr>
      ));
      break;

    case 'institutions':
      columns = ['Name', 'Area', 'State', 'Type', 'Status', 'Assigned To'];
      tableData = hits[searchIndex].hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <SearchHighlight hit={hit} attribute="name" searchTerm={searchState}/>
          </td>
          <td>
            {hit.medha_area ? <SearchHighlight hit={hit} attribute="medha_area" searchTerm={searchState}/> : ''}
          </td>
          <td>
            {hit.state ? <SearchHighlight hit={hit} attribute="state" searchTerm={searchState}/> : ''}
          </td>
          <td>
            {hit.type ? <SearchHighlight hit={hit} attribute="type" searchTerm={searchState}/> : ''}
          </td>
          <td>
            {hit?.status}
          </td>
          <td>
            {hit?.assigned_to?.username}
          </td>
        </tr>
      ))
      break;

    case 'students':
    default:
      columns = ['Name', 'Student ID','Area', 'Phone', 'Email', 'Status','Assigned To'];
      tableData = hits[searchIndex].hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <SearchHighlight hit={hit} attribute="full_name" searchTerm={searchState}/>
          </td>
          <td>
            {hit?.student_id}
          </td>
          <td>
            {hit?.medha_area}
          </td>
          <td>
            {hit?.phone}
          </td>
          <td>
            <SearchHighlight hit={hit} attribute="email" searchTerm={searchState}/>
          </td>
          <td>
            {hit?.status}
          </td>
          <td>
            {hit?.assigned_to?.username}
          </td>
        </tr>
      ));
      break;

    case 'opportunities':
      columns = ['Role/Designation', 'Employer', 'District', 'Type', 'Status', 'Opening', 'Assigned To'];
      tableData = hits[searchIndex].hits.map(hit => (
        <tr key={hit.id} className="hit" onClick={() => clickHandler(hit)}>
          <td>
            <SearchHighlight hit={hit} attribute="role_or_designation" searchTerm={searchState}/>
          </td>
          <td>
            {hit?.employer?.name}
          </td>
          <td>
            {hit?.district}
          </td>
          <td>
            {hit.type ? <SearchHighlight hit={hit} attribute="type" searchTerm={searchState} /> : ''}
          </td>
          <td>
            {hit?.status}
          </td>
          <td>
            {hit?.number_of_opportunities}
          </td>
          <td>
            {hit?.assigned_to?.username}
          </td>
        </tr>
      ))
      break;
  }
  
  
  

  const clickHandler = hit => {
    props.setSearchState({
      ...props.searchState,
      query: '',
    });
    switch (searchIndex) {
      case 'employers':
        window.open(`/employer/${hit.id}`, "_blank")
        break;

      case 'batches':
        window.open(`/batch/${hit.id}`, "_blank")
        break;

      case 'institutions':
        window.open(`/institution/${hit.id}`, "_blank")
        break;
      
      case 'opportunities':
        window.open(`/opportunity/${hit.id}`, "_blank")
    
        break;

      case 'students':
      default:
        window.open(`/student/${hit.id}`, "_blank")
        
        break;
    }
  };

  return (
    <SearchHitsContainer>
      <table>
        <thead>
          <tr>
            {columns.map(column => <th key={column}><div>{column}</div></th>)}
          </tr>
        </thead>
        <tbody>
          {tableData}
        </tbody>
      </table>
    </SearchHitsContainer>
  )
};

export default SearchHits;
