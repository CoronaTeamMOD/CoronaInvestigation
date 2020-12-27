import { gql } from 'postgraphile';

export const GET_ALL_EDUCATION_GRADES = gql`
query GetAllEducationGrades {
  allEducationGrades {
    nodes {
      id
      displayName
    }
  }
}
`;
