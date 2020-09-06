--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6
-- Dumped by pg_dump version 12.3

-- Started on 2020-09-02 17:56:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- TOC entry 206 (class 1259 OID 18379)
-- Name: address; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.address (
    id integer NOT NULL,
    city character varying,
    neighborhood character varying,
    street character varying,
    entrance character varying,
    house_num integer,
    floor integer,
    apartment integer
);


ALTER TABLE public.address OWNER TO coronai;

--
-- TOC entry 205 (class 1259 OID 18377)
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.address_id_seq OWNER TO coronai;

--
-- TOC entry 2380 (class 0 OID 0)
-- Dependencies: 205
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- TOC entry 200 (class 1259 OID 17129)
-- Name: chronic_illness; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.chronic_illness (
    id integer NOT NULL,
    display_name text NOT NULL
);


ALTER TABLE public.chronic_illness OWNER TO coronai;

--
-- TOC entry 203 (class 1259 OID 17185)
-- Name: chronic_illness_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.chronic_illness_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chronic_illness_id_seq OWNER TO coronai;

--
-- TOC entry 2381 (class 0 OID 0)
-- Dependencies: 203
-- Name: chronic_illness_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.chronic_illness_id_seq OWNED BY public.chronic_illness.id;


--
-- TOC entry 196 (class 1259 OID 16483)
-- Name: contact_event; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.contact_event (
    id integer NOT NULL,
    investigation_id integer NOT NULL,
    allows_hamagen_data boolean NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    place_name character varying NOT NULL,
    bus_line character varying,
    train_line character varying,
    bus_company character varying,
    boarding_station character varying,
    end_station character varying,
    number_of_contacted character varying,
    isolation_start_date timestamp with time zone,
    externalization_approval boolean,
    place_type character varying NOT NULL,
    contact_phone_number character varying,
    does_need_isolation boolean,
    isloation_start_date timestamp with time zone,
    contact_event_extra_info character varying,
    location_address integer,
    grade character varying,
    origin character varying,
    destination character varying,
    airline character varying,
    flight_num character varying,
    flight_date timestamp with time zone,
    contact_person_first_name character varying,
    contact_person_last_name character varying,
    contact_person_phone_number character varying
);


ALTER TABLE public.contact_event OWNER TO coronai;

--
-- TOC entry 197 (class 1259 OID 16489)
-- Name: contact_event_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.contact_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_event_id_seq OWNER TO coronai;

--
-- TOC entry 2382 (class 0 OID 0)
-- Dependencies: 197
-- Name: contact_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.contact_event_id_seq OWNED BY public.contact_event.id;


--
-- TOC entry 198 (class 1259 OID 16491)
-- Name: contacted_person; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.contacted_person (
    id integer NOT NULL,
    person_info integer NOT NULL,
    contact_event integer NOT NULL,
    relationship character varying
);


ALTER TABLE public.contacted_person OWNER TO coronai;

--
-- TOC entry 199 (class 1259 OID 16494)
-- Name: contacted_person_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.contacted_person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacted_person_id_seq OWNER TO coronai;

--
-- TOC entry 2383 (class 0 OID 0)
-- Dependencies: 199
-- Name: contacted_person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.contacted_person_id_seq OWNED BY public.contacted_person.id;


--
-- TOC entry 219 (class 1259 OID 18630)
-- Name: exposure; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.exposure (
    id integer NOT NULL,
    investigation_id integer NOT NULL,
    was_confirmed_exposure boolean NOT NULL,
    exposure_first_name character varying,
    exposure_last_name character varying,
    exposure_addess integer,
    was_abroad boolean,
    flight_origin character varying,
    flight_destination character varying,
    flight_date timestamp with time zone,
    airline character varying,
    flight_num character varying,
    exposure_place_name character varying,
    exposure_place_type character varying
);


ALTER TABLE public.exposure OWNER TO coronai;

--
-- TOC entry 218 (class 1259 OID 18628)
-- Name: exposure1_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.exposure1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exposure1_id_seq OWNER TO coronai;

--
-- TOC entry 2384 (class 0 OID 0)
-- Dependencies: 218
-- Name: exposure1_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.exposure1_id_seq OWNED BY public.exposure.id;


