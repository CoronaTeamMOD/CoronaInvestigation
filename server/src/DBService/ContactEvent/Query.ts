import { gql } from 'postgraphile';

export const GET_LOACTIONS_SUB_TYPES_BY_TYPES = gql`
query getPlacesSubTypesByTypes {
    allPlaceTypes {
      nodes {
        displayName
        placeSubTypesByParentPlaceType {
          nodes {
            id
            displayName
          }
        }
      }
    }
  }
`;

export const GET_ALL_CONTACT_TYPES = gql`
query getAllContactTypes {
  allContactTypes(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;
const involvedFieldsToQuery = `
id
familyRelationship: familyRelationshipByFamilyRelationship {
  id
  displayName
}
personByPersonId {
  birthDate
  additionalPhoneNumber
  firstName
  identificationNumber
  finalEpidemiologicalStatusDesc
  colorCode
  identificationType: identificationTypeByIdentificationType {
    type
    id
  }
  lastName
  phoneNumber
  epidemiologicStatus: personEpidemiologicStatusByPersonEpidemiologicStatusId {
    recoveryDate
    serologicImmunityStartDate
    serologicImmunityExpirationDate
    vaccineEffectivenessStartDate
    vaccineExpirationDate
  }
}
involvementReason,
isStayAnotherCountry,
isContactedPerson
address: addressByIsolationAddress {
  city: cityByCity {
    id
    displayName
  }
  street: streetByStreet {
    id
    displayName
  }
  houseNum
  floor
}
educationGrade: educationGradeByEducationGrade {
  educationGrade: displayName
}
educationClassNumber
subOccupationByInstitutionName {
  institutionName: displayName
}
`;

export const GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID = gql`
query getEventAndPeopleByInvestigationID($currInvestigation: Int!, $minimalDateToFilter: Datetime!) {
  allContactEvents(filter: {investigationId: {equalTo: $currInvestigation}, startTime: {greaterThanOrEqualTo: $minimalDateToFilter}}) {
    nodes {
      id
      isRepetitive
      unknownTime
      hospitalDepartment
      airline
      allowsHamagenData
      boardingStation
      busCompany
      cityDestination
      cityOrigin
      busLine
      contactPersonFirstName
      contactPersonLastName
      contactPersonPhoneNumber
      contactPhoneNumber
      endStation
      endTime
      externalizationApproval
      externalizationApprovalDescription: externalizationApprovalDesc
      flightDestinationAirport
      flightDestinationCity
      flightDestinationCountry
      flightNum
      flightOriginAirport
      flightOriginCity
      flightOriginCountry
      grade
      investigationId
      isolationStartDate
      locationAddress
      numberOfContacted
      placeName
      placeDescription
      placeSubType
      placeType
      startTime
      trainLine
      creationTime
      isThereMoreVerified
      detailsAdditionalVerified
      contactedPeopleByContactEvent {
        nodes {
          id
          contactEvent
          contactType
          extraInfo
          creationTime
          involvedContactId
          personInfo
          personByPersonInfo {
            firstName
            identificationNumber
            identificationType: identificationTypeByIdentificationType {
              type
              id
            }
            lastName
            phoneNumber
            personContactDetailByPersonInfo {
              contactStatus
              isStayAnotherCountry
            }
          }
          involvedContact: involvedContactByInvolvedContactId {
            ${involvedFieldsToQuery}
          }
        }
      }
      greenPassInformationsByContactEventId {
        nodes {
          questionId
          answerId
        }
      }
    }
  }
}
`;

export const GET_ALL_INVOLVED_CONTACTS = gql`
query getAllInvolvedContacts($currInvestigation: Int!) {
  allInvolvedContacts(filter: {investigationId: {equalTo: $currInvestigation}}) {
    nodes {
      ${involvedFieldsToQuery}
    }
  }
}
`;

export const CONTACTS_BY_GROUP_ID = gql`
query contactsByGroupId($groupId: UUID!, $epidemiologynumber: Int!) {
  investigationGroupById(id: $groupId) {
    otherReason
    investigationGroupReasonByReason {
      id
      displayName
    }
    investigationsByGroupId(filter: {epidemiologyNumber: {notEqualTo: $epidemiologynumber}}) {
      nodes {
        epidemiologyNumber
        investigatedPatientByInvestigatedPatientId {
          covidPatientByCovidPatient {
            fullName
            identityNumber
          }
        }
        contactEventsByInvestigationId(filter: {contactedPeopleByContactEventExist: true}) {
          nodes {
            contactedPeopleByContactEvent {
              nodes {
                id
                involvedContactByInvolvedContactId {
                  involvementReason
                }
                personByPersonInfo {
                  firstName
                  identificationNumber
                  lastName
                  id
                  identificationType: identificationTypeByIdentificationType {
                    type
                    id
                  }
                  phoneNumber
                  birthDate
                  additionalPhoneNumber
                  personContactDetailByPersonInfo {
                    addressByIsolationAddress {
                      cityByCity {
                        displayName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const CONTACTS_BY_CONTACTS_IDS = gql`
  query ContactByContactsIds($ids: [Int!]) {
    allPersonContactDetails(filter: {personInfo: {in: $ids}}) {
      edges {
        node {
          repeatingOccuranceWithConfirmed
          relationship
          personInfo
          occupation
          lastUpdateTime
          isolationAddress
          extraInfo
          doesWorkWithCrowd
          familyRelationship
          doesNeedIsolation
          doesNeedHelpInIsolation
          doesLiveWithConfirmed
          doesHaveBackgroundDiseases
          doesFeelGood
        }
      }
    }
  }
`;

export const GET_ALL_GREEN_PASS_QUESTIONS = gql`
query getAllGreenPassQuestions {
  allGreenPassQuestions(orderBy: ID_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_ALL_GREEN_PASS_ANSWERS = gql`
query allGreenPassAnswers {
  allGreenPassAnswers(orderBy: ID_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;