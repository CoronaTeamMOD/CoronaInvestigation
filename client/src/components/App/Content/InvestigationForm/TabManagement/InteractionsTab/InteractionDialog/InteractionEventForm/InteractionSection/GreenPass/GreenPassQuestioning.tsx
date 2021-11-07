import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';

import GreenPassInfo from 'models/GreenPassInfo';
import FormInput from 'commons/FormInput/FormInput';
import CustomToggle from 'commons/Toggle/CustomToggle';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
    
import useStyles from './GreenPassStyles';
import useGreenPassQuestioning from './useGreenPassQuestioning';

const greenPassQuestionsTitle = 'הקפדה על נהלים:';
const finalQuestionsTitle = 'מסקנת החוקר:';

const GreenPassQuestioning = (props :Props) => {

    const { greenPassInformation } = props;
    const classes = useStyles();
    const { control } = useFormContext();
    const { greenPassQuestions, greenPassAnswers, greenPass } = useGreenPassQuestioning({ greenPassInformation });

    return (
        <>
            <Typography className={classes.title}>{greenPassQuestionsTitle}</Typography>
            <Grid container>
                { greenPassQuestions.slice(0, -2).map((greenPassQuestion, index) => {
                    return (
                        <FormInput key ={greenPassQuestion.id} fieldName={greenPassQuestion.displayName} className={classes.field} isQuestion={true}>
                            <Controller
                                name={`${InteractionEventDialogFields.IS_GREEN_PASS}-${greenPassQuestion.id}`}
                                control={control}
                                defaultValue={greenPass.hasOwnProperty(greenPassQuestion.id) ? greenPass[greenPassQuestion.id] : undefined}
                                render={(props) => (
                                    <CustomToggle
                                        options={greenPassAnswers.slice(0,3)}
                                        value={props.value}
                                        onChange={(e, value) => {
                                            if (value !== null) {
                                                props.onChange(value)
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormInput>
                    )
                })}                 
            </Grid>            
            <Typography className={classes.title}>{finalQuestionsTitle}</Typography>
            <Grid container>
                { greenPassQuestions.slice(-2).map((finalQuestion) => {
                    return (
                        <FormInput key={finalQuestion.id} fieldName={finalQuestion.displayName} className={classes.field} isQuestion={true}>
                            <Controller
                                name={`${InteractionEventDialogFields.IS_GREEN_PASS}-${finalQuestion.id}`}
                                control={control}
                                defaultValue={greenPass.hasOwnProperty(finalQuestion.id) ? greenPass[finalQuestion.id] : undefined}
                                render={(props) => (
                                    <CustomToggle
                                        options={greenPassAnswers.slice(-4)}
                                        value={props.value}
                                        onChange={(e, value) => {
                                            if (value !== null) {
                                                props.onChange(value)
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormInput>
                    )
                })}
            </Grid>
        </>
    );
};

export default GreenPassQuestioning;

interface Props {
    greenPassInformation: GreenPassInfo[] | undefined; 
};