--
-- TOC entry 210 (class 1259 OID 18412)
-- Name: gender; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.gender (
    gender character varying NOT NULL
);


ALTER TABLE public.gender OWNER TO coronai;

--
-- TOC entry 215 (class 1259 OID 18562)
-- Name: hmo; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.hmo (
    display_name character varying NOT NULL
);


ALTER TABLE public.hmo OWNER TO coronai;

--
-- TOC entry 209 (class 1259 OID 18403)
-- Name: identification_type; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.identification_type (
    type character varying NOT NULL
);


ALTER TABLE public.identification_type OWNER TO coronai;

--
-- TOC entry 214 (class 1259 OID 18538)
-- Name: investigated_patient; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.investigated_patient (
    id integer NOT NULL,
    person_id integer NOT NULL,
    nationality character varying NOT NULL,
    hmo character varying NOT NULL,
    is_deceased boolean NOT NULL,
    address integer NOT NULL,
    occupation character varying,
    work_place character varying,
    is_pregnant boolean
);


ALTER TABLE public.investigated_patient OWNER TO coronai;

--
-- TOC entry 221 (class 1259 OID 18662)
-- Name: investigated_patient_background_diseases; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.investigated_patient_background_diseases (
    background_deseas_id integer NOT NULL,
    investigated_patient_id integer NOT NULL
);


ALTER TABLE public.investigated_patient_background_diseases OWNER TO coronai;

--
-- TOC entry 213 (class 1259 OID 18536)
-- Name: investigated_patient_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.investigated_patient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.investigated_patient_id_seq OWNER TO coronai;

--
-- TOC entry 2385 (class 0 OID 0)
-- Dependencies: 213
-- Name: investigated_patient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.investigated_patient_id_seq OWNED BY public.investigated_patient.id;


--
-- TOC entry 220 (class 1259 OID 18649)
-- Name: investigated_patient_symptoms; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.investigated_patient_symptoms (
    symptom_id integer NOT NULL,
    investigation_id integer NOT NULL
);


ALTER TABLE public.investigated_patient_symptoms OWNER TO coronai;

--
-- TOC entry 217 (class 1259 OID 18588)
-- Name: investigation; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.investigation (
    epidemioligy_number integer NOT NULL,
    creator integer NOT NULL,
    last_updator integer NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    last_update_time timestamp with time zone,
    investigating_unit character varying,
    investigation_status character varying,
    isolation_address integer NOT NULL,
    is_in_isolation boolean,
    is_isolation_problem boolean,
    isolation_start_time timestamp with time zone,
    symptoms_start_time timestamp with time zone,
    hospital character varying,
    hospitalization_start_time timestamp with time zone,
    hospitalization_end_time timestamp with time zone,
    is_handled_by_forgein boolean,
    is_home_front_command_investigator boolean,
    investigated_patient_id integer,
    hospital_department character varying,
    is_isolation_problem_more_info character varying
);


ALTER TABLE public.investigation OWNER TO coronai;

--
-- TOC entry 222 (class 1259 OID 18684)
-- Name: investigation_status; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.investigation_status (
    display_name character varying NOT NULL
);


ALTER TABLE public.investigation_status OWNER TO coronai;

--
-- TOC entry 216 (class 1259 OID 18570)
-- Name: occupation; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.occupation (
    display_name character varying NOT NULL
);


ALTER TABLE public.occupation OWNER TO coronai;

--
-- TOC entry 208 (class 1259 OID 18394)
-- Name: person; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.person (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    identification_type character varying,
    identification_number character varying,
    phone_number character varying,
    additional_phone_number character varying,
    gender character varying,
    birth_date timestamp with time zone
);


ALTER TABLE public.person OWNER TO coronai;

--
-- TOC entry 207 (class 1259 OID 18392)
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_id_seq OWNER TO coronai;

--
-- TOC entry 2386 (class 0 OID 0)
-- Dependencies: 207
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- TOC entry 201 (class 1259 OID 17161)
-- Name: place_types; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.place_types (
    display_name character varying NOT NULL
);


ALTER TABLE public.place_types OWNER TO coronai;

