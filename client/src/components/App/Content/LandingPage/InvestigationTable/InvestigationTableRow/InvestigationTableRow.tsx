import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import StoreStateType from 'redux/storeStateType';
import React, { MutableRefObject, useMemo } from 'react';
import { Box, Checkbox, IconButton, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core';
import { Call, KeyboardArrowDown, KeyboardArrowLeft, Person, Visibility, Comment } from '@material-ui/icons';

import Desk from 'models/Desk';
import User from 'models/User';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import formatDate from 'Utils/DateUtils/formatDate';
import InvestigationTableRowType from 'models/InvestigationTableRow';

import CommentCell from './CommentCell/CommentCell';
import useStyles from './InvestigationTableRowStyles';
import { useTooltipStyles } from '../InvestigationTableStyles';
import SettingsActions from '../SettingsActions/SettingsActions';
import ClickableTooltip from '../clickableTooltip/clickableTooltip';
import InfoItem from '../../../InvestigationForm/InvestigationInfo/InfoItem';
import { IndexedInvestigationData, TableHeadersNames } from '../InvestigationTablesHeaders';
import InvestigatorAllocationCell from '../InvestigatorAllocation/InvestigatorAllocationCell';
import InvestigationStatusColumn from '../InvestigationStatusColumn/InvestigationStatusColumn';
import InvestigationIndicatorsColumn from '../InvestigationIndicatorsColumn/InvestigationIndicatorsColumn';
import BotProperties from 'models/enums/BotProperties';

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

    const creationDateLabel = useMemo(() => formatDate(creationDate), [creationDate]);
    const startTimeLabel = useMemo(() => formatDate(startTime), [startTime]);

    const title = (creationDate || startTime)
        ? <>
            {<InfoItem size='small' name='הגעת החקירה' value={creationDateLabel} />}
            {<InfoItem size='small' name='תחילת החקירה' value={startTimeLabel} />}
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
    complexityReasonsId: (number | null)[];
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
    onSetViewMode?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const unassignedToDesk = 'לא שוייך לדסק';
const showInvestigationGroupText = 'הצג חקירות קשורות';
const hideInvestigationGroupText = 'הסתר חקירות קשורות';

const InvestigationTableRow = ({
    complexityReasonsId,
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
    onCellClick,
    onSetViewMode
}: Props) => {
    const classes = useStyles();
    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const getInvestigatorReferenceRequiredTooltip = (row: InvestigationTableRowType) => {
        let msg = 'נדרשת התייחסות חוקר בגין: '
        if (row.investigatorReferenceReasons) {
            row.investigatorReferenceReasons.forEach(reason => {
                msg += reason.displayName + " ,";
            });
            msg = msg.slice(0, -1);
        }
        return msg;
    }

    const getBotTableCell = (lastUpdatorUser: string, value: string) => {
        return (
            <span className={lastUpdatorUser == BotProperties.BOT_USER ? `${classes.botActive}` : `${classes.botInactive}`}>
                {value}
            </span>
        );
    }

    const getTableCell = (cellName: string) => {
        const wasInvestigationFetchedByGroup = indexedRow.groupId && !indexedRow.canFetchGroup;
        switch (cellName) {
            case TableHeadersNames.color:
                return (
                    Boolean(indexedRow.groupId) ?
                        <Tooltip arrow placement='top' title={indexedRow.otherReason !== null && indexedRow.otherReason !== '' && indexedRow.otherReason !== ' ' ? indexedRow.otherReason : indexedRow.groupReason}>
                            <div className={classes.groupColor}
                                style={{ backgroundColor: groupColor }}
                            />
                        </Tooltip> : null
                )
            case TableHeadersNames.rowIndicators:
                return (
                    <div style={{ display: "flex" }}>
                        <ClickableTooltip disabled={disabled} value={indexedRow.phoneNumber}
                            defaultValue='' scrollableRef={tableContainerRef.current} InputIcon={Call} />
                        <InvestigationIndicatorsColumn
                            isComplex={indexedRow.isComplex}
                            complexityReasonsId={row.complexityReasonsId}
                            wasInvestigationTransferred={indexedRow.wasInvestigationTransferred}
                            transferReason={indexedRow.transferReason}
                            isSelfInvestigated={indexedRow.isSelfInvestigated}
                            selfInvestigationStatus={indexedRow.selfInvestigationStatus}
                            selfInvestigationUpdateTime={new Date(indexedRow.selfInvestigationUpdateTime)}
                            isInInstitute={row.isInInstitute}
                            instituteName={indexedRow.subOccupation}
                        />
                    </div>
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
                    (user.userType === UserTypeCodes.ADMIN || user.userType === UserTypeCodes.SUPER_ADMIN) && !wasInvestigationFetchedByGroup) {
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
                return (
                    <ClickableTooltip disabled={disabled} value={indexedRow.comment}
                        defaultValue='' scrollableRef={tableContainerRef.current} InputIcon={Comment} />
                )

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
                        {(!wasInvestigationFetchedByGroup) && user.userType !== UserTypeCodes.INVESTIGATOR &&
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
                        <Tooltip title='צפייה בלבד' placement='top' arrow>
                            <IconButton color='primary' onClick={onSetViewMode}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
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
                return indexedRow[cellName as keyof typeof TableHeadersNames] ?? '-';
            case TableHeadersNames.investigatiorReferenceRequired:
                return (
                    <Box flex={1} marginX={0.5}>
                        {
                            indexedRow.investigatiorReferenceRequired &&
                            <Tooltip title={getInvestigatorReferenceRequiredTooltip(row)} placement='top' arrow>
                                <Person color={(row.lastUpdatorUser == BotProperties.BOT_USER) ? 'primary' : 'disabled'} />
                            </Tooltip>
                        }
                    </Box>
                )
            case TableHeadersNames.chatStatus:
                return getBotTableCell(row.lastUpdatorUser, indexedRow[cellName as keyof typeof TableHeadersNames])
            case TableHeadersNames.lastChatDate:
                return getBotTableCell(row.lastUpdatorUser, indexedRow[cellName as keyof typeof TableHeadersNames])
            case TableHeadersNames.investigatorReferenceStatus:
                return getBotTableCell(row.lastUpdatorUser, indexedRow[cellName as keyof typeof TableHeadersNames])
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
        </RowTooltip >
    )
}

export default InvestigationTableRow;