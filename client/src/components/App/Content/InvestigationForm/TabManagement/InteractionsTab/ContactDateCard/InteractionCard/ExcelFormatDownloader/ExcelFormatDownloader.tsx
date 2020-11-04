import React from 'react';
import { Button, Typography } from '@material-ui/core';

import useStyle from './ExcelFormatDownloaderStyles'

const ExcelFormatDownloader: React.FC = (): JSX.Element => {

    const classes = useStyle();

    const EXCEL_FORMAL_LOCATION = './assets/contactFormat.xlsx';

    return (
        <Button className={classes.downloadButton} href={EXCEL_FORMAL_LOCATION}>
            <img src='./assets/img/downloadExcel.png' className={classes.logo} alt='excel downloader' />
            <Typography className={classes.downloadText}>
                הורד פורמט
            </Typography>
        </Button>
    )
}

export default ExcelFormatDownloader;