import { gql } from 'postgraphile';

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
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {creator: $newUser, lastUpdator: $newUser, deskId: null}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }     
`;

export const CREATE_USER = gql`
mutation CreateUser($input: CreateNewUserInput!) {
    createNewUser(input: $input) {
      clientMutationId
    }
  }  
`;