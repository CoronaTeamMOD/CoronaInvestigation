import React from 'react';
import {Divider, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography} from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Danger from '@material-ui/icons/ReportProblem';

import FilterRulesVariables from 'models/FilterRulesVariables';
import statusToFilterConvertor from 'commons/statusToFilterConvertor';
import FilterRulesDescription from 'models/enums/FilterRulesDescription';

import useStyles from '../useDashboardStyles';
import LoadingCard from '../../LoadingCard/LoadingCard';


const UnusualInvestigationsCard: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles();
    const {onClick, isLoading, unallocatedInvestigationsCount} = props;

    return (
            <LoadingCard isLoading={isLoading} width='12vw' height='25vh'>
                <div className={classes.cardTitle}>
                    {/*<Typography ><b>{unallocatedInvestigationsCount}</b></Typography>*/}
                    <Danger className={classes.red} fontSize='large'/>
                    <Typography className={classes.mediumText}><b>לתשומת ליבך</b></Typography>
                </div>
                <List component="nav">
                    <ListItem disableGutters button>
                        <Typography variant='body1' className={classes.mediumText}>23</Typography>
                        <ListItemText primary="חקירות הושלמו עם 0 מגעים"/>
                        <NavigateBeforeIcon className={classes.navigateIcon}/>
                    </ListItem>
                    <Divider/>
                    <ListItem disableGutters button>
                        <Typography variant='body1' className={classes.mediumText}>23</Typography>
                        <ListItemText primary="חקירות בטיפול מעל 4 שעות"/>
                        <NavigateBeforeIcon className={classes.navigateIcon}/>
                    </ListItem>
                </List>
            </LoadingCard>
    )
}

export default UnusualInvestigationsCard;

interface Props {
    onClick: (infoFilter: FilterRulesVariables) => void;
    isLoading: boolean;
    unallocatedInvestigationsCount: number;
}
