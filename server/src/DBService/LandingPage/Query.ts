import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
mutation GetSortedUserInvestigation ($userId: String!, $orderBy: String!) {
  userInvestigationsSort(input: {userId: $userId, orderBy: $orderBy}) {
    json
  }
}
`;

export const GET_GROUP_INVESTIGATIONS = gql`
mutation GetSortedGroupInvestigation ($investigationGroupId: Int!, $orderBy: String!) {
  groupInvestigationsSort(input: {investigationGroupId: $investigationGroupId, orderBy: $orderBy}) {
    json
  }
}
`;

export const ORDERED_INVESTIGATIONS = gql`
query AllInvestigations($orderBy: String!, $offset: Int!, $size: Int!, $filter: InvestigationFilter) {
  orderedInvestigations(orderBy: $orderBy, filter: $filter, offset: $offset, first: $size) {
    nodes {
      comment
      epidemiologyNumber
      coronaTestDate
      complexityCode
      priority
      statusReason
      transferReason
      wasInvestigationTransferred
      deskByDeskId {
        deskName
      }
      investigatedPatientByInvestigatedPatientId {
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
        displayName
      }
      investigationSubStatusByInvestigationSubStatus {
        displayName
      }
      userByCreator {
        id
        userName
      }
    }
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

export const GET_ALL_COUNTIES = gql`
query getAllAvailableCounties {
  allCounties {
    nodes {
      id
      districtByDistrictId {
        displayName
      }
      displayName
    }
  }
}
`;

export const GET_ALL_INVESTIGATION_STATUS = gql`
query allInvestigationStatuses {
  allInvestigationStatuses {
    nodes {
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