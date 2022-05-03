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

export const DEACTIVATE_ALL_COUNTY_USERS = gql`
  mutation deactivateAllCountyUsers($countyId: Int!) {
    deactivateAllCountyUsers(input: {countyId: $countyId}) {
      clientMutationId
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
mutation updateCounty($id: String!, $investigationGroup: Int!) {
  updateUserById(input: {userPatch: {investigationGroup: $investigationGroup}, id: $id}) {
    user {
      id
      investigationGroup
      countyByInvestigationGroup {
        displayName
        districtId
      }
    }
  }
}
`;

export const UPDATE_USER_TYPE = gql`
mutation updateUserType($id: String!, $userType: Int!) {
  updateUserById(input: {userPatch: {userType: $userType}, id: $id}) {
    user {
      id
      userType
    }
  }
}
`;

export const UPDATE_DISTRICT = gql`
mutation updateUserDistrict($userIdInput: String!, $districtIdInput: Int!) {
  updateUserDistrict(input: {districtIdInput: $districtIdInput, userIdInput: $userIdInput}) {
    json
  }
}
`;

export const UPDATE_INVESTIGATOR = gql`
mutation ChangeInvestigator($epidemiologyNumber: Int!, $newUser: String!, $transferReason: String, $lastUpdator: String, $lastUpdateTime: Datetime) {
    updateInvestigationByEpidemiologyNumber(
      input: {investigationPatch: {creator: $newUser, transferReason: $transferReason, lastUpdator:  $lastUpdator, lastUpdatorUser: $lastUpdator , lastUpdateTime: $lastUpdateTime}, epidemiologyNumber: $epidemiologyNumber}
    ) {
      clientMutationId
    }
  }     
`;

export const UPDATE_INVESTIGATOR_BY_GROUP_ID = gql`
mutation updateInvestigatorByGroupId($newInvestigator: String!, $selectedGroups: [UUID!]!, $userCounty: Int!, $wasInvestigationTransferred: Boolean, $transferReason: String!,  $lastUpdator: String!) {
  updateInvestigatorByGroupId(input: {newInvestigator: $newInvestigator, selectedGroups: $selectedGroups, userCounty: $userCounty, investigationTransferred: $wasInvestigationTransferred, reason: $transferReason, updator: $lastUpdator}) {
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

export const UPDATE_USER = gql`
mutation UpdateUserByForm($input: UpdateUserByFormInput!) {
    updateUserByForm(input: $input) {
      clientMutationId
    }
  }
`;