--
-- PostgreSQL database dump
--

\restrict PnLMwB8gLP5Sgk6k8953XGP6ay8GvYmkdM7Nc20QHCUrVCdx396QRLfDnay2av8

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg12+1)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: Combustible; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Combustible" AS ENUM (
    'GASOLINA',
    'DIESEL',
    'ELECTRICO',
    'HIBRIDO'
);


--
-- Name: EstadoIncidente; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoIncidente" AS ENUM (
    'ABIERTO',
    'EN_PROCESO',
    'RESUELTO'
);


--
-- Name: EstadoReserva; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoReserva" AS ENUM (
    'PENDIENTE',
    'APROBADA',
    'RECHAZADA',
    'ACTIVA',
    'COMPLETADA',
    'CANCELADA'
);


--
-- Name: EstadoVehiculo; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoVehiculo" AS ENUM (
    'DISPONIBLE',
    'RENTADO',
    'MANTENIMIENTO',
    'INACTIVO'
);


--
-- Name: Rol; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Rol" AS ENUM (
    'CLIENTE',
    'ADMIN'
);


--
-- Name: Transmision; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Transmision" AS ENUM (
    'AUTOMATICA',
    'MANUAL'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contracts (
    id text NOT NULL,
    reservation_id text NOT NULL,
    pdf_url text,
    fecha_firma date NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: incidents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incidents (
    id text NOT NULL,
    reservation_id text NOT NULL,
    tipo text NOT NULL,
    descripcion text NOT NULL,
    foto_url text,
    estado public."EstadoIncidente" DEFAULT 'ABIERTO'::public."EstadoIncidente" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: quotations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotations (
    id text NOT NULL,
    reservation_id text NOT NULL,
    monto numeric(10,2) NOT NULL,
    fecha_vence date NOT NULL,
    pdf_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id text NOT NULL,
    user_id text NOT NULL,
    vehicle_id text NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    dias_total integer NOT NULL,
    costo_total numeric(10,2) NOT NULL,
    estado public."EstadoReserva" DEFAULT 'PENDIENTE'::public."EstadoReserva" NOT NULL,
    notas text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    nombre text NOT NULL,
    apellido text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    telefono text,
    cedula text NOT NULL,
    rol public."Rol" DEFAULT 'CLIENTE'::public."Rol" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: vehicle_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_categories (
    id text NOT NULL,
    nombre text NOT NULL,
    descripcion text
);


--
-- Name: vehicle_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_images (
    id text NOT NULL,
    vehicle_id text NOT NULL,
    url text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    orden integer DEFAULT 0 NOT NULL
);


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id text NOT NULL,
    category_id text NOT NULL,
    marca text NOT NULL,
    modelo text NOT NULL,
    anio integer NOT NULL,
    placa text NOT NULL,
    capacidad integer NOT NULL,
    transmision public."Transmision" NOT NULL,
    combustible public."Combustible" NOT NULL,
    precio_dia numeric(10,2) NOT NULL,
    estado public."EstadoVehiculo" DEFAULT 'DISPONIBLE'::public."EstadoVehiculo" NOT NULL,
    descripcion text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contracts (id, reservation_id, pdf_url, fecha_firma, created_at) FROM stdin;
\.


--
-- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.incidents (id, reservation_id, tipo, descripcion, foto_url, estado, created_at) FROM stdin;
\.


--
-- Data for Name: quotations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quotations (id, reservation_id, monto, fecha_vence, pdf_url, created_at) FROM stdin;
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservations (id, user_id, vehicle_id, fecha_inicio, fecha_fin, dias_total, costo_total, estado, notas, created_at) FROM stdin;
420cebb2-c6ed-41e9-bf4d-96795c036404	11574abb-e1ba-4136-84fd-cf858bf681b5	1257e5c9-a149-412f-81b3-c271c3444f6b	2026-07-11	2026-07-31	20	1400.00	COMPLETADA	Lo necesito en el AILA	2026-07-10 20:38:17.301
c1e6eb40-a1f9-481c-ba8e-aaf5963ff4bc	96b801a1-18e7-45e7-b227-b18325651b0c	68698b84-4a76-4055-988a-17e9562a74a0	2026-07-11	2026-07-12	1	40.00	COMPLETADA	Que venga con chofer y que el chofer sea Jesé David Correa Castillo 🥰 si no, no quiero nada 🙊	2026-07-11 03:18:21.634
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, nombre, apellido, email, password_hash, telefono, cedula, rol, created_at) FROM stdin;
03fe172c-8f94-4f36-9fca-c48b85a5b88d	Jese	Correa	jcorrea0908@outlook.com	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	8495330908	40213289644	ADMIN	2026-07-07 23:29:48.464
11574abb-e1ba-4136-84fd-cf858bf681b5	Jose	Correa	jesedavid09@gmail.com	$2b$10$COt8dLvSnFR5PgIgOU/b6em5FbNnNg5SBuOAIfEtlV..BIJ6Q10Pu	8495330908	40212345678	CLIENTE	2026-07-10 20:36:21.202
96b801a1-18e7-45e7-b227-b18325651b0c	Deborah 	Pérez	dapgonzalez@outlook.com	$2b$10$Djs.A..xmb1Qr0MCzFrknOESrCvY4ylNVLx7m2JBgsjDGyvRJSmE6	8297521909	40213663871	CLIENTE	2026-07-11 03:17:02.961
\.


--
-- Data for Name: vehicle_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicle_categories (id, nombre, descripcion) FROM stdin;
a997c886-c0fe-487b-8905-2a8475c18f0d	Automóvil Compacto	Vehículos pequeños, económicos y fáciles de manejar
622e9aa3-c170-4743-8e5b-21787b2575af	Sedán	Vehículos medianos con maletero amplio y comodidad
740a8dc7-ab9d-42b1-806c-3a4420cbbac7	SUV	Vehículos todo terreno espaciosos para familia
14511b34-5c03-4f53-b9d6-0cd9e0ee0b59	SUV Compacto	SUV de tamaño mediano, ideal para ciudad y carretera
\.


--
-- Data for Name: vehicle_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicle_images (id, vehicle_id, url, is_primary, orden) FROM stdin;
a79e38be-a924-4251-907a-cab0c657dd5b	1257e5c9-a149-412f-81b3-c271c3444f6b	https://res.cloudinary.com/tyycka6w/image/upload/v1783988499/corkar/vehicles/rqopgdmj3sgbhxpqgcmo.jpg	t	0
fc28a7ac-4220-4803-a7ca-0be600d50089	f770ebf1-0313-462d-9cc6-cada3fa06641	https://res.cloudinary.com/tyycka6w/image/upload/v1783988559/corkar/vehicles/kps8kj1oqrbcr1uyizsh.jpg	t	0
14d9c9db-d931-4a2a-b9e4-241ac1f45987	3831fa7e-1949-415f-9e2e-d939f6c4797a	https://res.cloudinary.com/tyycka6w/image/upload/v1783988598/corkar/vehicles/rzvp2xi2eirtrqthltzh.jpg	t	0
508b1800-2637-4d17-929e-ca2f81fa2f14	e4271e64-092c-4f40-b872-94d941c32b83	https://res.cloudinary.com/tyycka6w/image/upload/v1783988618/corkar/vehicles/ton9ircyvnno9uqa31ae.jpg	t	0
4e7b0688-2ea8-4d67-8c4f-1bf4d6a2248c	68698b84-4a76-4055-988a-17e9562a74a0	https://res.cloudinary.com/tyycka6w/image/upload/v1783988869/corkar/vehicles/ipqpwenbkzopq8zq7cuv.jpg	t	0
fc82ebe7-3944-4960-adaf-9a08a6927941	02e384a2-c0fe-4e69-8b9f-71237868486f	https://res.cloudinary.com/tyycka6w/image/upload/v1783989140/corkar/vehicles/l1z1kqlbgnaeaknz9krx.jpg	t	0
0152898c-0599-4346-bfd0-ec502d2cabc4	6a388e47-a7cd-4787-8e3c-cbb4d2e8544a	https://res.cloudinary.com/tyycka6w/image/upload/v1783989160/corkar/vehicles/rmvlj3ysrl1jiczd3yv9.jpg	t	0
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicles (id, category_id, marca, modelo, anio, placa, capacidad, transmision, combustible, precio_dia, estado, descripcion, created_at) FROM stdin;
1257e5c9-a149-412f-81b3-c271c3444f6b	740a8dc7-ab9d-42b1-806c-3a4420cbbac7	Chevrolet	Traverse	2018	G703222	7	AUTOMATICA	GASOLINA	70.00	DISPONIBLE	SUV espacioso de 7 pasajeros.	2026-07-07 23:28:07.147
f770ebf1-0313-462d-9cc6-cada3fa06641	14511b34-5c03-4f53-b9d6-0cd9e0ee0b59	Hyundai	Cantus	2025	G744910	5	AUTOMATICA	GASOLINA	60.00	DISPONIBLE	SUV compacto moderno.	2026-07-07 23:28:07.147
3831fa7e-1949-415f-9e2e-d939f6c4797a	a997c886-c0fe-487b-8905-2a8475c18f0d	Hyundai	Grand i10	2020	A868863	5	AUTOMATICA	GASOLINA	35.00	DISPONIBLE	Automóvil compacto económico.	2026-07-07 23:28:07.147
e4271e64-092c-4f40-b872-94d941c32b83	a997c886-c0fe-487b-8905-2a8475c18f0d	Kia	Picanto	2023	A967722	5	AUTOMATICA	GASOLINA	35.00	DISPONIBLE	Compacto moderno con tecnología Kia.	2026-07-07 23:28:07.147
68698b84-4a76-4055-988a-17e9562a74a0	622e9aa3-c170-4743-8e5b-21787b2575af	Nissan	Versa	2021	AB04592	5	AUTOMATICA	GASOLINA	40.00	DISPONIBLE	Sedán confortable y espacioso.	2026-07-07 23:28:07.147
02e384a2-c0fe-4e69-8b9f-71237868486f	740a8dc7-ab9d-42b1-806c-3a4420cbbac7	Chevrolet	Tahoe	2018	G452890	8	AUTOMATICA	GASOLINA	90.00	DISPONIBLE	SUV premium de 8 pasajeros.	2026-07-07 23:28:07.147
6a388e47-a7cd-4787-8e3c-cbb4d2e8544a	14511b34-5c03-4f53-b9d6-0cd9e0ee0b59	Hyundai	Venue	2026	PP74950	5	AUTOMATICA	GASOLINA	45.00	DISPONIBLE	SUV compacto 2026.	2026-07-07 23:28:07.147
\.


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: incidents incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_pkey PRIMARY KEY (id);


--
-- Name: quotations quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_categories vehicle_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_categories
    ADD CONSTRAINT vehicle_categories_pkey PRIMARY KEY (id);


--
-- Name: vehicle_images vehicle_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_images
    ADD CONSTRAINT vehicle_images_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: contracts_reservation_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX contracts_reservation_id_key ON public.contracts USING btree (reservation_id);


--
-- Name: quotations_reservation_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX quotations_reservation_id_key ON public.quotations USING btree (reservation_id);


--
-- Name: users_cedula_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_cedula_key ON public.users USING btree (cedula);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: vehicle_categories_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicle_categories_nombre_key ON public.vehicle_categories USING btree (nombre);


--
-- Name: vehicles_placa_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicles_placa_key ON public.vehicles USING btree (placa);


--
-- Name: contracts contracts_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: incidents incidents_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: quotations quotations_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotations
    ADD CONSTRAINT quotations_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reservations reservations_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vehicle_images vehicle_images_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_images
    ADD CONSTRAINT vehicle_images_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehicles vehicles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.vehicle_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict PnLMwB8gLP5Sgk6k8953XGP6ay8GvYmkdM7Nc20QHCUrVCdx396QRLfDnay2av8

