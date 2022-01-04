import { gql } from 'postgraphile';

import InvestigationMainStatusCodes from '../../Models/InvestigationStatus/InvestigationMainStatusCodes';

const UNASSIGNED_USER_NAME = 'לא משויך';
const WAITING_FOR_DETAILS = 'מחכה להשלמת פרטים';
const TRANSFER_REQUEST = 'נדרשת העברה';
const WAITING_FOR_RESPONSE = 'מחכה למענה';

export const USER_INVESTIGATIONS = gql`
query AllInvestigations($orderBy: String!, $offset: Int!, $size: Int!, $filter: InvestigationFilter) {
  orderedInvestigations(orderBy: $orderBy, filter: $filter, offset: $offset, first: $size) {
    nodes {
      complexityReasonsId
      comment
      isSelfInvestigated
      selfInvestigationStatus
      selfInvestigationUpdateTime
      epidemiologyNumber
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
        investigatedPatientRoleByRole{
          id,
          displayName
        }
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
          validationDate
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
        }
        authorityByAuthorityId{
          id
          authorityName
        }
      }
      investigationGroupByGroupId {
        investigationGroupReasonByReason {
          displayName
          id
        }
        otherReason
      }
      botInvestigationByEpidemiologyNumber {
        lastChatDate
        chatStatusByChatStatusId {
          id
          displayName
        }
        investigatiorReferenceRequired
        investigatorReferenceStatusByInvestigatorReferenceStatusId {
          id
          displayName
        }
        botInvestigationReferenceReasonsByBotInvestigationId {
          nodes {
            investigatorReferenceReasonByInvestigatorReferenceReasonId {
              displayName
              id
            }
          }
        }
      }
      lastUpdatorUser
    }
    totalCount
  }
}
`;

export const GROUP_INVESTIGATIONS = (investigationGroup: number) => gql`
query AllInvestigations($orderBy: String!, $offset: Int!, $size: Int!, $filter: InvestigationFilter, $unassignedFilter: [InvestigationFilter!]) {
  orderedInvestigations(orderBy: $orderBy, filter: $filter, offset: $offset, first: $size) {
    nodes {
      complexityReasonsId
      comment
      isSelfInvestigated
      selfInvestigationStatus
      selfInvestigationUpdateTime
      epidemiologyNumber
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
        investigatedPatientRoleByRole{
          id,
          displayName
        }
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
          validationDate
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
        authorityByAuthorityId{
          id
          authorityName
        }
      }
      investigationGroupByGroupId {
        investigationGroupReasonByReason {
          displayName
          id
        }
        otherReason
      }
      botInvestigationByEpidemiologyNumber {
        lastChatDate
        chatStatusByChatStatusId {
          id
          displayName
        }
        investigatiorReferenceRequired
        investigatorReferenceStatusByInvestigatorReferenceStatusId {
          id
          displayName
        }
        botInvestigationReferenceReasonsByBotInvestigationId {
          nodes {
            investigatorReferenceReasonByInvestigatorReferenceReasonId {
              displayName
              id
            }
          }
        }
      }
      lastUpdatorUser
    }
    totalCount
  }
  unassignedInvestigations: orderedInvestigations(filter: {userByCreator: {id: {equalTo: "admin.group${investigationGroup.toString()}"}}, and: $unassignedFilter}) {
    totalCount
  }
}
`;

export const GET_ALL_INVESTIGATION_STATUS = gql`
query allInvestigationStatuses {
  allInvestigationStatuses(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_ALL_ADMIN_INVESTIGATIONS = gql`
mutation adminInvestigations ( $county: Int!, $desks: [Int], $orderBy: String!, $startDate: Datetime, $endDate: Datetime ) {
  adminInvestigations(input: {
    countyInput: $county
    desksInput: $desks
    orderBy: $orderBy
    endDateInput: $endDate
    startDateInput: $startDate}) {
    json
  }
}
`;


export const GET_ALL_INVESTIGATION_SUB_STATUS = gql`
query allInvestigationSubStatuses {
  allInvestigationSubStatuses(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
      parentStatus
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

export const GET_INVESTIGATION_STATISTICS = gql`
mutation getInvestigationStatistics( $county: Int!, $desks: [Int], $startDate: Datetime, $endDate: Datetime ) {
  functionGetInvestigationStatistics(
    input: {
      countyInput: $county
      desksInput: $desks
      endDateInput: $endDate
      startDateInput: $startDate
    }
  ) {
    json
  }
}
`;

export const GET_UNALLOCATED_INVESTIGATIONS_COUNT = gql`
query unallocatedInvestigationsCount($allInvesitgationsFilter: [InvestigationFilter!]) {
  unassignedInvestigations: allInvestigations(filter: {userByCreator: {or: {userName: {equalTo: "${UNASSIGNED_USER_NAME}"}, isActive: {equalTo: false}}}, and: $allInvesitgationsFilter}) {
    totalCount
  }
}
`;

export const GET_ALL_ADMIN_MESSAGES_BY_DESK = gql`
query allAdminMessages($desksIdInput: [Int!]) {
  allAdminMessages (filter: {desksId: {contains: $desksIdInput}}) {
    nodes {
      message
      id
      adminId
      desksId
    }
  }
}
`;

export const GET_ALL_ADMIN_MESSAGES_BY_DESK_AND_ADMIN = gql`
query allAdminMessages($desksIdInput: [Int!], $adminIdInput: String! ) {
  allAdminMessages (filter: {desksId: {contains: $desksIdInput}, adminId: {equalTo: $adminIdInput}}) {
    nodes {
      adminId
      desksId
      id
      message
    }
  }
}
`;

export const GET_ALL_INVESTIGATOR_REFERENCE_STATUSES = gql`
query allInvestigatorReferenceStatuses {
  allInvestigatorReferenceStatuses(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_ALL_CHAT_STATUSES = gql`
query allChatStatuses {
  allChatStatuses(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;