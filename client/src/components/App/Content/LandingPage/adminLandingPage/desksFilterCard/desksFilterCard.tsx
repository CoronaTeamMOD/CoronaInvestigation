import React from 'react';
import { CardActions, CardContent, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import LoadingCard from '../LoadingCard/LoadingCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import useDesksFilterCard from './useDesksFilterCard';
import AdminLandingPageFilters from '../AdminLandingPageFilters';
import useStyles, { cardHeight, cardWidth } from './desksFilterCardStyles';
interface Props {
    filteredDesks: number[];
    setFilteredDesks: React.Dispatch<React.SetStateAction<number[]>>
    setInvestigationInfoFilter: React.Dispatch<React.SetStateAction<AdminLandingPageFilters>>
}

const DesksFilterCard = (props : Props): JSX.Element => {
    const classes = useStyles();
    const { filteredDesks, setFilteredDesks, setInvestigationInfoFilter } = props;
    const { desks, isLoading, clearAllDesks, onDeskClicked, onUpdateButtonCLicked } = useDesksFilterCard({
        filteredDesks,
        setFilteredDesks,
        setInvestigationInfoFilter,
    });

    return (
        <LoadingCard isLoading={isLoading} width={cardWidth} height={cardHeight} className={classes.desksCard}>
            <CardContent className={classes.desksCardContent}>
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