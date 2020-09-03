import { useEffect, useState } from "react";

import InvestigationTableRow from "models/InvestigationTableRow";

import { useInvestigationTableOutcome } from "./InvestigationTableInterfaces";

export const createRowData = (
  epidemiologyNum: string,
  status: string,
  fullName: string,
  phoneNumber: string,
  age: number,
  city: string
): InvestigationTableRow => ({
  epidemiologyNum,
  status,
  fullName,
  phoneNumber,
  age,
  city,
});

const useInvestigationTable = (): useInvestigationTableOutcome => {
  const [rows, setRows] = useState<InvestigationTableRow[]>([]);

  useEffect(() => {
    // TODO: replace with data from db (rest api)
    const data = [
      createRowData("122333", "חדש", "לילי חדד", "054-4827111", 22, "באר שבע"),
      createRowData("122333", "חדש", "לילי חדד", "054-4827111", 22, "באר שבע"),
      createRowData("122333", "חדש", "לילי חדד", "054-4827111", 22, "באר שבע"),
      createRowData("122333", "חדש", "לילי חדד", "054-4827111", 22, "באר שבע"),
    ];

    setRows(data);
  }, []);

  return {
    tableRows: rows,
  };
};

export default useInvestigationTable;
