import React from 'react';
import { useSelector } from 'react-redux';
import {ChevronLeft} from '@material-ui/icons';
import {useFormContext} from 'react-hook-form';
import {Button, Tooltip} from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import GreenPassQuestion from 'models/GreenPassQuestion';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventDialogFields from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';

const cantMoveToContactsBaseMessage = 'לא ניתן לעבור ליצירת מגעים ';

interface ContinueToTabBaseType {
    canContinue: boolean;
};

interface ContinueToTabOK extends ContinueToTabBaseType {
    canContinue: true;
};

interface ContinueToTabError extends ContinueToTabBaseType {
    canContinue: false;
    message: string;
};

const InteractionFormTabSwitchButton = ({isAddingContacts, setIsAddingContacts, isNewInteraction}: any) => {

    const {errors, watch, trigger} = useFormContext();
    
    const greenPassQuestions = useSelector<StoreStateType, GreenPassQuestion[]>(state => state.greenPassQuestions);
    const greenPassFields = greenPassQuestions.map((greenPassQuestion) => `${InteractionEventDialogFields.IS_GREEN_PASS}-${greenPassQuestion.id}`);

    const placeType = watch(InteractionEventDialogFields.PLACE_TYPE);
    const isEventRepetitive = watch(InteractionEventDialogFields.IS_REPETITIVE);
    const isGreenPass = watch(greenPassFields);

    const placeTypeErrors = get(errors, InteractionEventDialogFields.PLACE_TYPE);
    const placeSubTypeErrors = get(errors, InteractionEventDialogFields.PLACE_SUB_TYPE);

    const hebrewActionName = isNewInteraction ? 'יצירת' : 'עריכת';

    const continueToContactsTabAbility: (ContinueToTabOK | ContinueToTabError) = React.useMemo(() => {
        console.log(isGreenPass, placeType);
        if (Boolean(placeTypeErrors) || Boolean(placeSubTypeErrors)) {
            return {canContinue: false, message: cantMoveToContactsBaseMessage.concat('מבלי להזין סוג אתר/תת סוג')};
        }

        if (isNewInteraction && isEventRepetitive) {
            return {canContinue: false, message: cantMoveToContactsBaseMessage.concat('באירוע מחזורי')};
        }

        if (placeType !== placeTypesCodesHierarchy.privateHouse.code && Object.values(isGreenPass).some((answer) => answer === undefined)) {
            return {canContinue: false, message: cantMoveToContactsBaseMessage.concat('מבלי לענות על כל השאלות')};
        }

        return {canContinue: true}
    }, [isEventRepetitive, placeTypeErrors, placeSubTypeErrors, isGreenPass]);

    const onContinueTabClick = async () => {
        await trigger();
        continueToContactsTabAbility.canContinue && setIsAddingContacts(!isAddingContacts)
    };

    return (
        <Tooltip title={continueToContactsTabAbility.canContinue ? '' : continueToContactsTabAbility.message}>
            <div>
                <Button disabled={!continueToContactsTabAbility.canContinue}
                        variant='text' color='primary'
                        endIcon={<ChevronLeft/>}
                        onClick={onContinueTabClick}>
                    <b>{isAddingContacts ? `חזרה ל${hebrewActionName} מקום` : `המשך ל${hebrewActionName} מגעים`}</b>
                </Button>
            </div>
        </Tooltip>
    );
};

export default InteractionFormTabSwitchButton;