import * as yup from 'yup';

import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';


const flightValidation = yup.object().shape({
    [fieldsNames.airline] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.destinationAirport] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.destinationCity] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.destinationCountry] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.flightNumber] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.originAirport] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.originCity] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.originCountry] : yup.string().nullable().required('שדה חובה'),
    [fieldsNames.flightEndDate] : yup.date().nullable().required('שדה חובה'),
    [fieldsNames.flightStartDate] : yup.date().nullable().required('שדה חובה'),
});

export default flightValidation;