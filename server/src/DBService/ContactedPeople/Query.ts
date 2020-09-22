import { gql } from "postgraphile";

export const GET_CONTACTED_PEOPLE = gql`
query ContactedPeopleByInvestigationId ($investigationId: Int!){
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