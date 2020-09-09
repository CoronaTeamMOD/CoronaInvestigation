import { gql } from 'postgraphile';

export const ADD_ADDRESS_AND_GET_ID = gql`
mutation callAddressInsertionFunction($apartment: Int!, $city: String!, $entrance: String!, 
  $floor: Int!, $houseNum: Int!, $neighbourhood: String!, $street: String!) {
  insertAndGetAddressId(input: {
    apartmentValue: $apartment, 
    cityValue: $city, 
    entranceValue: $entrance, 
    floorValue: $floor, 
    houseNumValue: $houseNum, 
    streetValue: $street, 
    neighbourhoodValue: $neighbourhood
  }) {
    integer
  }
}

`;