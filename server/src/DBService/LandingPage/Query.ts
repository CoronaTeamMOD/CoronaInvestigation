import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
query InvestigationsInfoByUser($userName: String!) {
  userById(id: $userName) {
    investigationsByLastUpdator(filter: {investigationStatus: {notEqualTo: "טופלה"}}) {
      nodes {
        epidemiologyNumber
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
query InvestigationsInfoByInvestigationGroup($investigationGroup: Int!) {
  allUsers(filter: {investigationGroup: {equalTo: $investigationGroup}}) {
    nodes {
      investigationsByLastUpdator {
        nodes {
          epidemiologyNumber
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