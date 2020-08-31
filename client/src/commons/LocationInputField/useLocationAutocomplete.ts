const useLocationAutoComplete = () => {
    const locationsApiURL = 'https://moovitapp.com/index/api/location/search';

    const autoCompletePlacesFromApi = async (query: string) => {
        const params = {
            query,
            lat: 32081817,
            lng: 34781349,
            userKey: "F36560",
            metroId: 1,
        };

        const config = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return await fetch(locationsApiURL, config)
            .then(response => response.json());
    };

    return {
        autoCompletePlacesFromApi
    }
};

export default useLocationAutoComplete;