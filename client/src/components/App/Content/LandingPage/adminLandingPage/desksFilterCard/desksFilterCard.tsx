import React , { useState , useEffect} from 'react';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';

import Desk from 'models/Desk';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';

import useStyles from './desksFilterCardStyles';
import useDesksFilterCard from './useDesksFilterCard';
import UpdateButton from '../UpdateButton/UpdateButton';

const DesksFilterCard: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const [allDesks, setAllDesks] = useState<Desk[]>([])
    const { setAllDesksAsync } = useDesksFilterCard({setAllDesks});

    useEffect(() => {
        setAllDesksAsync();
    }, [])

    return (
        <Card className={classes.desksCard}>
            <CardContent className={classes.desksCardContent}>
                <Typography variant='h6' className={classes.cardTitle}>
                    <b>הדסקים בהם הינך צופה</b>
                </Typography>
                {
                    allDesks.map((desk: Desk) => (
                        <CustomCheckbox
                            checkboxElements={[{
                                key: desk.id,
                                value: desk.id,
                                labelText: desk.deskName,
                            }]}
                        />
                    ))
                }
            </CardContent>
            <CardActions className={classes.desksCardActions}>
                <UpdateButton/>
            </CardActions>
        </Card>
    )
}

export default DesksFilterCard;
