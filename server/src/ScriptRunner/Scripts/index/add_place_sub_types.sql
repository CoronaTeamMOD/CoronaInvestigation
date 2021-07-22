INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (4, 'אוניברסיטה / מכללה','מוסד השכלה',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'אוניברסיטה / מכללה' , parent_place_type = 'מוסד השכלה', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (126, 'בית דין רבני','מקומות ציבוריים נוספים',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'בית דין רבני' , parent_place_type = 'מקומות ציבוריים נוספים', main_classification = 1;

INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (50, 'מוסד ציבור','מקומות ציבוריים נוספים',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'מוסד ציבור' , parent_place_type = 'מקומות ציבוריים נוספים', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (106, 'מסלול טיול /טיול בטבע / פיקניק','מקומות ציבוריים נוספים',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'מסלול טיול /טיול בטבע / פיקניק' , parent_place_type = 'מקומות ציבוריים נוספים', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (115, 'מרחב ציבורי / שטח פתוח','מקומות ציבוריים נוספים',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'מרחב ציבורי / שטח פתוח' , parent_place_type = 'מקומות ציבוריים נוספים', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (90, 'תאטרון / הצגה','מקום בילוי',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'תאטרון / הצגה' , parent_place_type = 'מקום בילוי', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (7, 'מדא / רפואה דחופה / טר"ם','מוסד רפואי',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'מדא / רפואה דחופה / טר"ם' , parent_place_type = 'מוסד רפואי', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (61, 'גן ילדים / מעון / פעוטון','מוסד השכלה',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'גן ילדים / מעון / פעוטון' , parent_place_type = 'מוסד השכלה', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (79, 'בר / פאב','מקום בילוי',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'בר / פאב' , parent_place_type = 'מקום בילוי', main_classification = 1;
	
INSERT INTO public.place_sub_types (id,display_name,parent_place_type,main_classification)
    VALUES (114, 'משרד','משרד',1)
    ON CONFLICT (id) DO UPDATE SET display_name = 'משרד' , parent_place_type = 'משרד', main_classification = 1;