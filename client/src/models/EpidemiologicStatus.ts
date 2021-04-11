interface EpidemiologicStatus {
    recoveryDate: Date | null,
    serologicImmunityStartDate: Date | null,
    serologicImmunityExpirationDate: Date | null,
    vaccineEffectivenessStartDate: Date | null,
    vaccineExpirationDate: Date | null
}

export default EpidemiologicStatus;