--
-- TOC entry 223 (class 1259 OID 19026)
-- Name: relationship; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.relationship (
    display_name character varying NOT NULL
);


ALTER TABLE public.relationship OWNER TO coronai;

--
-- TOC entry 202 (class 1259 OID 17177)
-- Name: symptoms; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public.symptoms (
    id integer NOT NULL,
    display_name character varying NOT NULL
);


ALTER TABLE public.symptoms OWNER TO coronai;

--
-- TOC entry 204 (class 1259 OID 17252)
-- Name: symptoms_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.symptoms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.symptoms_id_seq OWNER TO coronai;

--
-- TOC entry 2387 (class 0 OID 0)
-- Dependencies: 204
-- Name: symptoms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.symptoms_id_seq OWNED BY public.symptoms.id;


--
-- TOC entry 212 (class 1259 OID 18432)
-- Name: user; Type: TABLE; Schema: public; Owner: coronai
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    person_id integer NOT NULL,
    user_name character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO coronai;

--
-- TOC entry 211 (class 1259 OID 18430)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: coronai
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO coronai;

--
-- TOC entry 2388 (class 0 OID 0)
-- Dependencies: 211
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: coronai
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 2185 (class 2604 OID 18382)
-- Name: address id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- TOC entry 2183 (class 2604 OID 17187)
-- Name: chronic_illness id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.chronic_illness ALTER COLUMN id SET DEFAULT nextval('public.chronic_illness_id_seq'::regclass);


--
-- TOC entry 2181 (class 2604 OID 16597)
-- Name: contact_event id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contact_event ALTER COLUMN id SET DEFAULT nextval('public.contact_event_id_seq'::regclass);


--
-- TOC entry 2182 (class 2604 OID 16598)
-- Name: contacted_person id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contacted_person ALTER COLUMN id SET DEFAULT nextval('public.contacted_person_id_seq'::regclass);


--
-- TOC entry 2189 (class 2604 OID 18633)
-- Name: exposure id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.exposure ALTER COLUMN id SET DEFAULT nextval('public.exposure1_id_seq'::regclass);


--
-- TOC entry 2188 (class 2604 OID 18541)
-- Name: investigated_patient id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient ALTER COLUMN id SET DEFAULT nextval('public.investigated_patient_id_seq'::regclass);


--
-- TOC entry 2186 (class 2604 OID 18397)
-- Name: person id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- TOC entry 2184 (class 2604 OID 17254)
-- Name: symptoms id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.symptoms ALTER COLUMN id SET DEFAULT nextval('public.symptoms_id_seq'::regclass);


--
-- TOC entry 2187 (class 2604 OID 18435)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 2201 (class 2606 OID 18387)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- TOC entry 2203 (class 2606 OID 18391)
-- Name: address address_uk; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_uk UNIQUE (city, neighborhood, street, entrance, house_num, floor, apartment);


--
-- TOC entry 2195 (class 2606 OID 17195)
-- Name: chronic_illness chronic_illness_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.chronic_illness
    ADD CONSTRAINT chronic_illness_pkey PRIMARY KEY (id);


--
-- TOC entry 2191 (class 2606 OID 16544)
-- Name: contact_event contact_event_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contact_event
    ADD CONSTRAINT contact_event_pkey PRIMARY KEY (id);


--
-- TOC entry 2193 (class 2606 OID 16546)
-- Name: contacted_person contacted_person_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contacted_person
    ADD CONSTRAINT contacted_person_pkey PRIMARY KEY (id);


--
-- TOC entry 2221 (class 2606 OID 18638)
-- Name: exposure exposure_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.exposure
    ADD CONSTRAINT exposure_pkey PRIMARY KEY (id);


--
-- TOC entry 2209 (class 2606 OID 18419)
-- Name: gender gender_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (gender);


--
-- TOC entry 2215 (class 2606 OID 18569)
-- Name: hmo hmo_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.hmo
    ADD CONSTRAINT hmo_pkey PRIMARY KEY (display_name);


--
-- TOC entry 2207 (class 2606 OID 18410)
-- Name: identification_type identification_type_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.identification_type
    ADD CONSTRAINT identification_type_pkey PRIMARY KEY (type);


