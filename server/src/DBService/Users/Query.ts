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

export const GET_ALL_GROUP_USERS = gql`
query AllGroupUsers($investigationGroup: Int!) {
  allUsers(filter: {investigationGroup: {equalTo: $investigationGroup}}) {
    nodes {
      id
      isActive
      isAdmin
      phoneNumber
      serialNumber
      userName
      investigationGroup
    }
  }
}
`;

export const GET_ALL_DESKS = gql`
query AllDesks {
  allDesks {
    nodes {
      id
      district
    }
  }
}
`;