import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from '../ExposuresAndFlightsStyles';


interface Props {
    wasInVacation: boolean | undefined;
    wasInEvent: boolean | undefined;
}

export const VacationOrEvent = (props: Props) => {
	const { control } = useFormContext();

    const { wasInVacation , wasInEvent} = props;
    const classes = useStyles();

    return (
		<div className={classes.subForm}>
			<FormTitle title='שהייה באתרי נופש או אירועים' />
			<FormRowWithInput fieldName='שהייה באתר נופש'>
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
							/>
						);
					}}
				/>
			</FormRowWithInput>
			<FormRowWithInput fieldName='ביקור באירוע רב משתתפים'>
			<Controller
					control={control}
					name={fieldsNames.wasInEvent}
					defaultValue={wasInEvent}
					render={ (props) => {
						return (
							<Toggle
							{...props}
							onChange={(event, value) => {
								if (value !== null) {
									props.onChange(value);
								}
							}}
						/>
						)
					}}
					/>
			</FormRowWithInput>
		</div>
	);
}
