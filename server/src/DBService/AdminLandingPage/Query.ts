import { gql } from 'postgraphile';

export const ALL_INVESTIGATION_STATS = gql`
query getAllInvestigationStats ($districtId : Int!){
  allInvestigations(filter: {userByCreator: {investigationGroup: {equalTo: $districtId}}}) {
    edges {
      node {
        investigationStatus
        userByCreator {
          isActive
          userName
        }
      }
    }
  }
}

` 