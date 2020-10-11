import XLSX from 'xlsx';

const useExcel = () => {
    // The following code is taken from xlsx@0.15.1.
    // They are private scoped and inaccessible from outside of the library.
    const baseDate = new Date(1899, 11, 30, 0, 0, 0);
    const dnthresh = baseDate.getTime() + (new Date().getTimezoneOffset() - baseDate.getTimezoneOffset()) * 60000;

    const day_ms = 24 * 60 * 60 * 1000;
    const days_1462_ms = 1462 * day_ms;

    const datenum = (date: Date, date1904: boolean) => {
        let epoch = date.getTime();
        if (date1904) {
            epoch -= days_1462_ms;
        }
        return (epoch - dnthresh) / day_ms;
    };

    // hotfix for sheet js parsing of israeli timezone dates from excel files
    // according to https://github.com/SheetJS/sheetjs/issues/1565#issuecomment-548491331
    const fixIsraeliDate = (date1904: boolean) => (date: Date) => {
        // Convert JS Date back to Excel date code and parse them using SSF module.
        const parsed = XLSX.SSF.parse_date_code(datenum(date, false), {date1904});
        return new Date(`${parsed.y}-${parsed.m}-${parsed.d}`);
    };

    return {
        read: XLSX.read,
        sheet_to_json: XLSX.utils.sheet_to_json,
        fixIsraeliDate
    }
};

export default useExcel;