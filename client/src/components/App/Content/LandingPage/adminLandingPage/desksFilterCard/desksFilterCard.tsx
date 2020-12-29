import React, { useState } from 'react';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';

import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import useStyles from './desksFilterCardStyles';
import UpdateButton from '../UpdateButton/UpdateButton';
import Desk from 'models/Desk';
import useDesksFilterCard from './useDesksFilterCard';

const DesksFilterCard: React.FC = (): JSX.Element => {
    const classes = useStyles();

    const [filteredDesks, setFilteredDesks] = useState<number[]>([]);

    const { desks } = useDesksFilterCard();

    const onDeskClicked = (checkedDesk: number) => {
        if (filteredDesks.includes(checkedDesk)) {
            setFilteredDesks(filteredDesks.filter(desk => desk !== checkedDesk));
        } else {
            setFilteredDesks([...filteredDesks, checkedDesk])
        }
    }

    return (
        <Card className={classes.desksCard}>
            <CardContent className={classes.desksCardContent}>
                <Typography variant='h6' className={classes.cardTitle}>
                    <b>הדסקים בהם הינך צופה</b>
                </Typography>
                <div className={classes.desksWrapper}>
                    {
                        desks.map((desk: Desk) => (
                            <CustomCheckbox
                                checkboxElements={[{
                                    key: desk.id,
                                    value: desk.id,
                                    checked: filteredDesks.includes(desk.id),
                                    labelText: desk.deskName,
                                    onChange: () => onDeskClicked(desk.id)
                                }]}
                            />
                        ))
                    }
                </div>
            </CardContent>
            <CardActions className={classes.desksCardActions}>
                <UpdateButton/>
            </CardActions>
        </Card>
    )
}

export default DesksFilterCard;