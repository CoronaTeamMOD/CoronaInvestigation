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

export const UPDATE_DESK = gql`
mutation updateDesk($id: String!, $desk: Int!) {
  updateUserById(input: {userPatch: {deskId: $desk}, id: $id}) {
    user {
      id
      deskId
    }
  }
}
`;

export const UPDATE_COUNTY = gql`
mutation updateCounty($id: String!, $county: Int!) {
  updateUserById(input: {userPatch: {deskId: $desk}, id: $id}) {
    user {
      id
      investigationGroup
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
mutation updateInvestigatorByGroupId($newInvestigator: String!, $selectedGroups: [UUID!]!, $userCounty: Int!, $wasInvestigationTransferred: Boolean) {
  updateInvestigatorByGroupId(input: {newInvestigator: $newInvestigator, selectedGroups: $selectedGroups, userCounty: $userCounty, investigationTransferred: $wasInvestigationTransferred}) {
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