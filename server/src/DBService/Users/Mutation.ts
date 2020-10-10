import {gql} from 'postgraphile';

export const UPDATE_IS_USER_ACTIVE = gql`
    mutation updateUserIsActive($id: String!, $isActive: Boolean!) {
        updateUserById(input: {userPatch: {isActive: $isActive}, id: $id}) {
            user {
                id
                isActive
            }
        }
    }
`;

export const UPDATE_INVESTIGATOR = gql`
mutation ChangeInvestigator($epidemiologyNumber: Int!, $newUser: String!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {creator: $newUser, lastUpdator: $newUser}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }     
`;

export const CREATE_INVESTIGATOR = gql`
mutation CreateUser($user: UserInput!) {
    createUser(input: {user: $user}) {
      clientMutationId
    }
  }  
`;

export const UPDATE_USER_DESK = gql`
    mutation updateUserDesk($id: String!, $deskId: Int!) {
        updateUserById(input: {userPatch: {investigation_group: $deskId}, id: $id}) {
            user {
                id
                investigation_group
            }
        }
    }
`;
