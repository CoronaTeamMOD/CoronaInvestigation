UPDATE investigation
SET investigation_status = 100000008
WHERE investigation_status = 100000000 AND investigation_sub_status = 'נפטר';

UPDATE investigation
	SET investigation_sub_status = 
		CASE
		 WHEN investigation_status = 100000008 AND investigation_sub_status = 'מדיניות לשכה'
		 THEN 'מדיניות משרד הבריאות'
		 WHEN investigation_status = 100000000 AND investigation_sub_status = 'חסר טלפון'
		 THEN 'חסרים פרטי מטופל'
		 WHEN investigation_status = 100000000 AND investigation_sub_status = 'טלפון לא זמין'
		 THEN 'לא ניתן לאיתור'
		 WHEN investigation_status = 100000000 AND investigation_sub_status = 'מטופל מבקש לצלצל אליו בזמן אחר'
		 THEN 'חוסר שיתוף פעולה'
		 ELSE investigation_sub_status
		END