import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';


import Toggle from 'commons/Toggle/Toggle';
import FormInput from 'commons/FormInput/FormInput';
import TripleToggle from 'commons/Toggle/TripleToggle';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
    
import useStyles from './GreenPassStyles';
import useGreenPassQuestioning from './useGreenPassQuestioning';

const greenPassQuestionsTitle = 'הקפדה על נהלים:';
const finalQuestionsTitle = 'מסקנת החוקר:';

const GreenPassQuestioning = (props :Props) => {

    const { control } = useFormContext();

    const { greenPassQuestions, greenPassAnswers } = useGreenPassQuestioning();

    const classes = useStyles();

    return (
        <>
            <Typography className={classes.title}>{greenPassQuestionsTitle}</Typography>
            <Grid container>
                { greenPassQuestions.slice(0, -2).map((greenPassQuestion) => {
                    return (
                        <FormInput fieldName={greenPassQuestion.displayName} className={classes.field} isQuestion={true}>
                            <Controller
                                name={`${InteractionEventDialogFields.IS_GREEN_PASS}-${greenPassQuestion.id}`}
                                control={control}
                                render={(props) => (
                                    <Toggle
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
                        <FormInput fieldName={finalQuestion.displayName} className={classes.field} isQuestion={true}>
                            <Controller
                                name={`${InteractionEventDialogFields.IS_GREEN_PASS}-${finalQuestion.id}`}
                                control={control}
                                render={(props) => (
                                    <TripleToggle
                                        firstOption={greenPassAnswers[greenPassAnswers.length-3]}
                                        secondOption={greenPassAnswers[greenPassAnswers.length-2]}
                                        thirdOption={greenPassAnswers[greenPassAnswers.length-1]}
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
};