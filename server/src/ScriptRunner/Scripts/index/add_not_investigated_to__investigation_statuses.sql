INSERT INTO investigation_status (display_name, id)
SELECT 'לא נחקר',100000005
WHERE
    NOT EXISTS (
        SELECT id FROM investigation_status WHERE id = '100000005'
    );

INSERT INTO investigation_sub_status (display_name, id, parent_status)
SELECT 'מדיניות משרד הבריאות',100000008,100000005
WHERE
    NOT EXISTS (
        SELECT id FROM investigation_sub_status WHERE id = 100000008
    );

INSERT INTO investigation_sub_status (display_name, id, parent_status)
SELECT 'מדיניות לשכה',100000009,100000005
WHERE
    NOT EXISTS (
        SELECT id FROM investigation_sub_status WHERE id = 100000009
    );

INSERT INTO investigation_sub_status (display_name, id, parent_status)
SELECT 'חוסר בכ"א',100000010,100000005
WHERE
    NOT EXISTS (
        SELECT id FROM investigation_sub_status WHERE id = 100000010
    );
