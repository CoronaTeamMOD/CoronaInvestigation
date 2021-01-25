const useTableRows = (props : Props) => {
    const { selectedRows, setSelectedRows } = props;
    
    const handleCheckboxToggle = (id : number) => {
        const rowIndex = selectedRows.indexOf(id);
        if(rowIndex === -1) {
            setSelectedRows([...selectedRows , id])
        } else {
            setSelectedRows(selectedRows.filter(row => row !== id))
        }
    }

    return {
        handleCheckboxToggle
    }
}

interface Props {
    selectedRows: number[];
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

export default useTableRows;