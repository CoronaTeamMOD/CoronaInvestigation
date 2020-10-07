import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
query InvestigationsInfoByUser($userName: String!) {
  userById(id: $userName) {
    investigationsByLastUpdator(filter: {investigationStatus: {notEqualTo: "טופלה"}}, orderBy: CORONA_TEST_DATE_DESC) {
      nodes {
        epidemiologyNumber
        coronaTestDate
        priority
        investigatedPatientByInvestigatedPatientId {
          addressByAddress {
            cityByCity {
              displayName
            }
          }
          personByPersonId {
            birthDate
            firstName
            lastName
            phoneNumber
          }
        }
        investigationStatusByInvestigationStatus {
          displayName
        }
        userByCreator {
          id
          userName
        }
      }
    }
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
