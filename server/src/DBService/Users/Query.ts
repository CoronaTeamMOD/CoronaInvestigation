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
      phoneNumber
      serialNumber
      userName
      userType
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
      newInvestigationsCount: investigationsByLastUpdator(filter: {investigationStatus: {equalTo: "חדשה"}}) {
        totalCount
      }
      activeInvestigationsCount: investigationsByLastUpdator(filter: {investigationStatus: {equalTo: "בטיפול"}}) {
        totalCount
      }
      userType
      sourceOrganization
      deskByDeskId {
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
  allSourceOrganizations {
    nodes {
      displayName
    }
  }
}
`;

export const GET_ALL_LANGUAGES = gql`
query allLanguages {
  allLanguages {
    nodes {
      displayName
    }
  }
}
`;

export const GET_USERS = gql`
query usersQuery($offset: Int!, $size: Int!) {
  allUsers(first: $size, offset: $offset) {
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