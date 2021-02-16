import { Typography } from '@material-ui/core'
import React from 'react'

interface Props {
    selectedRows: number
}

const SelectedRowsMessage = (props: Props) => {
    const { selectedRows } = props;
    
    return (
        <Typography variant='h6' align='right'>
            {`נבחרו ${selectedRows} מגעים משותפים מהמאומת`}
        </Typography>
    )
}

export default SelectedRowsMessage
