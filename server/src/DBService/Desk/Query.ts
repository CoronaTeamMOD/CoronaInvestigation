import { gql } from 'postgraphile';

export const ALL_DESKS_QUERY = gql`
query AllDesks {
  allDesks {
    nodes {
      id
      name: deskName
    }
  }
}
`
export const DESKS_BY_COUNTY_ID = gql`
query DesksByCounty($countyId: Int!) {
  allDesks(filter: {countyId: {equalTo: $countyId}}) {
      nodes {
        id
        deskName
      }
  }
}
`