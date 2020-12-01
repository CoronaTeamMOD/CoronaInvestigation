import { gql } from 'postgraphile';

export const GET_GROUPED_INVESTIGATIONS_REASONS = gql`
query GetAllGroupedInvestigationsReasons {
  allInvestigationGroupReasons {
    nodes {
    	id
			displayName
    }
  }
}
`;

export const GET_INVESTIGATIONS_BY_GROUP_ID = gql`
query GetAllInvestigationsByGroupId($groupId: UUID!) {
  allInvestigations(filter: {groupId: {equalTo: $groupId}}) {
    nodes {
      comment
      epidemiologyNumber
      coronaTestDate
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
  }
}
`;