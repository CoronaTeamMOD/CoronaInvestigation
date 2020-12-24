import React from 'react';
import { Tab, Tabs, Box, withStyles, createStyles } from '@material-ui/core';

import Desk from 'models/Desk';
import County from 'models/County';

import TransferInvestigationDesk from './TransferInvestigationDesk';
import TransferInvestigationCounty from './TransferInvestigationCounty';

const StyledTab = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: theme.typography.fontWeightRegular,
        },
        wrapper: {
            flexDirection: 'row-reverse',
        }
    }),
)(Tab);

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const TransferInvestigationTabs = (props: Props) => {

    const { allDesks, allCounties, onClose, onDeskTransfer, onCountyTransfer } = props;

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs
                indicatorColor='primary'
                value={value}
                onChange={handleChange}
            >
                <StyledTab
                    label='בין נפות'
                />
                <StyledTab
                    label='בין דסקים'
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <TransferInvestigationCounty
                    onConfirm={onCountyTransfer}
                    onClose={onClose}
                    allCounties={allCounties}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TransferInvestigationDesk
                    onConfirm={onDeskTransfer}
                    onClose={onClose}
                    allDesks={allDesks}
                />
            </TabPanel>
        </div>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface Props {
    open: boolean;
    allDesks: Desk[];
    allCounties: County[];
    onClose: () => void;
    onDeskTransfer: (updatedDesk: Desk, transferReason: string) => void;
    onCountyTransfer: (updatedCounty: County, transferReason: string) => void;
}

export default TransferInvestigationTabs;