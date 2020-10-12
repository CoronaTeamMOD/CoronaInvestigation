interface GetAllCountiesResponse {
    data: {
        allCounties: {
            nodes: County[]
        }
    }
}

interface County  {
    id: number,
    displayName: string
}

export default GetAllCountiesResponse;
