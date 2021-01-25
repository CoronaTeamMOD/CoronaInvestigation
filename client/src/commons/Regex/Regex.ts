
export const ALPHBET_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s]*$/;
//client\src\commons\AlphabetTextField\AlphabetTextField.tsx

export const ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-]*$/;
//client\src\commons\AlphabetTextField\ExposureSearchTextField.tsx
//client\src\components\App\Content\InvestigationForm\TabManagement\ExposuresAndFlights\Forms\ExposureForm\ExposureSearchTextField\ExposureSearchTextField.tsx

export const ALPHBET_DASH_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe-\s]*$/;
//client\src\commons\AlphabetWithDashTextField\AlphabetWithDashTextField.tsx

export const ALPHANUMERIC_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe0-9\s]*$/;
//client\src\commons\AlphanumericTextField\AlphanumericTextField.tsx
//client\src\components\App\Content\InvestigationForm\TabManagement\ContactQuestioning\ContactSection\Schemas\contactQuestioningClinical.ts

export const FLIGHT_NUMBER_REGEX = /^[a-zA-Z0-9-\s//\\]*$/;
//client\src\commons\FlightNumberTextField\FlightNumberTextField.tsx

export const HEBREW_TEXT_REGEX = /^[\u0590-\u05fe\s]*$/;
//client\src\commons\HebrewTextField\HebrewTextField.tsx

export const NUMERIC_TEXT_REGEX = /^[0-9]*$/;
//client\src\commons\NumericTextField\NumericTextField.tsx

export const ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/;
//client\src\components\App\Content\InvestigationForm\InvestigationInfo\InvestigatedPersonInfo\InvestigatedPersonInfo.tsx
//client\src\components\App\Content\InvestigationForm\InvestigationInfo\InvestigatedPersonInfo\InvestigationMenu\CommentDialog\CommentInput.tsx
//client\src\components\App\Content\LandingPage\InvestigationTable\InvestigationTableFooter\GroupedInvestigations\GroupedInvestigationsForm\GroupedInvestigationsSchema.ts
export const TRANSFER_REASON_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/;
//client\src\components\App\Content\LandingPage\InvestigationTable\InvestigationTableFooter\TransferInvestigationsDialogs\TransferInvestigationCountySchema.ts



export const PHONE_NUMBER_REGEX = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts

export const NOR_REQUIRED_PHONE_NUMBER_REGEX = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$|^$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts
//client\src\components\App\Content\InvestigationForm\TabManagement\InteractionsTab\InteractionDialog\InteractionEventForm\InteractionSection\InteractionEventSchema.ts

export const MAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts

export const PHONE_AND_IDENTITY_NUMBER_REGEX = /^([\da-zA-Z]+)$/;
//C:\Users\noamkor\Documents\coronai\CoronaInvestigation\client\src\components\App\Content\InvestigationForm\TabManagement\ExposuresAndFlights\Forms\ExposureForm\ExposureSourceOption.tsx


export const ENGLISH_ALPHANUMERIC_TEXT_REGEX = /^[a-zA-Z0-9\s,-]*$/;
//client\src\components\App\Content\InvestigationForm\TabManagement\InteractionsTab\InteractionDialog\InteractionEventForm\InteractionSection\TransportationForms\FlightEventForm.tsx

export const NUMERIC_REGEX = /^([\d]+)$/;
//client\src\components\App\Content\LandingPage\InvestigationTable\FilterCreators.ts
//client\src\components\App\Content\SignUp\SignUpForm\SignUpSchema.ts

export const SPECIAL_CHARS_REGEX = /^((?!@).)*$/;
//client\src\components\App\Content\SignUp\SignUpForm\SignUpSchema.ts


export const ID_BASIC_VALIDATION_REGEX = /^[0-9/]*$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts


export const PASSPORT_DASH_REGEX = /^([a-zA-Z0-9/])*$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts

export const PASSPORT_REGEX = /^([a-zA-Z0-9])*$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts

export const VISA_REGEX = /^([0-9\/])*$/;
//client\src\Utils\auxiliaryFunctions\auxiliaryFunctions.ts

export const USER_REGEX = /^[a-zA-Z\u0590-\u05fe0-9\\s\\._\\(\\),'\\"!^~#\\-\\@]*$/;
//client\src\Utils\UsersUtils\userUtils.ts

