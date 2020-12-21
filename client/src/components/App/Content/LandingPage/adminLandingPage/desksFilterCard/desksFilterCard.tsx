import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';

import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import useStyles from './desksFilterCardStyles';

const DesksFilterCard: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const allDesks = ['desk a', 'desk b', 'desk c'];

    return (
        <Card className={classes.desksCard}>
            <CardContent className={classes.desksCardContent}>
                <Typography variant='h6' className={classes.cardTitle}>
                    <b>הדסקים בהם הינך צופה</b>
                </Typography>
                {
                    allDesks.map((desk: any) => (
                        <CustomCheckbox
                            checkboxElements={[{
                                key: desk,
                                value: desk,
                                labelText: desk,
                            }]}
                        />
                    ))
                }
            </CardContent>
            <CardActions style={{ direction: 'ltr', paddingLeft: '1vw' }}>
                <Button
                    className={classes.updateButton}
                    variant='contained'
                    size='small'>
                    עדכון
                </Button>
            </CardActions>
        </Card>
    )
}

export default DesksFilterCard;
