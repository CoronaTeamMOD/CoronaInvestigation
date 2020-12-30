import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CardActions, CardContent, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import { landingPageRoute } from 'Utils/Routes/Routes';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import LoadingCard from '../LoadingCard/LoadingCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import useDesksFilterCard from './useDesksFilterCard';
import useStyles, { cardHeight, cardWidth } from './desksFilterCardStyles';

interface Props {
    filteredDesks: number[];
    setFilteredDesks: React.Dispatch<React.SetStateAction<number[]>>
}

const DesksFilterCard = (props : Props): JSX.Element => {
    const classes = useStyles();
    
    const { desks, isLoading } = useDesksFilterCard();
    const {filteredDesks , setFilteredDesks} = props;

    const onDeskClicked = (checkedDesk: number) => {
        if (filteredDesks.includes(checkedDesk)) {
            setFilteredDesks(filteredDesks.filter(desk => desk !== checkedDesk));
        } else {
            setFilteredDesks([...filteredDesks, checkedDesk])
        }
    }

    const onUpdateButtonCLicked = () => {
        
    }

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.desksCard}>
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
                <UpdateButton
                    onClick={onUpdateButtonCLicked}
                />
            </CardActions>
        </LoadingCard>
    )
}

export default DesksFilterCard;