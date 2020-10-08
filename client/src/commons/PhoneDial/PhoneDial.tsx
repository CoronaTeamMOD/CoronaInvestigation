import React from 'react';
import { Phone } from '@material-ui/icons';
import { Tooltip, IconButton } from '@material-ui/core';

const callContact = 'חייג';
const noExistingPhoneNumber = 'טלפון לא קיים';

const PhoneDial: React.FC<Props> = (props: Props): JSX.Element => {

    const { phoneNumber } = props;

    return (
        <Tooltip title={phoneNumber !== null ? callContact : noExistingPhoneNumber}>
            <span>
                <IconButton
                    color='primary'
                    disabled={Boolean(!phoneNumber)}
                    href={`TEL:${phoneNumber}`}
                >
                    <Phone />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default PhoneDial;

interface Props {
    phoneNumber?: string;
};
