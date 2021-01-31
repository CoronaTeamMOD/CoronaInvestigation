import { Typography } from '@material-ui/core'
import React from 'react'

interface Props {
    selectedRows: number
}

const SelectedRowsMessage = (props: Props) => {
    const { selectedRows } = props;
    
    return (
        <Typography variant='h6' align='right'>
            {`${selectedRows} שורות נבחרו`}
        </Typography>
    )
}

export default SelectedRowsMessage
