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

export const UPDATE_SOURCE_ORGANIZATION = gql`
    mutation updateUserSourceOrganization($id: String!, $sourceOrganization: String!) {
      updateUserById(input: {userPatch: {sourceOrganization: $sourceOrganization}, id: $id}) {
        user {
          id
          sourceOrganization
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
mutation updateInvestigatorByGroupId($newInvestigator: String!, $selectedGroups: [UUID!]!, $userCounty: Int!, $reason: String, $wasInvestigationTransferred: Boolean) {
  updateInvestigatorByGroupId(input: {newInvestigator: $newInvestigator, selectedGroups: $selectedGroups, userCounty: $userCounty, reason: $reason, investigationTransferred: $wasInvestigationTransferred}) {
    clientMutationId
  }
}
`;

export const UPDATE_COUNTY_BY_USER = gql`
mutation ChangeInvestigator($epidemiologyNumbers: [Int!]!, $newUser: String!, $transferReason: String!) {
  updateInvestigationCountyByEpidemiologyNumbers(
      input: {newInvestigator: $newUser, lastUpdator: $newUser, updatedDesk: null, investigationTransferred: true, reason: $transferReason, epidemiologyNumbers: $epidemiologyNumbers}
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