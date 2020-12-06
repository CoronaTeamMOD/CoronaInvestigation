import { gql } from 'postgraphile';
import InvestigationMainStatusCodes from '../../Models/InvestigationStatus/InvestigationMainStatusCodes';

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
      phoneNumber
      serialNumber
      userName
      userType
      countyByInvestigationGroup {
        districtId
      }
    }
  }   
`;

export const GET_ACTIVE_GROUP_USERS = gql`
query AllGroupUsers($investigationGroup: Int!) {
  allUsers(filter: {investigationGroup: {equalTo: $investigationGroup}, isActive: {equalTo: true}}) {
    nodes {
      id
      isActive
      phoneNumber
      serialNumber
      userName
      investigationGroup
      newInvestigationsCount: investigationsByCreator(filter: {investigationStatus: {equalTo: ${String(InvestigationMainStatusCodes.NEW)}}}) {
        totalCount
      }
      activeInvestigationsCount: investigationsByCreator(filter: {investigationStatus: {equalTo: ${String(InvestigationMainStatusCodes.IN_PROCESS)}}}) {
        totalCount
      }
      userType
      sourceOrganization
      deskByDeskId {
        id
        deskName
      }
    }
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

export const GET_USERS_BY_DISTRICT_ID = gql`
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
        displayName
      }
      isActive
      userLanguagesByUserId {
        nodes {
          language
        }
      }
      userTypeByUserType {
        displayName
      }
      countyByInvestigationGroup {
        displayName
      }
      sourceOrganizationBySourceOrganization {
        displayName
      }
      deskByDeskId {
        deskName
      }
    }
    totalCount
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
        displayName
      }
      isActive
      userLanguagesByUserId {
        nodes {
          language
        }
      }
      userTypeByUserType {
        displayName
      }
      countyByInvestigationGroup {
        displayName
      }
      sourceOrganizationBySourceOrganization {
        displayName
      }
      deskByDeskId {
        deskName
      }
    }
    totalCount
  }
}
`;

export const GET_ALL_USER_TYPES = gql`
query allUserTypes {
  allUserTypes {
    nodes {
      displayName
    	id
    }
  }
}
`;
