import styled from "styled-components";
import SearchField from './SearchField';
import SearchStateResults from './SearchStateResults';
import { useEffect, useState } from "react";
import {studentFields} from '../../../graphql/student';
import {institutionFields} from '../../../graphql/institutes';
import {opportunitiesFields} from '../../../graphql/opportunities';
import {batchesFields} from '../../../graphql/batches';
import {employerFields} from '../../../graphql/employer';

import api from '../../../apis'

const SearchContainer = styled.div`
  font-family: 'Latto-Regular';
  margin-right: auto;
  width: 100%;
`;

const SEARCH_QUERY = `
query SearchQuery($query: String!,$limit: Int) {
  studentsConnection(
    limit:$limit
    where: {
      _or:[
        {full_name_contains: $query}
       {  assigned_to:{
        username_contains:$query
      }}
      ]
    }
  ) {
    values {
      ${studentFields}
    }
    aggregate {
      count
    }
  }
  institutionsConnection(
    limit:$limit
    where: {
      _or:[
        {name_contains:$query}
        {assigned_to:{
          username_contains:$query
        }}
      ]
    }
  ){
    values {
      ${institutionFields}
    }
    aggregate {
      count
    }
  }
  opportunitiesConnection(
    limit:$limit
    where:{
      _or:[
        {
          employer: {
            name_contains:$query
          }
          assigned_to: {
            username_contains:$query
          }
        }
      ]
    }
  ){
    values {
      ${opportunitiesFields}
    }
    aggregate {
      count
    }
  }
  batchesConnection(
    limit:$limit,
    where:{
      _or:[
        {
          program:{
            name_contains:$query
          }
        }
        {enrollment_type_contains:$query}
        {assigned_to:{
          username_contains:$query
        }}
      ]
    }
  ){
    values {
      ${batchesFields}
    }
    aggregate {
      count
    }
  }
  employersConnection(
    limit:$limit
    where:{
      _or:[
        {assigned_to:{
          username_contains:$query
        }}
        {name_contains:$query}
      ]
    }
  ){
    values {
      ${employerFields}
    }
    aggregate {
      count
    }
  }

}
`;




const SearchBar = () => {
  const [hasResults,setHasResults] = useState(false);
  const [searchIndexName, setSearchIndexName] = useState('students');
  const [searchQuery,setSearchQuery] = useState('')
  
  const [hitsData, setHitsData] = useState({
    students: {},
    institutions: {},
    employers: {},
    batches: {},
    opportunities:{},
  });

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    async function callGraphQlSearch(){
      let apiHitsData = {}

      try {
        const {
          data
        } = await api.post("/graphql", {
          query:SEARCH_QUERY,
          variables:{
            query: searchQuery || "",
            limit:20
          }
      })

      if(data?.data?.studentsConnection?.values.length){
        apiHitsData['students'] = {
          hits:data?.data?.studentsConnection.values,
          limit:20,
          nbHits:data?.data?.studentsConnection.aggregate.count,
          query:searchQuery
        }
      }
      if(data?.data?.institutionsConnection?.values.length){
        apiHitsData['institutions'] = {
          hits:data?.data?.institutionsConnection.values,
          limit:20,
          nbHits:data?.data?.institutionsConnection.aggregate.count,
          query:searchQuery
        }

      }
      if(data?.data?.batchesConnection?.values.length){
        apiHitsData['batches'] = {
          hits:data?.data?.batchesConnection.values,
          limit:20,
          nbHits:data?.data?.batchesConnection.aggregate.count,
          query:searchQuery
        }

      }
      if(data?.data?.employersConnection?.values.length){
        apiHitsData['employers'] = {
          hits:data?.data?.employersConnection.values,
          limit:20,
          nbHits:data?.data?.employersConnection.aggregate.count,
          query:searchQuery
        }

      }
      if(data?.data?.opportunitiesConnection?.values.length){
        apiHitsData['opportunities'] = {
          hits:data?.data?.opportunitiesConnection.values,
          limit:20,
          nbHits:data?.data?.opportunitiesConnection.aggregate.count,
          query:searchQuery
        }

      }
      await setHitsData(apiHitsData)
    
      } catch (error) {
        console.log("error", error)
      }
     
    }

    callGraphQlSearch();
    
  }, [searchQuery]);

  useEffect(()=>{
    if(Object.keys(hitsData.students).length ||
    Object.keys(hitsData.employers).length ||
    Object.keys(hitsData.opportunities).length ||
    Object.keys(hitsData.batches).length ||
    Object.keys(hitsData.institutions).length){
      setHasResults(true);
    }

  },[hitsData])

  return (
    <SearchContainer className="mr-auto">
      <SearchField onSearchVQueryChange={setSearchQuery} searchQuery={searchQuery}/>
        <SearchStateResults 
        searchState={searchQuery} 
        setSearchState={setSearchQuery} 
        searchIndex={searchIndexName} 
        onSearchIndexUpdate={setSearchIndexName} 
        hitsData={hitsData}
        searchResults={hasResults}
        />
    </SearchContainer>
  );
}

export default SearchBar;
