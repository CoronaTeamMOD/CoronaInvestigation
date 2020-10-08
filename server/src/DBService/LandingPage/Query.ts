import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
mutation MyMutation($userId: String!) {
  userInvestigationsByDateAndPriority(input: {userId: $userId}) {
    json
  }
}
`;

export const GET_GROUP_INVESTIGATIONS = gql`
mutation MyMutation($investigationGroupId: Int!) {
  groupInvestigationsByDateAndPriority(input: {investigationGroupId: $investigationGroupId}) {
    json
  }
}
`;


export const GET_USER_BY_ID = gql`
query GetUserById($userId: String!) {
  userById(id: $userId) {
    id
    investigationGroup
    isAdmin
    phoneNumber
    serialNumber
    userName
  }
}
`;
