import  {createRowData}  from "./useInvestigationTable";
import InvestigationTableRow from "models/InvestigationTableRow";

describe("investigationTable tests", () => {
  let newRowData: InvestigationTableRow;

  beforeAll(() => {
    newRowData = {
      epidemiologyNumber: 111,
      status: "חדש",
      fullName: "אמילי",
      phoneNumber: "053-3486954",
      age: 25,
      city: "חיפה",
    };
  });

  it("shuld create correctly tableRow Object", async () => {
    const newRow = createRowData(
      newRowData.epidemiologyNumber,
      newRowData.status,
      newRowData.fullName,
      newRowData.phoneNumber,
      newRowData.age,
      newRowData.city
    );

    expect(newRow).toEqual(newRowData);
  });

  it("shuld not create correctly tableRow Object", async () => {
    const newRow = createRowData(
      newRowData.epidemiologyNumber,
      newRowData.fullName,
      newRowData.status,
      newRowData.phoneNumber,
      newRowData.age,
      newRowData.city
    );

    expect(newRow).not.toEqual(newRowData);
  });
});
