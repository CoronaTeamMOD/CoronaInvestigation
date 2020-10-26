import { gql } from 'postgraphile';

export const ALL_DESKS_QUERY = gql`
query AllDesks {
  allDesks {
    nodes {
      id
      deskName
    }
  }
}
`