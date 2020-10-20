import {gql} from 'postgraphile';

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
      isAdmin
      phoneNumber
      serialNumber
      userName
    }
  }   
`;

export const GET_ACTIVE_GROUP_USERS = gql`
query AllGroupUsers($investigationGroup: Int!) {
  allUsers(filter: {investigationGroup: {equalTo: $investigationGroup}, isActive: {equalTo: true}}) {
    nodes {
      id
      isActive
      isAdmin
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
    }
  }
}

`;

export const GET_ADMINS_OF_COUNTY = gql`
query getAdminsOfGivenCounty($requestedCounty: Int) {
  allUsers(filter: {isAdmin: {equalTo: true}, investigationGroup: {equalTo: $requestedCounty}}) {
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