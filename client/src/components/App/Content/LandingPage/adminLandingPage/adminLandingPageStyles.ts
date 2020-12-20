import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { primaryBackgroundColor } from 'styles/theme';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: '5vh 3vw',
        height: '93.5vh',
        backgroundColor: primaryBackgroundColor,
    },
    desksCard: {
        width: '15vw',
        height: '30vh',
        borderRadius: '1vw',
    },
    timeRangeCard: {
        width: '15vw',
        height: '17vh',
        borderRadius: '1vw',
    },
    unassignedCard: {
        width: '14vw',
        height: '15vh',
        borderRadius: '1vw',
    },
    cardTitle: {
        fontSize: '0.9vw',
    },
    desksCardContent: {
        height: '72%',
    },
    TimeRangeCardContent: {
        height: '52%',
    },
    updateButton: {
        width: '4vw',
        color: 'white',
        backgroundColor: theme.palette.primary.dark
    }
}));

export default useStyles;
