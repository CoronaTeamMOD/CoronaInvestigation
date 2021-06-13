import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';
import FormTitle from 'commons/FormTitle/FormTitle';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from '../ExposuresAndFlightsStyles';

interface Props {
	wasInVacation: boolean | undefined;
	wasInEvent: boolean | undefined;
	isViewMode: boolean;
}

export const VacationOrEvent = (props: Props) => {
	const { control, errors } = useFormContext();

	const { wasInVacation, wasInEvent, isViewMode } = props;
	const classes = useStyles();

	return (
		<div className={classes.subForm}>
			<FormTitle title='שהייה באתרי נופש או אירועים' />
			<FormRowWithInput fieldName='שהייה באתר נופש'>
				<Grid item xs={4}>
					<Controller
						control={control}
						name={fieldsNames.wasInVacation}
						defaultValue={wasInVacation}
						render={(props) => {
							return (
								<Toggle
									{...props}
									onChange={(event, value) => {
										if (value !== null) {
											props.onChange(value);
										}
									}}
									disabled={isViewMode}
								/>
							);
						}}
					/>
					<InlineErrorText
						error={errors[fieldsNames.wasInVacation]}
					/>
				</Grid>
			</FormRowWithInput>
			<FormRowWithInput fieldName='ביקור באירוע רב משתתפים'>
				<Grid item xs={4}>
					<Controller
						control={control}
						name={fieldsNames.wasInEvent}
						defaultValue={wasInEvent}
						render={(props) => {
							return (
								<Toggle
									{...props}
									onChange={(event, value) => {
										if (value !== null) {
											props.onChange(value);
										}
									}}
									disabled={isViewMode}
								/>
							)
						}}
					/>
					<InlineErrorText
						error={errors[fieldsNames.wasInEvent]}
					/>
				</Grid>
			</FormRowWithInput>
		</div>
	);
}
