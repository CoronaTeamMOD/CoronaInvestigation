import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { fieldsNames } from "commons/Contexts/ExposuresAndFlights";
import Toggle from "commons/Toggle/Toggle";
import { ExposureDetails } from "models/ExposureData";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import useStyles from "./ExposureDetailFormStyles";
import ExposureSearchForm from "./ExposureSearchForm/ExposureSearchForm";



const ExposureDetailsForm = (props: Props) => {

    const {
        isViewMode, index, exposureDetails
    } = props;

    const { control, errors, setValue, getValues, trigger } = useFormContext();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: fieldsNames.exposureDetails,
    });

    const isExposurePersonKnownLabel = 'האם פרטי המאומת ידועים?';

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const onAccordionExpanded = (isExpanded: boolean) => {
        setExpanded(isExpanded);
        if (isExpanded) {
            // triggerFlightFields();
        }
    }
    return (
        <Accordion
            className={classes.accordion}
            TransitionProps={{ unmountOnExit: true }}
            onChange={(e, expanded) => onAccordionExpanded(expanded)}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel1a-content'
                id='panel1a-header'
                dir='ltr'
            >
                <Grid container spacing={2} direction="row-reverse">
                </Grid></AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item md={12} container spacing={4} alignItems="center">
                        <Grid item>
                            <Typography className={classes.label}>
                                {isExposurePersonKnownLabel}
                            </Typography>
                        </Grid>
                        <>
							<Controller
                                id= {exposureDetails.id} 
								name={`exposureDetails.${index}.${fieldsNames.isExposurePersonKnown}`}
								control={control}
								defaultValue={exposureDetails.isExposurePersonKnown}
								render={(props) => (
									<Toggle
										{...props}
										onChange={(event, value) => {
											if (value !== null) {
												props.onChange(value);
											}
										}}
										disabled={isViewMode}
									/>
								)}
							/>
						</>

                    </Grid>
                </Grid>
                {/* <ExposureSearchForm isViewMode={isViewMode}> </ExposureSearchForm> */}
            </AccordionDetails>
        </Accordion>
    );
}
interface Props {
    isViewMode?: boolean;
    index: number;
    exposureDetails: ExposureDetails;
};

export default ExposureDetailsForm;
