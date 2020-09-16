import { gql } from 'postgraphile';

export const getAllHospitals = gql`
query AllHospitals {
  allHospitals {
    nodes {
      id
      name
    }
  }
}
`;