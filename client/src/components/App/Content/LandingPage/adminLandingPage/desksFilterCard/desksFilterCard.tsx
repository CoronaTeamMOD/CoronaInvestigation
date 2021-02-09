import React from 'react';
import { Box, CardContent, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import useDesksUtils from 'Utils/Desk/useDesksUtils';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import LoadingCard from '../LoadingCard/LoadingCard';
import useDesksFilterCard from './useDesksFilterCard';
import UpdateButton from '../UpdateButton/UpdateButton';
import useStyles, { cardHeight, cardWidth } from './desksFilterCardStyles';

interface Props {
    onUpdateButtonClicked: (filteredDesks: number[]) => void;
}

const DesksFilterCard = (props: Props): JSX.Element => {

    const classes = useStyles();
    const { onUpdateButtonClicked } = props;
    const { filteredDesks, clearAllDesks, onDeskClicked } = useDesksFilterCard();

    const { countyDesks } = useDesksUtils();

    return (
        <LoadingCard isLoading={countyDesks.length === 0} width={cardWidth} height={cardHeight} className={classes.desksCard}>
            <CardContent>
                <Box display='flex' flexDirection='column' className={classes.desksCardContent}>
                    <Typography variant='h6' id='desks-card-headline'>
                        <b>הדסקים בהם הינך צופה</b>
                    </Typography>
                    <CustomCheckbox
                        checkboxElements={[{
                            id:'all-desks-checkbox',
                            checked: filteredDesks.length === 0,
                            labelText: <b>כל הדסקים</b>,
                            onChange: clearAllDesks
                        }]}
                    />
                    <div className={classes.desksWrapper} id='desks-wrapper'>
                        {
                            countyDesks.map((desk: Desk) => (
                                <CustomCheckbox
                                    key={`custom-checkbox-${desk.id}`}
                                    checkboxElements={[{
                                        id: `desk-checkbox-${desk.id}`,
                                        key: desk.id,
                                        value: desk.id,
                                        checked: filteredDesks.includes(desk.id!),
                                        labelText: desk.deskName,
                                        onChange: () => onDeskClicked(desk.id!)
                                    }]}
                                />
                            ))
                        }
                    </div>
                    <div className={classes.desksCardActions}>
                        <UpdateButton
                            id='desks-filter-update-button'
                            onClick={() => onUpdateButtonClicked(filteredDesks)}
                        />
                    </div>
                </Box>
            </CardContent>
        </LoadingCard>
    )
};

export default DesksFilterCard;
