interface GetAllDesksResponse {
    data: {
        allDesks: {
            nodes: Desk[]
        }
    }
}

interface Desk {
    id: number,
    district: string
}

export default GetAllDesksResponse;
