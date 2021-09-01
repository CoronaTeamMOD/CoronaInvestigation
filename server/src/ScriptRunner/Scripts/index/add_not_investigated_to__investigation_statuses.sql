INSERT INTO investigation_status (display_name, id)
VALUES ('לא נחקר',100000008)
ON CONFLICT (id) DO NOTHING;

INSERT INTO investigation_sub_status (display_name, id, parent_status)
VALUES ('מדיניות משרד הבריאות',100000008,100000008)
ON CONFLICT DO NOTHING;

INSERT INTO investigation_sub_status (display_name, id, parent_status)
VALUES ('מדיניות לשכה',100000009,100000008)
ON CONFLICT DO NOTHING;

INSERT INTO investigation_sub_status (display_name, id, parent_status)
VALUES ('חוסר בכ"א',100000010,100000008)
ON CONFLICT DO NOTHING;


