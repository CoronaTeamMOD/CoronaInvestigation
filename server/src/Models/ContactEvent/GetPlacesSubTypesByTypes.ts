export interface GetPlaceSubTypesByTypesResposne {
    data: {
        allPlaceTypes: {
            nodes: PlaceType[]
        }
    }
}

export interface PlacesSubTypesByTypes {
    [type: string]: string[]
}

interface PlaceType {
    displayName: string,
    placeSubTypesByParentPlaceType: {nodes: PlaceSubType[]}
}

interface PlaceSubType {
    displayName: string
}