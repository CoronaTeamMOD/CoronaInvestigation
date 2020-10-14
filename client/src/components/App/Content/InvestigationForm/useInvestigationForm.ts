import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import City from 'models/City';
import axios from 'Utils/axios';
import theme from 'styles/theme';
import Country from 'models/Country';
import ContactType from 'models/ContactType';
import {timeout} from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import {landingPageRoute} from 'Utils/Routes/Routes';
import {setCities} from 'redux/City/cityActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';
import InvestigationStatus from 'models/enums/InvestigationMainStatus';
import { setContactType } from 'redux/ContactType/contactTypeActionCreators';

import useStyles from './InvestigationFormStyles';
import { LandingPageTimer } from './InvestigationInfo/InvestigationInfoBar';
import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';

const useInvestigationForm = (): useInvestigationFormOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const classes = useStyles({});
    let history = useHistory();
    const [areThereContacts, setAreThereContacts] = useState<boolean>(false);

    const initializeTabShow = () => {
        axios.get('/contactedPeople/amountOfContacts/' + epidemiologyNumber).then((result: any) => {
            setAreThereContacts(result?.data?.data?.allContactedPeople?.totalCount > 0);
        }).catch(() => {
            handleContactsQueryFail();
        });
    };

    const fetchCities = () => {
        if (cities && cities.size === 0) {
            axios.get('/addressDetails/cities')
                .then((result: any) => {
                    const cities: Map<string, City> = new Map();
                    result && result.data && result.data.forEach((city: City) => {
                        cities.set(city.id, city)
                    });
                    setCities(cities);
                })
                .catch(err => console.log(err));
        }
    };

    const fetchContactTypes = () => {
        axios.get('/intersections/contactTypes')
            .then((result: any) => {
                const contactTypes: Map<number, ContactType> = new Map();
                result && result.data && result.data.forEach((contactType: ContactType) => {
                    contactTypes.set(contactType.id, contactType)
                });
                setContactType(contactTypes);
            })
            .catch(err => console.log(err));
    }

    const fetchCountries = () => {
        axios.get('/addressDetails/countries')
            .then((result: any) => {
                const countries: Map<string, Country> = new Map();
                result && result.data && result.data.forEach((country: Country) => {
                    countries.set(country.id, country)
                });
                setCountries(countries);
            })
            .catch(err=> console.log(err));
    };

    useEffect(() => {
        fetchCities();
        fetchCountries();
        fetchContactTypes();
    }, []);

    useEffect(() => {
        if (epidemiologyNumber !== -1) {
            initializeTabShow();
        }
    }, [epidemiologyNumber]);

    const confirmFinishInvestigation = (epidemiologyNumber: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle
            }
        }).then((result) => {
            if (result.value) {
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationMainStatus : InvestigationStatus.DONE,
                    investigationSubStatus: null,
                    epidemiologyNumber: epidemiologyNumber
                }).then(() => {
                    axios.post('/investigationInfo/updateInvestigationEndTime', {
                        investigationEndTime: new Date(),
                        epidemiologyNumber
                    }).then(() => handleInvestigationFinish()).catch(() => handleInvestigationFinishFailed())
                }).catch(() => {
                    handleInvestigationFinishFailed();
                })
            };
        });
    };

    const handleInvestigationFinish = () => {
        Swal.fire({
            icon: 'success',
            title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: classes.swalTitle
            },
            timer: 1750,
            showConfirmButton: false
        }
        );
        timeout(LandingPageTimer).then(() => {
            history.push(landingPageRoute);
        });
    };

    const handleInvestigationFinishFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לסיים את החקירה',
            icon: 'error',
        })
    };

    const handleContactsQueryFail = () => {
        Swal.fire({
            title: 'לא היה ניתן לשלוף את מספר המגעים',
            icon: 'error',
        })
    };

    return {
        confirmFinishInvestigation,
        handleInvestigationFinish,
        areThereContacts,
        setAreThereContacts
    };
};

export default useInvestigationForm;
