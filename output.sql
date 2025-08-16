

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CommentLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CommentLikes" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "commentId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: CommentLikes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CommentLikes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: CommentLikes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CommentLikes_id_seq" OWNED BY public."CommentLikes".id;


--
-- Name: Comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    content text NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "likesCount" integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: PostLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PostLikes" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: PostLikes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PostLikes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: PostLikes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PostLikes_id_seq" OWNED BY public."PostLikes".id;


--
-- Name: Posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Posts" (
    id integer NOT NULL,
    topic text NOT NULL,
    content text NOT NULL,
    "userId" integer NOT NULL,
    "likesCount" integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: Posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: Posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Posts_id_seq" OWNED BY public."Posts".id;


--
-- Name: Profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profiles" (
    id integer NOT NULL,
    photo character varying(255) DEFAULT NULL::character varying,
    "birthDate" date,
    bio text,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: Profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Profiles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: Profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Profiles_id_seq" OWNED BY public."Profiles".id;


--
-- Name: Tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tokens" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "refreshToken" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: Tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tokens_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: Tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tokens_id_seq" OWNED BY public."Tokens".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255),
    nickname character varying(255),
    role character varying(255) DEFAULT 'USER'::character varying,
    "isActivated" boolean DEFAULT false,
    "activationLink" character varying(255),
    "deletionCode" character varying(255),
    "deletionCodeExpires" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);



--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: CommentLikes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLikes" ALTER COLUMN id SET DEFAULT nextval('public."CommentLikes_id_seq"'::regclass);


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: PostLikes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLikes" ALTER COLUMN id SET DEFAULT nextval('public."PostLikes_id_seq"'::regclass);


--
-- Name: Posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts" ALTER COLUMN id SET DEFAULT nextval('public."Posts_id_seq"'::regclass);


--
-- Name: Profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles" ALTER COLUMN id SET DEFAULT nextval('public."Profiles_id_seq"'::regclass);


--
-- Name: Tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tokens" ALTER COLUMN id SET DEFAULT nextval('public."Tokens_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: CommentLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CommentLikes" (id, "userId", "commentId", "createdAt", "updatedAt") FROM stdin;
16	7	21	2025-08-12 19:37:24.889+03	2025-08-12 19:37:24.889+03
17	4	22	2025-08-14 22:23:13.101+03	2025-08-14 22:23:13.101+03
\.


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comments" (id, content, "userId", "postId", "likesCount", "createdAt", "updatedAt") FROM stdin;
21	аа	7	15	1	2025-08-12 19:37:23.099+03	2025-08-12 19:37:24.894+03
22	nnnnn	4	15	1	2025-08-14 22:23:10.528+03	2025-08-14 22:23:13.105+03
\.


--
-- Data for Name: PostLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PostLikes" (id, "userId", "postId", "createdAt", "updatedAt") FROM stdin;
56	7	14	2025-08-12 19:37:07.577+03	2025-08-12 19:37:07.577+03
58	7	15	2025-08-12 19:37:29.964+03	2025-08-12 19:37:29.964+03
59	4	15	2025-08-12 19:48:55.847+03	2025-08-12 19:48:55.847+03
\.


--
-- Data for Name: Posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Posts" (id, topic, content, "userId", "likesCount", "createdAt", "updatedAt") FROM stdin;
14	kk	kkk	7	1	2025-08-11 23:03:59.684+03	2025-08-12 19:37:07.591+03
15	вмвм	ввв	7	2	2025-08-12 19:37:14.83+03	2025-08-12 19:48:55.851+03
\.


--
-- Data for Name: Profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profiles" (id, photo, "birthDate", bio, "userId", "createdAt", "updatedAt") FROM stdin;
3	/uploads/1754856654211-470446105.jpg	2025-08-01	\N	5	2025-08-10 23:10:27.251+03	2025-08-10 23:18:03.189+03
2	/uploads/1754848777385-791230046.jpg	2025-08-05	mnnn	4	2025-08-10 02:22:25.691+03	2025-08-11 20:02:28.977+03
5	/uploads/1754942130794-385555318.png	2025-08-05	ddd	7	2025-08-11 20:51:41.66+03	2025-08-11 22:55:31.982+03
\.


