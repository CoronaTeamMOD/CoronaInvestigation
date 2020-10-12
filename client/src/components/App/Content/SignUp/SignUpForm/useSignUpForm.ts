import { useEffect } from "react";

import City from 'models/City'
import axios from 'Utils/axios'
import { setCities } from 'redux/City/cityActionCreators';

import { useSignUpFormParameters } from './SignUpFormInterfaces';

const useSignUp = (props: useSignUpFormParameters) => {

    const { setCounties } = props;

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

    const fetchCounties = () => {
        axios.get('/users/counties')
            .then(result => {
                result?.data && setCounties(result?.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchCities();
        fetchCounties();
    }, [])
}

export default useSignUp;