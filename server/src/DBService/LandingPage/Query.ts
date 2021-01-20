import { gql } from 'postgraphile';

import InvestigationMainStatusCodes from '../../Models/InvestigationStatus/InvestigationMainStatusCodes';

const UNASSIGNED_USER_NAME = 'לא משויך';
const WAITING_FOR_DETAILS = 'מחכה להשלמת פרטים';
const TRANSFER_REQUEST = 'נדרשת העברה';

export const USER_INVESTIGATIONS = gql`
query AllInvestigations($orderBy: String!, $offset: Int!, $size: Int!, $filter: InvestigationFilter) {
  orderedInvestigations(orderBy: $orderBy, filter: $filter, offset: $offset, first: $size) {
    nodes {
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

export const GET_ALL_INVESTIGATION_SUB_STATUS = gql`
query allInvestigationSubStatuses {
  allInvestigationSubStatuses(orderBy: DISPLAY_NAME_ASC) {
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

export const GET_INVESTIGATION_STATISTICS = gql`
query InvestigationStatistics($userFilters: [InvestigationFilter!], $allInvesitgationsFilter: InvestigationFilter!, $lastUpdateDateFilter: InvestigationFilter!, $inProgressSubStatusFilter: InvestigationFilter!){
  allInvestigations(filter: $allInvesitgationsFilter) {
    totalCount
  }
  inProcessInvestigations: allInvestigations(filter: {
    investigationStatusByInvestigationStatus: {
      id: {equalTo: ${String(InvestigationMainStatusCodes.IN_PROCESS)}}
    },
    and: $userFilters
  }) {
    totalCount
  }
  newInvestigations: allInvestigations(filter: {
    investigationStatusByInvestigationStatus: {
      id: {equalTo: ${String(InvestigationMainStatusCodes.NEW)}}
    }, 
    and: $userFilters
  }) {
    totalCount
  }
  unassignedInvestigations: allInvestigations(filter: {
    userByCreator: {
      userName: {equalTo: "${UNASSIGNED_USER_NAME}"}
    },
    and: $userFilters
  }) {
    totalCount
  }
  inactiveInvestigations: allInvestigations(filter: {
    userByCreator: {
      isActive: {equalTo: false},
      userName: {notEqualTo: "${UNASSIGNED_USER_NAME}"}
    },
    and: $userFilters
  }) {
    totalCount
  }
  unallocatedInvestigations: allInvestigations(
    filter: {and: [
        {userByCreator: {or: [{isActive: {equalTo: false}}, {userName: {equalTo: "${UNASSIGNED_USER_NAME}"}}]}},
        {investigationStatus: {in:[${String(InvestigationMainStatusCodes.NEW)}, ${String(InvestigationMainStatusCodes.IN_PROCESS)}]}},
        $allInvesitgationsFilter
      ]},
    ) {
    totalCount
  }
  unusualInProgressInvestigations: allInvestigations(filter: {
    and: [
    {investigationStatus: {equalTo:${String(InvestigationMainStatusCodes.IN_PROCESS)}}},
    $lastUpdateDateFilter,
    $inProgressSubStatusFilter,
    $allInvesitgationsFilter]
  }) {
    totalCount
  }
  unusualCompletedNoContactInvestigations: allInvestigations(filter:{
    and:[{contactEventsByInvestigationId:{
      every:{
        contactedPeopleByContactEvent:{
          every:{
            contactEvent:{
              isNull:true
            }
          }
        }
      }
    }},
    {investigationStatus: {equalTo:${String(InvestigationMainStatusCodes.DONE)}}},
    $allInvesitgationsFilter]
  }){
    totalCount
  }
  transferRequestInvestigations: allInvestigations(
    filter: {and: [
        {investigationSubStatus: {equalTo: "${TRANSFER_REQUEST}"}},
        $allInvesitgationsFilter
      ]},
    ) {
    totalCount
  }
  waitingForDetailsInvestigations: allInvestigations(
    filter: {and: [
        {investigationSubStatus: {equalTo: "${WAITING_FOR_DETAILS}"}},
        $allInvesitgationsFilter
      ]},
    ) {
    totalCount
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