import React from "react";
import { Grid, Typography } from "@material-ui/core";
import useFormStyles from "styles/formStyles";

interface FormRowWithInputProps {
	fieldName: string;
	children: React.ReactElement;
	testId?: string;
}

const FormRowWithInput = ({ fieldName, children, testId }: FormRowWithInputProps) => {
	const classes = useFormStyles();

	return (
		<div className={classes.formRow} test-id={testId}>
			<Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
				<Typography variant="caption" className={classes.fieldName}>
					{fieldName}
				</Typography>
			</Grid>
			<Grid item xs={12} sm={6} md={6} lg={9} xl={9}>
				{children}
			</Grid>
		</div>
	);
};

export default FormRowWithInput;
