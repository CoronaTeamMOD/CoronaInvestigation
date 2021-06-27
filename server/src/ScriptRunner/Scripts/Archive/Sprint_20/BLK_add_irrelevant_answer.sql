UPDATE public.green_pass_answers
	SET display_name='לא רלוונטי'
	WHERE id = 2;
	
INSERT INTO public.green_pass_answers(
	id, display_name)
	VALUES (5, 'בכלל לא')
	ON CONFLICT (id) DO UPDATE
	SET display_name = 'בכלל לא';

UPDATE public.green_pass_answers
	SET display_name='באופן חלקי'
	WHERE id = 3;

UPDATE public.green_pass_answers
	SET display_name='מלא'
	WHERE id = 4;

UPDATE public.green_pass_information
	SET answer_id=5
	WHERE answer_id=4;

UPDATE public.green_pass_information
	SET answer_id=4
	WHERE answer_id=3;
	
UPDATE public.green_pass_information
	SET answer_id=3
	WHERE answer_id=2;
	
