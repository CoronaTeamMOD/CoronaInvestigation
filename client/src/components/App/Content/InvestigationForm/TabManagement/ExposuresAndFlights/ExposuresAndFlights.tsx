import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import React, {useEffect, useContext} from 'react';
import {Collapse, Divider, Typography} from '@material-ui/core';

import axios from 'Utils/axios';
import Toggle from 'commons/Toggle/Toggle';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import {exposureAndFlightsContext, fieldsNames} from 'commons/Contexts/ExposuresAndFlights';

import useFormStyles from 'styles/formStyles';
import FlightsForm from './FlightsForm/FlightsForm';
import useStyles from './ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';


const ExposuresAndFlights = () => {
    const context = useContext(exposureAndFlightsContext);
    const {exposureAndFlightsData, setExposureDataAndFlights} = context;

    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const {fieldName} = useFormStyles();
    const classes = useStyles();

    useEffect(() => {
        axios
            .get('/exposure/' + investigationId)
            .then((result: any) => {
                if (result && result.data && result.data.data) {
                    const data = result.data.data.allExposures.nodes[0];
                    if (data) {
                        setExposureDataAndFlights(data);
                    }
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: 'לא ניתן היה לטעון את החשיפה',
                    icon: 'error',
                })
            });
    }, [investigationId]);

    const handleChangeExposureDataAndFlightsField = (fieldName: string, value: any) => {
        setExposureDataAndFlights({
            ...exposureAndFlightsData,
            [fieldName]: value,
        });
    };

    return (
        <>
            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חשיפה אפשרית
                </Typography>
                <FormRowWithInput fieldName='האם היה מגע ידוע עם חולה מאומת?'>
                    <Toggle
                        className={classes.contactToggle}
                        value={exposureAndFlightsData.wasConfirmedExposure}
                        onChange={() => {
                            handleChangeExposureDataAndFlightsField(
                                fieldsNames.wasConfirmedExposure,
                                !exposureAndFlightsData.wasConfirmedExposure
                            );
                        }}
                    />
                </FormRowWithInput>
                <Collapse
                    in={exposureAndFlightsData.wasConfirmedExposure}
                    className={classes.additionalInformationForm}
                >
                    <ExposureForm
                        exposureAndFlightsData={exposureAndFlightsData}
                        fieldsNames={fieldsNames}
                        handleChangeExposureDataAndFlightsField={
                            handleChangeExposureDataAndFlightsField
                        }
                    />
                </Collapse>
            </div>
            <Divider/>
            <div className={classes.subForm}>
                <Typography variant='caption' className={fieldName}>
                    חזרה מחו״ל
                </Typography>
                <FormRowWithInput fieldName='האם חזר מחו״ל?'>
                    <div className={classes.abroadToggle}>
                        <Toggle
                            value={exposureAndFlightsData.wasAbroad}
                            onChange={() => {
                                handleChangeExposureDataAndFlightsField(
                                    fieldsNames.wasAbroad,
                                    !exposureAndFlightsData.wasAbroad
                                );
                            }}
                        />
                    </div>
                </FormRowWithInput>
                <Collapse
                    in={exposureAndFlightsData.wasAbroad}
                    className={classes.additionalInformationForm}>
                    <FlightsForm
                        exposureAndFlightsData={exposureAndFlightsData}
                        fieldsNames={fieldsNames}
                        handleChangeExposureDataAndFlightsField={
                            handleChangeExposureDataAndFlightsField
                        }
                    />
                </Collapse>
            </div>
        </>
    );
};

export default ExposuresAndFlights;