import { gql } from 'postgraphile';

export const GET_IS_USER_ACTIVE = gql`
    query isUserActive($id: String!){
        userById(id: $id) {
            isActive
        }
    }
`;

export const GET_USER_BY_ID = gql`
query GetUser($id: String!) {
    userById(id: $id) {
      investigationGroup
      isActive
      isDeveloper
      phoneNumber
      serialNumber
      userName
      userType
      countyByInvestigationGroup {
        displayName
        districtId
      }
      authorityByAuthorityId{
        id
        authorityName
      }
    }
  }   
`;

export const GET_ACTIVE_GROUP_USERS = gql`
mutation getInvestigatorListByCounty($inputCountyId: Int!) {
  getInvestigatorListByCountyFunction(input: {inputCountyId: $inputCountyId}) {
    json
  }
}   
`;

export const GET_ADMINS_OF_COUNTY = gql`
query getAdminsOfGivenCounty($requestedCounty: Int) {
  allUsers(filter: { or: [{userType: {equalTo: 2}}, {userType: {equalTo: 3}}], investigationGroup: {equalTo: $requestedCounty}}) {
    nodes {
      id
      isActive 
    }
  }
}`;
export const GET_ALL_SOURCE_ORGANIZATION = gql`
query allSourceOrganizations {
  allSourceOrganizations(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      displayName
    }
  }
}
`;

export const GET_ALL_LANGUAGES = gql`
query allLanguages {
  allLanguages(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      displayName
    }
  }
}
`;

export const GET_USERS_BY_COUNTY_ID = gql`
query usersQuery($offset: Int!, $size: Int!, $orderBy: [UsersOrderBy!], $filter: UserFilter!) {
  allUsers(
    first: $size, 
    offset: $offset, 
    orderBy: $orderBy,
    filter: $filter
  ) {
    nodes {
      id
      fullName
      userName
      phoneNumber
      mail
      identityNumber
      isActive
      cityByCity {
        displayName,
        id
      }
      isActive
      userLanguagesByUserId {
        nodes {
          language
        }
      }
      userTypeByUserType {
        displayName
        id
      }
      countyByInvestigationGroup {
        id,
        displayName
      }
      sourceOrganizationBySourceOrganization {
        displayName
      }
      deskByDeskId {
        id,
        deskName
      }
      authorityByAuthorityId{
        id
        authorityName
      }
    }
    totalCount
  }
}
`;

export const GET_ALL_USER_TYPES = gql`
query allUserTypes {
  allUserTypes(orderBy: ID_ASC) {
    nodes {
      displayName
    	id
    }
  }
}
`;

export const DISTRICT_COUNTY_BY_USER = gql`
query GetUser($id: String!) {
    userById(id: $id) {
      investigationGroup
      countyByInvestigationGroup {
        districtId
      }
    }
  }   
`;