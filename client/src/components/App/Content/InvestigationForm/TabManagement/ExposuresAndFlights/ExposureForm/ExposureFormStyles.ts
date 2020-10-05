import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    exposureForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    exposureContactNameFields: {
        '@media screen and (max-width: 1250px)': {
            marginLeft: '-30vw',
        },
        marginLeft: '-14vw',
    },
    exposureContactName: {
        marginLeft: '1vw',
    },
    exposureNameLabel: {
        marginRight: '-14vw',
    },
    exposureFields: {
        marginLeft: '-2.5vw',
    },
    exposureDate: {
        '@media screen and (max-width: 1250px)': {
            marginLeft: '-30vw',
        },
        marginLeft: '-12.5vw',
    },
    exposureAddress: {
        '@media screen and (min-width: 1220px)': {
            paddingRight: '51vw'
        },
        paddingRight: '22vw'
    },
    exposureInputAddress: {
        '@media screen and (max-width: 1250px)': {
            marginLeft: '-20vw',
        },
    }
});

export default useStyles;
