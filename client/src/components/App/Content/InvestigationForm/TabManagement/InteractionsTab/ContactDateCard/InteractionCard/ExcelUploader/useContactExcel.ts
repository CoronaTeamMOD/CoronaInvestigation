import React from 'react';

import useExcel from 'Utils/vendor/useExcel';
import InteractedContact from 'models/InteractedContact';
import {isObjectEmpty} from 'Utils/vendor/underscoreReplacement';
import {booleanAnswers, ContactedPersonExcel, ContactedPersonFieldMapper} from 'models/enums/contactQuestioningExcelFields';

type ParseCallback = (data:InteractedContact[]) => void;
type FailCallback = (error?:Error|string) => void;

const useContactExcel = (parseCallback: ParseCallback, failCallback?: FailCallback) => {
    const [isWorkbookDate1904, setIsWorkbookDate1904] = React.useState<boolean>(false);
    const {read, sheet_to_json, fixIsraeliDate} = useExcel();

    const fixDateByWorkbook = React.useCallback(fixIsraeliDate(isWorkbookDate1904), [isWorkbookDate1904]);

    const parseBooleanAnswer = (value: string | undefined) => {
        switch (value) {
            case booleanAnswers.TRUE:
                return true;
            case booleanAnswers.FALSE:
                return false;
            default:
                return null;
        }
    };

    const parseIsolationField = (value: string | undefined) => value === 'המגע הונחה לשהות בבידוד';

    const constParsingFunctions: Partial<{[K in keyof ContactedPersonExcel]: any}> = {
        doesHaveBackgroundDiseases: parseBooleanAnswer,
        doesFeelGood: parseBooleanAnswer,
        repeatingOccuranceWithConfirmed: parseBooleanAnswer,
        doesWorkWithCrowd: parseBooleanAnswer,
        doesNeedHelpInIsolation: parseBooleanAnswer,
        doesLiveWithConfirmed: parseBooleanAnswer,
        doesNeedIsolation: parseIsolationField,
        birthDate: fixDateByWorkbook
    };

    const getEnglishNameByHebrew = (hebrewName: string): keyof ContactedPersonExcel | undefined =>
        (Object.keys(ContactedPersonFieldMapper) as (keyof typeof ContactedPersonFieldMapper)[])
        .find(englishName => ContactedPersonFieldMapper[englishName] === hebrewName);

    const parseRow = (row: ContactedPersonExcel) => {
        const parsedObj: InteractedContact | {} = {};
        (Object.keys(row) as (keyof ContactedPersonExcel)[])
            .forEach(hebrewColumnName => {
                const englishFieldName: keyof ContactedPersonExcel | undefined = getEnglishNameByHebrew(hebrewColumnName);
                if (!englishFieldName) return;
                const value = row[hebrewColumnName as keyof typeof row];
                const parsingFunc = constParsingFunctions[englishFieldName];
                (parsedObj as any)[englishFieldName] = parsingFunc ? parsingFunc(value) : value
            });

        return parsedObj as InteractedContact;
    };

    const parseContactsWorkbook = (isAsBinaryString: boolean) =>  (event: ProgressEvent<FileReader>) => {
        const fileData = event.target?.result;
        if(!fileData) return;

        try {
            const workbook = read(fileData, {type: isAsBinaryString ? 'binary' : 'array', cellDates:true});
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            setIsWorkbookDate1904 (!!(workbook?.Workbook?.WBProps?.date1904));
            const sheetJson = sheet_to_json<ContactedPersonExcel>(sheet);
            const parsedData = sheetJson.map(parseRow).filter(row => !isObjectEmpty(row));
            parseCallback(parsedData);
        } catch (e) {
            console.error('error reading or parsing file:', e);
            failCallback && failCallback(e);
            return;
        }
    };

    const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        if (!(input?.files)) return;

        const fileReader = new FileReader();
        const file = input.files[0];
        const isAsBinaryString = !!fileReader.readAsBinaryString;
        fileReader.onload = parseContactsWorkbook(isAsBinaryString);

        try {
            isAsBinaryString ? fileReader.readAsBinaryString(file) : fileReader.readAsArrayBuffer(file) ;
        } catch (e) {
            console.error('error loading file:', e);
            failCallback && failCallback(e);
        }
        event.target.value = '';
    };

    return {
        onFileSelect
    }
};

export default useContactExcel;