--
-- Data for Name: Tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tokens" (id, "userId", "refreshToken", "createdAt", "updatedAt") FROM stdin;
31	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAeWFuZGV4LnJ1IiwiaWQiOjQsImlzQWN0aXZhdGVkIjpmYWxzZSwibmlja25hbWUiOiJ1c2VyQHlhbmRleC5ydSIsImlhdCI6MTc1NTE5OTQwOCwiZXhwIjoxNzU3NzkxNDA4fQ.7qvL1rNfBgm4btRr5q4tN_PCZhTi8h2H4qxjELlOnnk	2025-08-12 19:46:29.687+03	2025-08-14 22:23:28.235+03
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, email, password, nickname, role, "isActivated", "activationLink", "deletionCode", "deletionCodeExpires", "createdAt", "updatedAt") FROM stdin;
4	user@yandex.ru	$2b$04$h2tHSWtl4RHSKa17PSTBi.EawbLNU72vvKv9iwA6lzizSW.8Ng1/6	user@yandex.ru	USER	f	acb212eb-72d4-47f5-bbc5-e4c16925a851	\N	\N	2025-08-10 02:22:25.682+03	2025-08-12 19:48:38.716+03
5	user1@yandex.ru	$2b$04$APKcyfa9HpSdSdhMLjxRwuc2LHas388gCXZC.tApTb0SnMITFOZum	user1@yandex.ru	USER	f	eb92c211-b952-4a54-8f1f-f2e42a47ea47	\N	\N	2025-08-10 23:10:27.245+03	2025-08-10 23:10:27.245+03
7	alexruskor@gmail.com	$2b$04$nHaRFp7tF3yZnNv0ynHPUuJHw8gDeKjSo0Df14G3u4caRvfAu8UxG	alexruskor@gmail.com	USER	t	78b9fcbf-e14a-4c46-a231-586eb069d4c6	\N	\N	2025-08-11 20:51:41.653+03	2025-08-11 23:03:49.062+03
\.


--
-- Name: CommentLikes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CommentLikes_id_seq"', 17, true);


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 22, true);


--
-- Name: PostLikes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PostLikes_id_seq"', 59, true);


--
-- Name: Posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Posts_id_seq"', 15, true);


--
-- Name: Profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Profiles_id_seq"', 5, true);


--
-- Name: Tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tokens_id_seq"', 31, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 7, true);


--
-- Name: CommentLikes CommentLikes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLikes"
    ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY (id);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: PostLikes PostLikes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLikes"
    ADD CONSTRAINT "PostLikes_pkey" PRIMARY KEY (id);


--
-- Name: Posts Posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_pkey" PRIMARY KEY (id);


--
-- Name: Profiles Profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY (id);


--
-- Name: Profiles Profiles_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_userId_key" UNIQUE ("userId");


--
-- Name: Tokens Tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tokens"
    ADD CONSTRAINT "Tokens_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_nickname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_nickname_key" UNIQUE (nickname);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: comment_likes_user_id_comment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX comment_likes_user_id_comment_id ON public."CommentLikes" USING btree ("userId", "commentId");


--
-- Name: post_likes_user_id_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX post_likes_user_id_post_id ON public."PostLikes" USING btree ("userId", "postId");


--
-- Name: CommentLikes CommentLikes_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLikes"
    ADD CONSTRAINT "CommentLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comments"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CommentLikes CommentLikes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLikes"
    ADD CONSTRAINT "CommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Posts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLikes PostLikes_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLikes"
    ADD CONSTRAINT "PostLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Posts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLikes PostLikes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLikes"
    ADD CONSTRAINT "PostLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Posts Posts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Posts"
    ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Profiles Profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;



