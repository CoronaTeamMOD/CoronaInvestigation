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
mutation ChangeInvestigator($epidemiologyNumber: Int!, $newUser: String!, $transferReason: String) {
    updateInvestigationByEpidemiologyNumber(
      input: {investigationPatch: {creator: $newUser, lastUpdator: $newUser, transferReason: $transferReason}, epidemiologyNumber: $epidemiologyNumber}
    ) {
      clientMutationId
    }
  }     
`;

export const UPDATE_INVESTIGATOR_BY_GROUP_ID = gql`
mutation updateInvestigatorByGroupId($newInvestigator: String!, $selectedGroups: [UUID!]!, $reason: String, $wasInvestigationTransferred: Boolean) {
  updateInvestigatorByGroupId(input: {newInvestigator: $newInvestigator, selectedGroups: $selectedGroups, reason: $reason, investigationTransferred: $wasInvestigationTransferred}) {
    clientMutationId
  }
}
`;

export const UPDATE_COUNTY_BY_USER = gql`
mutation ChangeInvestigator($epidemiologyNumber: Int!, $newUser: String!) {
    updateInvestigationByEpidemiologyNumber(
      input: {investigationPatch: {creator: $newUser, lastUpdator: $newUser, deskId: null, wasInvestigationTransferred: true}, epidemiologyNumber: $epidemiologyNumber}
    ) {
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