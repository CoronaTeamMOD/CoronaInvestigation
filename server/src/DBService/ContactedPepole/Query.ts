import { gql } from "postgraphile";

export const GET_CONTACTED_PEPOLE = gql`
query ContactedPepoleByInvestigationId ($investigationId: Int!){
    allContactedPeople(filter: {contactEventByContactEvent: {investigationId: {equalTo: $investigationId}}}) {
        nodes {
          personByPersonInfo {
            firstName
            lastName
            phoneNumber
          }
          contactEventByContactEvent {
            startTime
          }
          doesNeedIsolation
          extraInfo
        }
      }
}
`;