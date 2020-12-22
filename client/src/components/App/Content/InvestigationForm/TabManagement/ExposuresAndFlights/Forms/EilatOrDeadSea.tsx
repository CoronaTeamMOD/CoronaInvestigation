import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from '../ExposuresAndFlightsStyles';


interface Props {
    wasInEilat: boolean;
    wasInDeadSea: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
}

export const EilatOrDeadSea = (props: Props) => {
	const { control } = useFormContext();

    const { wasInEilat , wasInDeadSea , onExposuresStatusChange } = props;
    const classes = useStyles();

    return (
		<div className={classes.subForm}>
			<FormTitle title='חזרה מאילת או מים המלח' />
			<FormRowWithInput fieldName='חזר מאילת'>
				<Controller
					control={control}
					name={fieldsNames.wasInEilat}
					defaultValue={wasInEilat}
					render={(props) => {
						return (
							<Toggle
								{...props}
								onChange={(event, value) => {
									if (value !== null) {
										props.onChange(value);
										onExposuresStatusChange(fieldsNames.wasInEilat, value);
									}
								}}
							/>
						);
					}}
				/>
			</FormRowWithInput>
			<FormRowWithInput fieldName='חזר מים המלח'>
			<Controller
					control={control}
					name={fieldsNames.wasInDeadSea}
					defaultValue={wasInDeadSea}
					render={ (props) => {
						return (
							<Toggle
							{...props}
							onChange={(event, value) => {
								if (value !== null) {
									props.onChange(value);
									onExposuresStatusChange(fieldsNames.wasInDeadSea, value);
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
