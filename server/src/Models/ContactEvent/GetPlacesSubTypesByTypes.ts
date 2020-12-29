
export interface GetPlaceSubTypesByTypesResposne {
    data: {
        allPlaceTypes: {
            nodes: DBPlaceType[]
        }
    }
}

export interface PlacesSubTypesByTypes {
    [type: string]: PlaceSubType[]
}

interface DBPlaceType {
    displayName: string,
    placeSubTypesByParentPlaceType: {nodes: PlaceSubType[]}
}

export interface PlaceSubType {
    id: number;
    displayName: string;
}