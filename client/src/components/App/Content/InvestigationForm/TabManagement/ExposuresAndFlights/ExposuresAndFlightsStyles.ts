import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    subForm: {
        padding: '3vh 1.5vw 3vw 3vh'
    },
    additionalInformationForm: {
        '@media screen and (min-width: 1220px)': {
            flip: false
        },
    },
    contactToggle: {
        '@media screen and (max-width: 1900px) and (min-width: 1280px)': {
            marginLeft: '-9%',
        },
        marginLeft: '-13%',
    },
    abroadToggle: {
        marginLeft: '-17%',
    },
    anotherExposureContainer: {
        maxWidth: '100vw',
        display: 'flex',
        marginTop: '45px',
    },
    anotherExposureTitle: {
        fontSize: '16px',
        fontWeight: 500,
        padding: '12px',
        margin: '10px 15px 10px 0',
        flexGrow: 0,
        maxWidth: '25%',
        flexBasis: '25%',
        boxSizing: 'border-box',
        display: 'flex',
    },
    anotherExposureToggle: {
        display: 'block'
    }
});

export default useStyles;
