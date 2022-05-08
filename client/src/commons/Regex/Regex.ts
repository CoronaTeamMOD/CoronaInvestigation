export const ALPHANUMERIC_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe0-9\s]*$/;
export const ALPHANUMERIC_SLASHES_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe0-9\s\/\\]*$/;
export const ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/;
export const ALPHANUMERIC_WHITE_SPACE_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s0-9-]*$/;

export const ALPHBET_DASH_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe-\s]*$/;
export const ALPHBET_TEXT_REGEX = /^[a-zA-Z\u0590-\u05fe\s]*$/;

export const ENGLISH_ALPHANUMERIC_TEXT_REGEX = /^[a-zA-Z0-9\s,-]*$/;

export const FLIGHT_NUMBER_REGEX = /^[a-zA-Z0-9-\s//\\]*$/;
export const FULL_NAME_REGEX = /^[a-zA-Z\u0590-\u05fe-'"\s]*$/;

export const HEBREW_TEXT_REGEX = /^[\u0590-\u05fe\s]*$/;

export const ID_BASIC_VALIDATION_REGEX = /^[0-9/]*$/;

export const MAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const NUMERIC_REGEX = /^([\d]+)$/;
export const NUMERIC_TEXT_REGEX = /^[0-9]*$/;

export const NOT_REQUIRED_PHONE_NUMBER_REGEX = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$|^$/;

export const PHONE_NUMBER_REGEX = /^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/;
export const PHONE_AND_IDENTITY_NUMBER_REGEX = /^([\da-zA-Z]+)$/;

export const PASSPORT_DASH_REGEX = /^([a-zA-Z0-9/])*$/;
export const PASSPORT_REGEX = /^([a-zA-Z0-9])*$/;

export const SPECIAL_CHARS_REGEX = /^((?!@).)*$/;

export const USER_REGEX = /^[a-zA-Z\u0590-\u05fe0-9\s\\._\\(\\),'\\"!^~#\\-\\@]*$/;

export const VISA_REGEX = /^([0-9\/])*$/;

export const PALESTINE_ID_REGEX = /^[89]\d{8}$/;

export const ALPHANUMERIC_SPECIAL_CHARS_MAX_10_REGEX = /^[\u0590-\u05fe\s\0-9'\\"\-]{0,10}$/;