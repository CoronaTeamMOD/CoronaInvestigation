export interface GetContactTypeResponse {
    data: {
        allContactTypes: {
            nodes: ContactType[]
        }
    }
}

export interface ContactType {
    id: number;
    displayName: string;
}