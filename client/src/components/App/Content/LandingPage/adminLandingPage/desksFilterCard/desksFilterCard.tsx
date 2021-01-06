import React from 'react';
import { Box, CardActions, CardContent, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import LoadingCard from '../LoadingCard/LoadingCard';
import useDesksFilterCard from './useDesksFilterCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import useStyles, { cardHeight, cardWidth } from './desksFilterCardStyles';

interface Props {
    onUpdateButtonClicked: (filteredDesks: number[]) => void;
}

const DesksFilterCard = (props : Props): JSX.Element => {

    const classes = useStyles();
    const { onUpdateButtonClicked } = props;
    const { desks, isLoading, filteredDesks, clearAllDesks, onDeskClicked } = useDesksFilterCard();

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.desksCard}>
            <CardContent>
                <Box display='flex' flexDirection='column' className={classes.desksCardContent}>
                <Typography variant='h6' className={classes.cardTitle}>
                    <b>הדסקים בהם הינך צופה</b>
                </Typography>
                    <CustomCheckbox
                        checkboxElements={[{
                            checked: filteredDesks.length === 0,
                            labelText: <b>כל הדסקים</b>,
                            onChange: clearAllDesks
                        }]}
                    />
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
                <div className={classes.desksCardActions}>
                    <UpdateButton
                        onClick={() => onUpdateButtonClicked(filteredDesks)}
                    />
                </div>
                </Box>
            </CardContent>
        </LoadingCard>
    )
};

export default DesksFilterCard;