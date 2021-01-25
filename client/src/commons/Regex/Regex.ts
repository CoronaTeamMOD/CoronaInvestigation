export const TRANSFER_REASON_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/;

export const ALPHBET_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s]*$/;
//client\src\commons\AlphabetTextField\AlphabetTextField.tsx

export const ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-]*$/;
//client\src\commons\AlphabetTextField\ExposureSearchTextField.tsx

export const ALPHBET_DASH_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe-\s]*$/;
//client\src\commons\AlphabetWithDashTextField\AlphabetWithDashTextField.tsx

export const ALPHANUMERIC_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe0-9\s]*$/;
//client\src\commons\AlphanumericTextField\AlphanumericTextField.tsx

export const FLIGHT_NUMBER_REGEX = /^[a-zA-Z0-9-\s//\\]*$/;
//client\src\commons\FlightNumberTextField\FlightNumberTextField.tsx

export const HEBREW_TEXT_REGEX = /^[\u0590-\u05fe\s]*$/;
//client\src\commons\HebrewTextField\HebrewTextField.tsx

export const NUMERIC_TEXT_REGEX = /^[0-9]*$/;
//client\src\commons\NumericTextField\NumericTextField.tsx

const excludeSpecialCharsRegex = /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/;
//client\src\components\App\Content\InvestigationForm\InvestigationInfo\InvestigatedPersonInfo\InvestigatedPersonInfo.tsx

export const phoneNumberRegex = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/;
export const notRequiredPhoneNumberRegex = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$|^$/;
export const mailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts