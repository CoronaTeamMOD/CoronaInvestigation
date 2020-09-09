export interface GetLocationSubTypesByTypesResposne {
    data: {
        allPlaceTypes: {
            nodes: PlaceType[]
        }
    }
}

export interface LocationsSubTypesByTypes {
    [type: string]: string[]
}

interface PlaceType {
    displayName: string,
    placeSubTypesByParentPlaceType: {nodes: PlaceSubType[]}
}

interface PlaceSubType {
    displayName: string
}