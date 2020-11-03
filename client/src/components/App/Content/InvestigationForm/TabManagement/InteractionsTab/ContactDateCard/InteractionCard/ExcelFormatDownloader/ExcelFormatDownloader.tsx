import React from 'react';
import { Button, Typography, useMediaQuery } from '@material-ui/core';

import useStyle from './ExcelFormatDownloaderStyles'

const ExcelFormatDownloader: React.FC = (): JSX.Element => {

    const classes = useStyle();
    const isScreenWide = useMediaQuery('(min-width: 1680px)');

    return (
        <Button className={[classes.button, isScreenWide ? classes.wideScreenButton : classes.smallScreenButton].join(' ')} href='./assets/contactFormat.xlsx'>
            <img src='./assets/img/downloadExcel.png' className={classes.logo} alt='excel downloader' />
            <Typography>
                הורד פורמט
            </Typography>
        </Button>
    )
}

export default ExcelFormatDownloader;