import { gql } from 'postgraphile';

export const GET_INVESTIGATION_DETAILS = gql`
query GetInvestigationDetails {
    allInvestigations {
      nodes {
        isReturnSick
        isVaccinated
        isSuspicionOfMutation
        epidemiologyNumber
        investigatedPatientId
        investigatedPatientByInvestigatedPatientId {
          covidPatientByCovidPatient {
            age
            birthDate
            fullName
          }
          isDeceased
          isInClosedInstitution
          isCurrentlyHospitalized
          hmo
          occupation
        }
        exposuresByInvestigationId {
          nodes {
            wasAbroad
          }
        }
        complexityCode
        investigationStatus
      }
    }
  }  
`;