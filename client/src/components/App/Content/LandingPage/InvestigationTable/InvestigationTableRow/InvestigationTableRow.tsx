import React, { MutableRefObject, useMemo } from 'react'
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import StoreStateType from 'redux/storeStateType';
import { Call, Comment, KeyboardArrowDown, KeyboardArrowLeft } from '@material-ui/icons';
import { Checkbox, IconButton, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core';

import Desk from 'models/Desk';
import User from 'models/User';
import UserType from 'models/enums/UserType';
import InvestigationTableRowType from 'models/InvestigationTableRow';

import useStyles from './InvestigationTableRowStyles';
import { useTooltipStyles } from '../InvestigationTableStyles';
import SettingsActions from '../SettingsActions/SettingsActions';
import ClickableTooltip from '../clickableTooltip/clickableTooltip';
import InfoItem from '../../../InvestigationForm/InvestigationInfo/InfoItem';
import { IndexedInvestigationData, TableHeadersNames } from '../InvestigationTablesHeaders';
import InvestigatorAllocationCell from '../InvestigatorAllocation/InvestigatorAllocationCell';
import InvestigationStatusColumn from '../InvestigationStatusColumn/InvestigationStatusColumn';
import InvestigationIndicatorsColumn from '../InvestigationIndicatorsColumn/InvestigationIndicatorsColumn';

interface RowTooltipProps {
    titleOverride?: string;
    creationDate: InvestigationTableRowType['creationDate'];
    startTime: InvestigationTableRowType['startTime'];
    children: React.ReactElement;
}

const noDataMessage = 'אין מידע אודות תאריכים לחקירה זו';
const tooltipEnterDelay = 800;
const RowTooltip = (props: RowTooltipProps) => {
    const { creationDate, startTime, titleOverride } = props;
    const tooltipClasses = useTooltipStyles();

    const formatDate = (date: Date): string => date ? format(new Date(date), 'dd/MM/yyyy') : 'אין מידע';
    const creationDateLabel = useMemo(() => formatDate(creationDate), [creationDate]);
    const startTimeLabel = useMemo(() => formatDate(startTime), [startTime]);

    const title = (creationDate || startTime)
        ? <>
            {<InfoItem size='small' name='תאריך הגעת החקירה' value={creationDateLabel} />}
            {<InfoItem size='small' name='תאריך תחילת החקירה' value={startTimeLabel} />}
        </>
        : noDataMessage;

    return <Tooltip title={titleOverride ? titleOverride : title} enterDelay={tooltipEnterDelay} enterNextDelay={tooltipEnterDelay}
        classes={{ tooltip: tooltipClasses.content }}
        PopperProps={{
            placement: 'right',
            modifiers: {
                inner: { enabled: true },
            },
        }}>
        {props.children}
    </Tooltip>
};

interface Props {
    columns: string[];
    groupColor?: string;
    selected: boolean;
    deskAutoCompleteClicked: boolean;
    checked: boolean;
    clickable: boolean;
    disabled?: boolean;
    desks: Desk[];
    indexedRow: { [T in keyof typeof TableHeadersNames]: any };
    row: InvestigationTableRowType;
    isGroupShown: boolean;
    tableContainerRef: MutableRefObject<HTMLElement | undefined>;
    allGroupedInvestigations: Map<string, InvestigationTableRowType[]>;
    checkGroupedInvestigationOpen: number[];
    fetchTableData: () => void;
    fetchInvestigationsByGroupId: (groupId: string) => Promise<InvestigationTableRowType[]>;
    moveToTheInvestigationForm: (epidemiologyNumberVal: number) => void;
    tableCellStyleFunction: (cellKey: string) => string[];
    onInvestigationDeskChange: (event: React.ChangeEvent<{}>, newSelectedDesk: Desk | null) => void;
    onMultiCheckClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onGroupExpandClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onInvestigationRowClick: (indexedRow: { [T in keyof IndexedInvestigationData]: any }) => void;
    onCellClick: (event: any, key: string, epidemiologyNumber: any, groupId: any) => void;
}

const unassignedToDesk = 'לא שוייך לדסק';
const showInvestigationGroupText = 'הצג חקירות קשורות';
const hideInvestigationGroupText = 'הסתר חקירות קשורות';

const InvestigationTableRow = ({
    columns,
    groupColor,
    selected,
    deskAutoCompleteClicked,
    desks,
    indexedRow,
    row,
    isGroupShown,
    checked,
    clickable,
    disabled = false,
    tableContainerRef,
    allGroupedInvestigations,
    checkGroupedInvestigationOpen,
    fetchTableData,
    fetchInvestigationsByGroupId,
    moveToTheInvestigationForm,
    tableCellStyleFunction,
    onInvestigationDeskChange,
    onMultiCheckClick,
    onGroupExpandClick,
    onInvestigationRowClick,
    onCellClick
}: Props) => {
    const classes = useStyles();
    const user = useSelector<StoreStateType, User>(state => state.user.data);

    const getTableCell = (cellName: string) => {
        const wasInvestigationFetchedByGroup = indexedRow.groupId && !indexedRow.canFetchGroup;
        switch (cellName) {
            case TableHeadersNames.color:
                return (
                    Boolean(indexedRow.groupId) ?
                        <Tooltip arrow placement='top' title={indexedRow.otherReason !== '' ? indexedRow.otherReason : indexedRow.groupReason}>
                            <div className={classes.groupColor}
                                style={{ backgroundColor: groupColor }}
                            />
                        </Tooltip> : null
                )
            case TableHeadersNames.rowIndicators:
                return (
                    <InvestigationIndicatorsColumn 
                        isComplex={indexedRow.isComplex}
                        wasInvestigationTransferred={indexedRow.wasInvestigationTransferred}
                        transferReason={indexedRow.transferReason}
                        isSelfInvestigated={indexedRow.isSelfInvestigated}
                        selfInvestigationStatus={indexedRow.selfInvestigationStatus}
                        selfInvestigationUpdateTime={new Date(indexedRow.selfInvestigationUpdateTime)}
                    />
                );
            case TableHeadersNames.investigatorName:
                return (
                    <InvestigatorAllocationCell
                        investigatorName={indexedRow[cellName as keyof typeof TableHeadersNames]}
                        isInvestigatorActive={row.investigator?.isActive}
                        disabled={disabled}
                    />
                )
            case TableHeadersNames.investigationDesk:
                if (selected && deskAutoCompleteClicked && !disabled &&
                    (user.userType === UserType.ADMIN || user.userType === UserType.SUPER_ADMIN) && !wasInvestigationFetchedByGroup) {
                    return (
                        <Autocomplete
                            options={desks}
                            getOptionLabel={(option) => option.deskName}
                            onChange={onInvestigationDeskChange}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder='דסק'
                                />
                            }
                            renderTags={(tags) => {
                                const additionalTagsAmount = tags.length - 1;
                                const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                                return tags[0] + additionalDisplay;
                            }}
                        />
                    )
                }
                else {
                    const deskValue = indexedRow[cellName as keyof typeof TableHeadersNames];
                    return deskValue ? deskValue : unassignedToDesk
                }
            case TableHeadersNames.subOccupation:
                const subOccupation = row.isInInstitute && indexedRow[cellName as keyof typeof TableHeadersNames];
                const parentOccupation = Boolean(subOccupation) ? row.parentOccupation : '';
                return <Tooltip title={parentOccupation} placement='top'>
                    <div>{subOccupation || '-'}</div>
                </Tooltip>
            case TableHeadersNames.comment:
                return <ClickableTooltip disabled={disabled} value={indexedRow[cellName as keyof typeof TableHeadersNames]}
                    defaultValue='אין הערה' scrollableRef={tableContainerRef.current} InputIcon={Comment} />

            case TableHeadersNames.phoneNumber:
                return <ClickableTooltip disabled={disabled} value={indexedRow[cellName as keyof typeof TableHeadersNames]}
                    defaultValue='' scrollableRef={tableContainerRef.current} InputIcon={Call} />
            case TableHeadersNames.investigationStatus:
                const investigationStatus = indexedRow[cellName as keyof typeof TableHeadersNames];
                return investigationStatus && <InvestigationStatusColumn
                    investigationStatus={investigationStatus}
                    investigationSubStatus={indexedRow.investigationSubStatus}
                    statusReason={indexedRow.statusReason}
                />;
            case TableHeadersNames.multipleCheck:
                return (
                    <>
                        {(!wasInvestigationFetchedByGroup) &&
                            <Checkbox onClick={onMultiCheckClick} color='primary' checked={checked} size='small'
                                className={indexedRow.groupId ? '' : classes.padCheckboxWithoutGroup} />}
                        {indexedRow.canFetchGroup &&
                            <Tooltip title={isGroupShown ? hideInvestigationGroupText : showInvestigationGroupText} placement='top' arrow>
                                <IconButton onClick={onGroupExpandClick}>
                                    {isGroupShown ?
                                        <KeyboardArrowDown /> :
                                        <KeyboardArrowLeft />}
                                </IconButton>
                            </Tooltip>
                        }
                    </>
                )
            case TableHeadersNames.settings:
                return (
                    !disabled &&
                    <SettingsActions
                        epidemiologyNumber={indexedRow.epidemiologyNumber}
                        investigationStatus={indexedRow.investigationStatus}
                        groupId={indexedRow.groupId}
                        allGroupedInvestigations={allGroupedInvestigations}
                        checkGroupedInvestigationOpen={checkGroupedInvestigationOpen}
                        fetchTableData={fetchTableData}
                        fetchInvestigationsByGroupId={fetchInvestigationsByGroupId}
                        moveToTheInvestigationForm={moveToTheInvestigationForm}
                    />
                );
            case TableHeadersNames.age:
                return indexedRow[cellName as keyof typeof TableHeadersNames] || '-';
            default:
                return indexedRow[cellName as keyof typeof TableHeadersNames];
        }
    }

    return (
        <RowTooltip
            creationDate={row.creationDate}
            startTime={row.startTime}
            titleOverride={disabled ? `חקירה של נפת ${row.county.displayName}` : ''}
        >
            <TableRow
                selected={checked}
                key={indexedRow.epidemiologyNumber}
                classes={{ selected: classes.checkedRow }}
                className={`${classes.investigationRow} ${clickable && classes.clickableInvestigationRow} ${disabled && classes.disabled}`}
                onClick={() => clickable && !disabled && onInvestigationRowClick(indexedRow as { [T in keyof IndexedInvestigationData]: any })}
            >
                {
                    Object.values(columns).map((key: string) => (
                        <TableCell
                            classes={{ root: classes.tableCellRoot }}
                            className={tableCellStyleFunction(key).join(' ')}
                            onClick={(event: any) => !disabled && onCellClick(event, key, indexedRow.epidemiologyNumber, indexedRow.groupId)}
                        >
                            {
                                getTableCell(key)
                            }
                        </TableCell>
                    ))
                }
            </TableRow>
        </RowTooltip>
    )
}

export default InvestigationTableRow;