--
-- TOC entry 2225 (class 2606 OID 18666)
-- Name: investigated_patient_background_diseases investigated_patiend_background_deseases_uk; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient_background_diseases
    ADD CONSTRAINT investigated_patiend_background_deseases_uk PRIMARY KEY (background_deseas_id, investigated_patient_id);


--
-- TOC entry 2223 (class 2606 OID 18678)
-- Name: investigated_patient_symptoms investigated_patiend_symptoms_uk; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient_symptoms
    ADD CONSTRAINT investigated_patiend_symptoms_uk PRIMARY KEY (symptom_id, investigation_id);


--
-- TOC entry 2213 (class 2606 OID 18546)
-- Name: investigated_patient investigated_patient_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient
    ADD CONSTRAINT investigated_patient_pkey PRIMARY KEY (id);


--
-- TOC entry 2219 (class 2606 OID 18592)
-- Name: investigation investigation_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation
    ADD CONSTRAINT investigation_pkey PRIMARY KEY (epidemioligy_number);


--
-- TOC entry 2227 (class 2606 OID 18691)
-- Name: investigation_status investigation_status_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation_status
    ADD CONSTRAINT investigation_status_pkey PRIMARY KEY (display_name);


--
-- TOC entry 2217 (class 2606 OID 18577)
-- Name: occupation occupation_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.occupation
    ADD CONSTRAINT occupation_pkey PRIMARY KEY (display_name);


--
-- TOC entry 2205 (class 2606 OID 18402)
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- TOC entry 2197 (class 2606 OID 19049)
-- Name: place_types place_type_pk; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.place_types
    ADD CONSTRAINT place_type_pk PRIMARY KEY (display_name);


--
-- TOC entry 2229 (class 2606 OID 19033)
-- Name: relationship relationship_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.relationship
    ADD CONSTRAINT relationship_pkey PRIMARY KEY (display_name);


--
-- TOC entry 2199 (class 2606 OID 17262)
-- Name: symptoms symptoms_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.symptoms
    ADD CONSTRAINT symptoms_pkey PRIMARY KEY (id);


--
-- TOC entry 2211 (class 2606 OID 18440)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 2241 (class 2606 OID 19126)
-- Name: investigated_patient address_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient
    ADD CONSTRAINT address_fk FOREIGN KEY (address) REFERENCES public.address(id) NOT VALID;


--
-- TOC entry 2247 (class 2606 OID 19096)
-- Name: exposure address_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.exposure
    ADD CONSTRAINT address_id_fk FOREIGN KEY (exposure_addess) REFERENCES public.address(id) NOT VALID;


--
-- TOC entry 2252 (class 2606 OID 18667)
-- Name: investigated_patient_background_diseases background_deseas_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient_background_diseases
    ADD CONSTRAINT background_deseas_fk FOREIGN KEY (background_deseas_id) REFERENCES public.chronic_illness(id);


--
-- TOC entry 2232 (class 2606 OID 19078)
-- Name: contacted_person contact_event_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contacted_person
    ADD CONSTRAINT contact_event_fk FOREIGN KEY (contact_event) REFERENCES public.contact_event(id) NOT VALID;


--
-- TOC entry 2244 (class 2606 OID 18702)
-- Name: investigation creator_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation
    ADD CONSTRAINT creator_fk FOREIGN KEY (creator) REFERENCES public."user"(id) NOT VALID;


--
-- TOC entry 2236 (class 2606 OID 18425)
-- Name: person gender_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT gender_fk FOREIGN KEY (gender) REFERENCES public.gender(gender) NOT VALID;


--
-- TOC entry 2238 (class 2606 OID 19111)
-- Name: investigated_patient hmo_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient
    ADD CONSTRAINT hmo_fk FOREIGN KEY (hmo) REFERENCES public.hmo(display_name) NOT VALID;


--
-- TOC entry 2235 (class 2606 OID 18420)
-- Name: person identification_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT identification_type_fk FOREIGN KEY (identification_type) REFERENCES public.identification_type(type) NOT VALID;


--
-- TOC entry 2253 (class 2606 OID 18672)
-- Name: investigated_patient_background_diseases investigated_patient_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient_background_diseases
    ADD CONSTRAINT investigated_patient_fk FOREIGN KEY (investigated_patient_id) REFERENCES public.investigated_patient(id);


