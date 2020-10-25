interface GetAllDesks {
    data: {
        allDesks: {
            nodes: Desk[]
        }
    }
}

interface Desk {
    deskName: string;
}

export default GetAllDesks;