interface GetAllDesks {
    data: {
        allDesks: {
            nodes: Desk[]
        }
    }
}

interface Desk {
    id: number;
    deskName: string;
}

export default GetAllDesks;