--
-- TOC entry 2242 (class 2606 OID 18692)
-- Name: investigation investigated_patient_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation
    ADD CONSTRAINT investigated_patient_fk FOREIGN KEY (investigated_patient_id) REFERENCES public.investigated_patient(id) NOT VALID;


--
-- TOC entry 2243 (class 2606 OID 18697)
-- Name: investigation investigated_status_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation
    ADD CONSTRAINT investigated_status_fk FOREIGN KEY (investigation_status) REFERENCES public.investigation_status(display_name) NOT VALID;


--
-- TOC entry 2251 (class 2606 OID 18657)
-- Name: investigated_patient_symptoms investigation_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient_symptoms
    ADD CONSTRAINT investigation_fk FOREIGN KEY (investigation_id) REFERENCES public.investigation(epidemioligy_number);


--
-- TOC entry 2230 (class 2606 OID 19050)
-- Name: contact_event investigation_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contact_event
    ADD CONSTRAINT investigation_id_fk FOREIGN KEY (investigation_id) REFERENCES public.investigation(epidemioligy_number) NOT VALID;


--
-- TOC entry 2248 (class 2606 OID 19101)
-- Name: exposure investigation_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.exposure
    ADD CONSTRAINT investigation_id_fk FOREIGN KEY (investigation_id) REFERENCES public.investigation(epidemioligy_number) NOT VALID;


--
-- TOC entry 2245 (class 2606 OID 18707)
-- Name: investigation isolation_address_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation
    ADD CONSTRAINT isolation_address_fk FOREIGN KEY (isolation_address) REFERENCES public.address(id) NOT VALID;


--
-- TOC entry 2246 (class 2606 OID 18712)
-- Name: investigation last_updator_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigation
    ADD CONSTRAINT last_updator_fk FOREIGN KEY (last_updator) REFERENCES public."user"(id) NOT VALID;


--
-- TOC entry 2239 (class 2606 OID 19116)
-- Name: investigated_patient occupation_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient
    ADD CONSTRAINT occupation_fk FOREIGN KEY (occupation) REFERENCES public.occupation(display_name) NOT VALID;


--
-- TOC entry 2234 (class 2606 OID 19088)
-- Name: contacted_person person_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contacted_person
    ADD CONSTRAINT person_fk FOREIGN KEY (person_info) REFERENCES public.person(id) NOT VALID;


--
-- TOC entry 2237 (class 2606 OID 19009)
-- Name: user person_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT person_id_fk FOREIGN KEY (person_id) REFERENCES public.person(id) NOT VALID;


--
-- TOC entry 2240 (class 2606 OID 19121)
-- Name: investigated_patient person_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient
    ADD CONSTRAINT person_id_fk FOREIGN KEY (person_id) REFERENCES public.person(id) NOT VALID;


--
-- TOC entry 2231 (class 2606 OID 19055)
-- Name: contact_event place_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contact_event
    ADD CONSTRAINT place_type_fk FOREIGN KEY (place_type) REFERENCES public.place_types(display_name) NOT VALID;


--
-- TOC entry 2249 (class 2606 OID 19106)
-- Name: exposure place_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.exposure
    ADD CONSTRAINT place_type_fk FOREIGN KEY (exposure_place_type) REFERENCES public.place_types(display_name) NOT VALID;


--
-- TOC entry 2233 (class 2606 OID 19083)
-- Name: contacted_person relationship_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.contacted_person
    ADD CONSTRAINT relationship_fk FOREIGN KEY (relationship) REFERENCES public.relationship(display_name) NOT VALID;


--
-- TOC entry 2250 (class 2606 OID 18652)
-- Name: investigated_patient_symptoms symptom_fk; Type: FK CONSTRAINT; Schema: public; Owner: coronai
--

ALTER TABLE ONLY public.investigated_patient_symptoms
    ADD CONSTRAINT symptom_fk FOREIGN KEY (symptom_id) REFERENCES public.symptoms(id);


-- Completed on 2020-09-02 17:57:02

--
-- PostgreSQL database dump complete
--

