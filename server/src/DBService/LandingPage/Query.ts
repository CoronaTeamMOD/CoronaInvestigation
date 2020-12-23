import { gql } from "postgraphile";

export const USER_INVESTIGATIONS = gql`
query AllInvestigations($orderBy: String!, $offset: Int!, $size: Int!, $filter: InvestigationFilter) {
  orderedInvestigations(orderBy: $orderBy, filter: $filter, offset: $offset, first: $size) {
    nodes {
      comment
      epidemiologyNumber
      coronaTestDate
      startTime
      creationDate
      complexityCode
      priority
      statusReason
      transferReason
      wasInvestigationTransferred
      groupId
      deskByDeskId {
        deskName
      }
      investigatedPatientByInvestigatedPatientId {
        subOccupationBySubOccupation{
          displayName
          parentOccupation
        }
        covidPatientByCovidPatient {
          birthDate
          fullName
          primaryPhone
          addressByAddress {
            cityByCity {
              displayName
            }
          }
        }
      }
      investigationStatusByInvestigationStatus {
        id
        displayName
      }
      investigationSubStatusByInvestigationSubStatus {
        displayName
      }
      userByCreator {
        id
        userName
        isActive
      }
      investigationGroupByGroupId {
        investigationGroupReasonByReason {
          displayName
          id
        }
        otherReason
      }
    }
    totalCount
  }
}
`;

export const GROUP_INVESTIGATIONS = (investigationGroup: number) => gql`
query AllInvestigations($orderBy: String!, $offset: Int!, $size: Int!, $filter: InvestigationFilter, $unassignedFilter: [InvestigationFilter!]) {
  orderedInvestigations(orderBy: $orderBy, filter: $filter, offset: $offset, first: $size) {
    nodes {
      comment
      epidemiologyNumber
      coronaTestDate
      startTime
      creationDate
      complexityCode
      priority
      statusReason
      transferReason
      wasInvestigationTransferred
      groupId
      deskByDeskId {
        deskName
      }
      investigatedPatientByInvestigatedPatientId {
        subOccupationBySubOccupation{
          displayName
          parentOccupation
        }
        covidPatientByCovidPatient {
          birthDate
          fullName
          primaryPhone
          addressByAddress {
            cityByCity {
              displayName
            }
          }
        }
      }
      investigationStatusByInvestigationStatus {
        id
        displayName
      }
      investigationSubStatusByInvestigationSubStatus {
        displayName
      }
      userByCreator {
        id
        userName
        isActive
        countyByInvestigationGroup {
          displayName
          id
          districtByDistrictId {
            displayName
          }
        }
      }
      investigationGroupByGroupId {
        investigationGroupReasonByReason {
          displayName
          id
        }
        otherReason
      }
    }
    totalCount
  }
  unassignedInvestigations: orderedInvestigations(filter: {userByCreator: {id: {equalTo: "admin.group${investigationGroup.toString()}"}}, and: $unassignedFilter}) {
    totalCount
  }
}
`;

export const GET_USER_BY_ID = gql`
query GetUserById($userId: String!) {
  userById(id: $userId) {
    id
    investigationGroup
    phoneNumber
    serialNumber
    userName
    userType
  }
}
`;

export const GET_ALL_INVESTIGATION_STATUS = gql`
query allInvestigationStatuses {
  allInvestigationStatuses {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_ALL_DESKS = gql`
query allDesks {
  allDesks {
    nodes {
      deskName
    }
  }
}
`;