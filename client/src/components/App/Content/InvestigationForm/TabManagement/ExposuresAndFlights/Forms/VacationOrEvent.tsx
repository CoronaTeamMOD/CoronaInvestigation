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
	isViewMode?: boolean;
}

export const VacationOrEvent = (props: Props) => {
	const { control, errors } = useFormContext();

	const { wasInVacation, wasInEvent, isViewMode } = props;
	const classes = useStyles();

	return (
		<div className={classes.subForm}>
			<FormTitle title='שהייה באתרי נופש או אירועים' />
			<Grid item xs={11}>
				<FormRowWithInput fieldName='שהייה באתר נופש'>
					<>
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
					</>
				</FormRowWithInput>
			</Grid>
			<Grid item xs={11}>
				<FormRowWithInput fieldName='ביקור באירוע רב משתתפים'>
					<>
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
					</>
				</FormRowWithInput>
			</Grid>
		</div>
	);
}
