import {makeStyles} from '@material-ui/styles';

export const useStyles = makeStyles({
    form: {
        padding: '2vh',
    },
    rowGridItem: {
        display: 'flex',
        flexDirection: 'row',
    },
    containerGrid: {
        maxWidth: '100vw',
        height: '9vh'
    },
    fieldLabel: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-6vw',
        },
        marginRight: '-2vw',
    },
    hospitalLabel: {
        marginRight: '1vw',
    },
    backgroundDiseasesLabel: {
        '@media screen and (max-width: 950px)': {
            marginTop: '3vh'
        },
    },
    dates: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        marginBottom: '0.5vw',
        alignItems: 'center',
    },
    hospitalizationDates: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '10vw',
    },
    smallGrid: {
        width: '60vw'
    },
    isolationProblemTextField: {
        marginLeft: '1vw',
        width: '15vw',
    },
    cancelWhiteSpace: {
        marginLeft: '-4vw',
        '@media screen and (max-width: 1750px)': {
            marginLeft: '-2vw'
        },
    },
    otherTextField: {
        marginTop: '1vh',
        marginLeft: '-15vw',
    },
    symptomsDateCheckBox: {
        marginTop: '1vh',
        marginLeft: '1vw',
    },
    spacedDates: {
        marginRight: '1vw',
    },
    verticalSpacing: {
        marginBottom: '1vh',
    },
    hospitalInput: {
      marginLeft: '6vw',
    },
    symptomsAndDiseasesCheckbox: {
        'media screen and (max-width: 1500px)': {
            marginRight: '-1vw'
        },
        'media screen and (min-width: 1500px)': {
            marginRight: '-5vw'
        },
    },
});