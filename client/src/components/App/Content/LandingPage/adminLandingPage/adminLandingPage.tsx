import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';

import DatePick from 'commons/DatePick/DatePick';
import { landingPageRoute } from 'Utils/Routes/Routes';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import useAppToolbar from 'components/App/AppToolbar/useAppToolbar';

import useStyles from './adminLandingPageStyles';

const LandingPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    let history = useHistory();

    const { countyDisplayName } = useAppToolbar();

    const allDesks = ['desk a', 'desk b', 'desk c'];

    return (
        <div className={classes.content}>
            <Typography><b>{'נפת ' + countyDisplayName}</b></Typography>
            <Grid container spacing={5}>
                <Grid item xs={3}>
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
                </Grid>
                <Grid item xs={9}>
                    <Card className={classes.filtersCard}>
                        <CardContent className={classes.TimeRangeCardContent}>
                            <div>נתונים</div>
                        </CardContent>
                        <CardActions>
                            <Button
                                onClick={() => {
                                    history.push(landingPageRoute)
                                    console.log('filter')
                                }}>
                                חקירות בסך הכל
                    </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card className={classes.timeRangeCard}>
                        <CardContent className={classes.TimeRangeCardContent}>
                            <Typography variant='h6' className={classes.cardTitle}>
                                <b>טווח זמנים</b>
                            </Typography>
                            <DatePick
                                value={new Date()}
                                onChange={() => {}}
                            />
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
                </Grid>
                <Grid item xs={3}>
                    <Card className={classes.unassignedCard}>
                        <CardContent className={classes.TimeRangeCardContent}>
                            <Typography>13 חקירות</Typography>
                            <Typography>ממתינות להקצאה</Typography>
                        </CardContent>
                        <CardActions>
                            <Button>
                                חקירות
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default LandingPage;
