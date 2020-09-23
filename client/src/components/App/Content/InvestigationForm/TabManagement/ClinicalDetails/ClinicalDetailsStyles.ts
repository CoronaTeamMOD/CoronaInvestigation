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
    },
    smallGrid: {
        width: '40vw'
    },
    floorHouseNumTextField: {
        marginLeft: '1vw',
        width: '9vw'
    },
    cityStreetTextField: {
        marginLeft: '1vw',
        width: '20vw'
    },
    isolationProblemTextField: {
        marginLeft: '1vw',
        width: '15vw',
    },
    cancelWhiteSpace: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-4vw'
        }
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
    hospitalizedDates: {
        '@media screen and (min-width: 1870px)': {
            width: '14vw',
        },
        width: '26vw',
    },
    symptomsAndDiseasesCheckbox: {
        'media screen and (max-width: 1500px)': {
            marginRight: '-1vw'
        },
        'media screen and (min-width: 1500px)': {
            marginRight: '-5vw'
        },
    }
});
