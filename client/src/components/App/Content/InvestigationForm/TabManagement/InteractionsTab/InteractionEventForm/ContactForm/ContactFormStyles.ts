import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    addContactFields: {
        height: '14vh',
        width: '97%',
        '@media screen and (max-height: 900px)': {
            marginBottom: '3vh',
        }
    },
    newContactField: {
        '@media screen and (min-width: 1870px)': {
            width: '15vw',
            marginLeft: '-3.5vw',
        },
    },
    contactAdditionalDetails: {
        '@media screen and (min-width: 1870px)': {
            marginRight: '-3vw',
        },
    },
    additionalInfoItem: {
      paddingRight: '10vw'
    },
    moreContactDetails: {
        width: '40vw',
        margin: '1vh',
    }
});

export default useStyles;