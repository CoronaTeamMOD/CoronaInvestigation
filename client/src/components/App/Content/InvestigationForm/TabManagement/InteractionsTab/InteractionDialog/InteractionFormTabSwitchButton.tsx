import React from 'react';
import {useFormContext} from 'react-hook-form';
import {Button, Tooltip} from '@material-ui/core';
import {ChevronLeft} from '@material-ui/icons';
import InteractionEventDialogFields
    from 'models/enums/InteractionsEventDialogContext/InteractionEventDialogFields';
import {get} from 'Utils/auxiliaryFunctions/auxiliaryFunctions';

const cantMoveToContactsBaseMessage = 'לא ניתן לעבור ליצירת מגעים ';

interface ContinueToTabBaseType {
    canContinue: boolean;
}

interface ContinueToTabOK extends ContinueToTabBaseType {
    canContinue: true;
}

interface ContinueToTabError extends ContinueToTabBaseType {
    canContinue: false;
    message: string;
}

const InteractionFormTabSwitchButton = ({isAddingContacts, setIsAddingContacts, isNewInteraction}: any) => {
    const {errors, watch, trigger} = useFormContext();
    const isEventRepetitive = watch(InteractionEventDialogFields.IS_REPETITIVE);
    const placeTypeErrors = get(errors, InteractionEventDialogFields.PLACE_TYPE);
    const placeSubTypeErrors = get(errors, InteractionEventDialogFields.PLACE_SUB_TYPE);

    const hebrewActionName = isNewInteraction ? 'יצירת' : 'עריכת';

    const continueToContactsTabAbility: (ContinueToTabOK | ContinueToTabError) = React.useMemo(() => {
        if (Boolean(placeTypeErrors) || Boolean(placeSubTypeErrors)) {
            return {canContinue: false, message: cantMoveToContactsBaseMessage.concat('מבלי להזין סוג אתר/תת סוג')};
        }

        if (isNewInteraction && isEventRepetitive) {
            return {canContinue: false, message: cantMoveToContactsBaseMessage.concat('באירוע מחזורי')};
        }

        return {canContinue: true}
    }, [isEventRepetitive, placeTypeErrors, placeSubTypeErrors]);

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