import { useEffect } from "react";

import City from 'models/City'
import axios from 'Utils/axios'
import { setCities } from 'redux/City/cityActionCreators';

const useSignUp = () => {
    const fetchCities = () => {
        axios.get('/addressDetails/cities')
            .then((result: any) => {
                const cities: Map<string, City> = new Map();
                result && result.data && result.data.forEach((city: City) => {
                    cities.set(city.id, city)
                });
                setCities(cities);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchCities();
    }, [])
}

export default useSignUp;