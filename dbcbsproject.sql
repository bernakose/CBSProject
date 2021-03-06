PGDMP     +                
    y            dbcbsproject    13.4    13.4 V    1           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            2           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            3           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            4           1262    16542    dbcbsproject    DATABASE     i   CREATE DATABASE dbcbsproject WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Turkish_Turkey.1254';
    DROP DATABASE dbcbsproject;
                postgres    false            ?            1259    16597 	   Kullanici    TABLE     `  CREATE TABLE public."Kullanici" (
    id bigint NOT NULL,
    kullanici_adi character varying(50) NOT NULL,
    ad character varying(50) NOT NULL,
    soyad character varying(50) NOT NULL,
    tc character varying(50) NOT NULL,
    mail character varying(50) NOT NULL,
    sifre character varying(50) NOT NULL,
    kullanici_grup_id bigint NOT NULL
);
    DROP TABLE public."Kullanici";
       public         heap    postgres    false            ?            1259    16613    Kullanici_Fonksiyon    TABLE     ?   CREATE TABLE public."Kullanici_Fonksiyon" (
    id bigint NOT NULL,
    fonksiyon_id bigint NOT NULL,
    fonksiyon_adi character varying(50) NOT NULL,
    fonksiyon_aciklama character varying(100) NOT NULL
);
 )   DROP TABLE public."Kullanici_Fonksiyon";
       public         heap    postgres    false            ?            1259    16611    Kullanici_Fonksiyon_id_seq    SEQUENCE     ?   CREATE SEQUENCE public."Kullanici_Fonksiyon_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public."Kullanici_Fonksiyon_id_seq";
       public          postgres    false    206            5           0    0    Kullanici_Fonksiyon_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public."Kullanici_Fonksiyon_id_seq" OWNED BY public."Kullanici_Fonksiyon".id;
          public          postgres    false    205            ?            1259    16605    Kullanici_Grup    TABLE     ?   CREATE TABLE public."Kullanici_Grup" (
    id bigint NOT NULL,
    grup_id bigint NOT NULL,
    grup_adi character varying(50) NOT NULL,
    silinebilir_mi boolean NOT NULL
);
 $   DROP TABLE public."Kullanici_Grup";
       public         heap    postgres    false            ?            1259    16621    Kullanici_Grup_Fonksiyon    TABLE     ?   CREATE TABLE public."Kullanici_Grup_Fonksiyon" (
    id bigint NOT NULL,
    grup_id bigint NOT NULL,
    fonksiyon_id bigint NOT NULL
);
 .   DROP TABLE public."Kullanici_Grup_Fonksiyon";
       public         heap    postgres    false            ?            1259    16619    Kullanici_Grup_Fonksiyon_id_seq    SEQUENCE     ?   CREATE SEQUENCE public."Kullanici_Grup_Fonksiyon_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public."Kullanici_Grup_Fonksiyon_id_seq";
       public          postgres    false    208            6           0    0    Kullanici_Grup_Fonksiyon_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public."Kullanici_Grup_Fonksiyon_id_seq" OWNED BY public."Kullanici_Grup_Fonksiyon".id;
          public          postgres    false    207            ?            1259    16603    Kullanici_Grup_id_seq    SEQUENCE     ?   CREATE SEQUENCE public."Kullanici_Grup_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."Kullanici_Grup_id_seq";
       public          postgres    false    204            7           0    0    Kullanici_Grup_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."Kullanici_Grup_id_seq" OWNED BY public."Kullanici_Grup".id;
          public          postgres    false    203            ?            1259    16595    Kullanici_id_seq    SEQUENCE     {   CREATE SEQUENCE public."Kullanici_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Kullanici_id_seq";
       public          postgres    false    202            8           0    0    Kullanici_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Kullanici_id_seq" OWNED BY public."Kullanici".id;
          public          postgres    false    201            ?            1259    16588    VersionInfo    TABLE     ?   CREATE TABLE public."VersionInfo" (
    "Version" bigint NOT NULL,
    "AppliedOn" timestamp without time zone,
    "Description" character varying(1024)
);
 !   DROP TABLE public."VersionInfo";
       public         heap    postgres    false            ?            1259    24805    app_base_layer    TABLE     N  CREATE TABLE public.app_base_layer (
    id bigint NOT NULL,
    layer_name character varying(100),
    image_name character varying(100),
    is_tile_server integer,
    application_type_id bigint NOT NULL,
    directory character varying(100),
    cross_orign text,
    map_key text,
    is_default_layer bigint,
    sira bigint
);
 "   DROP TABLE public.app_base_layer;
       public         heap    postgres    false            ?            1259    24803    app_base_layer_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.app_base_layer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.app_base_layer_id_seq;
       public          postgres    false    223            9           0    0    app_base_layer_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.app_base_layer_id_seq OWNED BY public.app_base_layer.id;
          public          postgres    false    222            ?            1259    24782    app_base_layer_language    TABLE     ?   CREATE TABLE public.app_base_layer_language (
    id bigint NOT NULL,
    language_id bigint,
    base_layer_id bigint,
    layer_tag character varying
);
 +   DROP TABLE public.app_base_layer_language;
       public         heap    postgres    false            ?            1259    24776    app_language    TABLE     ?   CREATE TABLE public.app_language (
    id bigint NOT NULL,
    lang_name character varying(100),
    abbreviation character varying(100)
);
     DROP TABLE public.app_language;
       public         heap    postgres    false            ?            1259    24774    app_language_id_seq    SEQUENCE     |   CREATE SEQUENCE public.app_language_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.app_language_id_seq;
       public          postgres    false    218            :           0    0    app_language_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.app_language_id_seq OWNED BY public.app_language.id;
          public          postgres    false    217            ?            1259    16680 	   app_layer    TABLE     7  CREATE TABLE public.app_layer (
    id bigint NOT NULL,
    layer_name character varying(100),
    uniq_column_name character varying(100),
    helper_column_name character varying(100),
    layer_image_url character varying(100),
    is_info bigint,
    layer_row bigint,
    max_zoom bigint,
    min_zoom bigint,
    group_key character varying(100),
    layer_service_id bigint,
    default_open_close bigint,
    uniq_seq_name character varying(100),
    is_detail bigint,
    controller_name character varying(100),
    uniq_field_name character varying(100)
);
    DROP TABLE public.app_layer;
       public         heap    postgres    false            ?            1259    16678    app_layer_id_seq    SEQUENCE     y   CREATE SEQUENCE public.app_layer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.app_layer_id_seq;
       public          postgres    false    216            ;           0    0    app_layer_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.app_layer_id_seq OWNED BY public.app_layer.id;
          public          postgres    false    215            ?            1259    16664    app_settings    TABLE     ?   CREATE TABLE public.app_settings (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    value character varying(50) NOT NULL,
    extra_value character varying(100) NOT NULL
);
     DROP TABLE public.app_settings;
       public         heap    postgres    false            ?            1259    16662    app_settings_id_seq    SEQUENCE     |   CREATE SEQUENCE public.app_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.app_settings_id_seq;
       public          postgres    false    214            <           0    0    app_settings_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.app_settings_id_seq OWNED BY public.app_settings.id;
          public          postgres    false    213            ?            1259    24795    app_user_type_type_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.app_user_type_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.app_user_type_type_id_seq;
       public          postgres    false            ?            1259    24797    app_type    TABLE     ?   CREATE TABLE public.app_type (
    type_id bigint DEFAULT nextval('public.app_user_type_type_id_seq'::regclass) NOT NULL,
    type_name character varying(50) NOT NULL
);
    DROP TABLE public.app_type;
       public         heap    postgres    false    220            ?            1259    16629    app_user_login_logout    TABLE     0  CREATE TABLE public.app_user_login_logout (
    id bigint NOT NULL,
    user_name character varying(150),
    login_time timestamp without time zone,
    logout_time timestamp without time zone,
    client_info character varying(1000),
    ip_address character varying(1000),
    app_type_code bigint
);
 )   DROP TABLE public.app_user_login_logout;
       public         heap    postgres    false            ?            1259    16627    app_user_login_logout_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.app_user_login_logout_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.app_user_login_logout_id_seq;
       public          postgres    false    210            =           0    0    app_user_login_logout_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.app_user_login_logout_id_seq OWNED BY public.app_user_login_logout.id;
          public          postgres    false    209            ?            1259    16637    app_user_setting    TABLE     ?   CREATE TABLE public.app_user_setting (
    id bigint NOT NULL,
    zoom double precision,
    center_x double precision,
    center_y double precision,
    user_id bigint
);
 $   DROP TABLE public.app_user_setting;
       public         heap    postgres    false            ?            1259    16635    app_user_settings_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.app_user_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.app_user_settings_id_seq;
       public          postgres    false    212            >           0    0    app_user_settings_id_seq    SEQUENCE OWNED BY     T   ALTER SEQUENCE public.app_user_settings_id_seq OWNED BY public.app_user_setting.id;
          public          postgres    false    211            ?            1259    24814    v_app_base_layer_language    VIEW     ?  CREATE VIEW public.v_app_base_layer_language AS
 SELECT abll.id,
    abll.language_id,
    abll.base_layer_id,
    abll.layer_tag AS layer_title,
    abl.layer_name,
    abl.image_name,
    abl.is_tile_server,
    abl.application_type_id,
    abl.directory AS path,
    al.lang_name AS language_name,
    al.abbreviation AS language_short_name,
    app_type.type_name AS application_type_name,
    abl.cross_orign AS cross_origin,
    abl.map_key,
    abl.sira AS orders,
    abl.is_default_layer
   FROM (((public.app_language al
     JOIN public.app_base_layer_language abll ON ((al.id = abll.language_id)))
     JOIN public.app_base_layer abl ON ((abll.base_layer_id = abl.id)))
     JOIN public.app_type ON ((abl.application_type_id = app_type.type_id)));
 ,   DROP VIEW public.v_app_base_layer_language;
       public          postgres    false    218    218    218    219    219    223    223    223    223    223    223    223    223    223    223    221    221    219    219            p           2604    16600    Kullanici id    DEFAULT     p   ALTER TABLE ONLY public."Kullanici" ALTER COLUMN id SET DEFAULT nextval('public."Kullanici_id_seq"'::regclass);
 =   ALTER TABLE public."Kullanici" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    201    202    202            r           2604    16616    Kullanici_Fonksiyon id    DEFAULT     ?   ALTER TABLE ONLY public."Kullanici_Fonksiyon" ALTER COLUMN id SET DEFAULT nextval('public."Kullanici_Fonksiyon_id_seq"'::regclass);
 G   ALTER TABLE public."Kullanici_Fonksiyon" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    206    205    206            q           2604    16608    Kullanici_Grup id    DEFAULT     z   ALTER TABLE ONLY public."Kullanici_Grup" ALTER COLUMN id SET DEFAULT nextval('public."Kullanici_Grup_id_seq"'::regclass);
 B   ALTER TABLE public."Kullanici_Grup" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    203    204    204            s           2604    16624    Kullanici_Grup_Fonksiyon id    DEFAULT     ?   ALTER TABLE ONLY public."Kullanici_Grup_Fonksiyon" ALTER COLUMN id SET DEFAULT nextval('public."Kullanici_Grup_Fonksiyon_id_seq"'::regclass);
 L   ALTER TABLE public."Kullanici_Grup_Fonksiyon" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    208    207    208            z           2604    24808    app_base_layer id    DEFAULT     v   ALTER TABLE ONLY public.app_base_layer ALTER COLUMN id SET DEFAULT nextval('public.app_base_layer_id_seq'::regclass);
 @   ALTER TABLE public.app_base_layer ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            x           2604    24779    app_language id    DEFAULT     r   ALTER TABLE ONLY public.app_language ALTER COLUMN id SET DEFAULT nextval('public.app_language_id_seq'::regclass);
 >   ALTER TABLE public.app_language ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            w           2604    16683    app_layer id    DEFAULT     l   ALTER TABLE ONLY public.app_layer ALTER COLUMN id SET DEFAULT nextval('public.app_layer_id_seq'::regclass);
 ;   ALTER TABLE public.app_layer ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            v           2604    16667    app_settings id    DEFAULT     r   ALTER TABLE ONLY public.app_settings ALTER COLUMN id SET DEFAULT nextval('public.app_settings_id_seq'::regclass);
 >   ALTER TABLE public.app_settings ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    213    214            t           2604    16632    app_user_login_logout id    DEFAULT     ?   ALTER TABLE ONLY public.app_user_login_logout ALTER COLUMN id SET DEFAULT nextval('public.app_user_login_logout_id_seq'::regclass);
 G   ALTER TABLE public.app_user_login_logout ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    209    210            u           2604    16640    app_user_setting id    DEFAULT     {   ALTER TABLE ONLY public.app_user_setting ALTER COLUMN id SET DEFAULT nextval('public.app_user_settings_id_seq'::regclass);
 B   ALTER TABLE public.app_user_setting ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    212    212                      0    16597 	   Kullanici 
   TABLE DATA           g   COPY public."Kullanici" (id, kullanici_adi, ad, soyad, tc, mail, sifre, kullanici_grup_id) FROM stdin;
    public          postgres    false    202   ki                 0    16613    Kullanici_Fonksiyon 
   TABLE DATA           d   COPY public."Kullanici_Fonksiyon" (id, fonksiyon_id, fonksiyon_adi, fonksiyon_aciklama) FROM stdin;
    public          postgres    false    206   ?i                 0    16605    Kullanici_Grup 
   TABLE DATA           Q   COPY public."Kullanici_Grup" (id, grup_id, grup_adi, silinebilir_mi) FROM stdin;
    public          postgres    false    204   ?i                 0    16621    Kullanici_Grup_Fonksiyon 
   TABLE DATA           O   COPY public."Kullanici_Grup_Fonksiyon" (id, grup_id, fonksiyon_id) FROM stdin;
    public          postgres    false    208   j                 0    16588    VersionInfo 
   TABLE DATA           N   COPY public."VersionInfo" ("Version", "AppliedOn", "Description") FROM stdin;
    public          postgres    false    200   3j       .          0    24805    app_base_layer 
   TABLE DATA           ?   COPY public.app_base_layer (id, layer_name, image_name, is_tile_server, application_type_id, directory, cross_orign, map_key, is_default_layer, sira) FROM stdin;
    public          postgres    false    223   ?j       *          0    24782    app_base_layer_language 
   TABLE DATA           \   COPY public.app_base_layer_language (id, language_id, base_layer_id, layer_tag) FROM stdin;
    public          postgres    false    219   l       )          0    24776    app_language 
   TABLE DATA           C   COPY public.app_language (id, lang_name, abbreviation) FROM stdin;
    public          postgres    false    218   m       '          0    16680 	   app_layer 
   TABLE DATA           ?   COPY public.app_layer (id, layer_name, uniq_column_name, helper_column_name, layer_image_url, is_info, layer_row, max_zoom, min_zoom, group_key, layer_service_id, default_open_close, uniq_seq_name, is_detail, controller_name, uniq_field_name) FROM stdin;
    public          postgres    false    216   Lm       %          0    16664    app_settings 
   TABLE DATA           D   COPY public.app_settings (id, name, value, extra_value) FROM stdin;
    public          postgres    false    214   im       ,          0    24797    app_type 
   TABLE DATA           6   COPY public.app_type (type_id, type_name) FROM stdin;
    public          postgres    false    221   ?m       !          0    16629    app_user_login_logout 
   TABLE DATA              COPY public.app_user_login_logout (id, user_name, login_time, logout_time, client_info, ip_address, app_type_code) FROM stdin;
    public          postgres    false    210   ?m       #          0    16637    app_user_setting 
   TABLE DATA           Q   COPY public.app_user_setting (id, zoom, center_x, center_y, user_id) FROM stdin;
    public          postgres    false    212   ?n       ?           0    0    Kullanici_Fonksiyon_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."Kullanici_Fonksiyon_id_seq"', 1, false);
          public          postgres    false    205            @           0    0    Kullanici_Grup_Fonksiyon_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public."Kullanici_Grup_Fonksiyon_id_seq"', 1, false);
          public          postgres    false    207            A           0    0    Kullanici_Grup_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."Kullanici_Grup_id_seq"', 1, false);
          public          postgres    false    203            B           0    0    Kullanici_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Kullanici_id_seq"', 1, false);
          public          postgres    false    201            C           0    0    app_base_layer_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.app_base_layer_id_seq', 1, false);
          public          postgres    false    222            D           0    0    app_language_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.app_language_id_seq', 1, false);
          public          postgres    false    217            E           0    0    app_layer_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.app_layer_id_seq', 1, false);
          public          postgres    false    215            F           0    0    app_settings_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.app_settings_id_seq', 1, false);
          public          postgres    false    213            G           0    0    app_user_login_logout_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.app_user_login_logout_id_seq', 9, true);
          public          postgres    false    209            H           0    0    app_user_settings_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.app_user_settings_id_seq', 1, false);
          public          postgres    false    211            I           0    0    app_user_type_type_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.app_user_type_type_id_seq', 1, false);
          public          postgres    false    220            }           2606    16602    Kullanici PK_Kullanici 
   CONSTRAINT     X   ALTER TABLE ONLY public."Kullanici"
    ADD CONSTRAINT "PK_Kullanici" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Kullanici" DROP CONSTRAINT "PK_Kullanici";
       public            postgres    false    202            ?           2606    16618 *   Kullanici_Fonksiyon PK_Kullanici_Fonksiyon 
   CONSTRAINT     l   ALTER TABLE ONLY public."Kullanici_Fonksiyon"
    ADD CONSTRAINT "PK_Kullanici_Fonksiyon" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public."Kullanici_Fonksiyon" DROP CONSTRAINT "PK_Kullanici_Fonksiyon";
       public            postgres    false    206                       2606    16610     Kullanici_Grup PK_Kullanici_Grup 
   CONSTRAINT     b   ALTER TABLE ONLY public."Kullanici_Grup"
    ADD CONSTRAINT "PK_Kullanici_Grup" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."Kullanici_Grup" DROP CONSTRAINT "PK_Kullanici_Grup";
       public            postgres    false    204            ?           2606    16626 4   Kullanici_Grup_Fonksiyon PK_Kullanici_Grup_Fonksiyon 
   CONSTRAINT     v   ALTER TABLE ONLY public."Kullanici_Grup_Fonksiyon"
    ADD CONSTRAINT "PK_Kullanici_Grup_Fonksiyon" PRIMARY KEY (id);
 b   ALTER TABLE ONLY public."Kullanici_Grup_Fonksiyon" DROP CONSTRAINT "PK_Kullanici_Grup_Fonksiyon";
       public            postgres    false    208            ?           2606    24813     app_base_layer PK_app_base_layer 
   CONSTRAINT     `   ALTER TABLE ONLY public.app_base_layer
    ADD CONSTRAINT "PK_app_base_layer" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.app_base_layer DROP CONSTRAINT "PK_app_base_layer";
       public            postgres    false    223            ?           2606    24789 2   app_base_layer_language PK_app_base_layer_language 
   CONSTRAINT     r   ALTER TABLE ONLY public.app_base_layer_language
    ADD CONSTRAINT "PK_app_base_layer_language" PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.app_base_layer_language DROP CONSTRAINT "PK_app_base_layer_language";
       public            postgres    false    219            ?           2606    24781    app_language PK_app_language 
   CONSTRAINT     \   ALTER TABLE ONLY public.app_language
    ADD CONSTRAINT "PK_app_language" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.app_language DROP CONSTRAINT "PK_app_language";
       public            postgres    false    218            ?           2606    16688    app_layer PK_app_layer 
   CONSTRAINT     V   ALTER TABLE ONLY public.app_layer
    ADD CONSTRAINT "PK_app_layer" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.app_layer DROP CONSTRAINT "PK_app_layer";
       public            postgres    false    216            ?           2606    16669    app_settings PK_app_settings 
   CONSTRAINT     \   ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT "PK_app_settings" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.app_settings DROP CONSTRAINT "PK_app_settings";
       public            postgres    false    214            ?           2606    16634 .   app_user_login_logout PK_app_user_login_logout 
   CONSTRAINT     n   ALTER TABLE ONLY public.app_user_login_logout
    ADD CONSTRAINT "PK_app_user_login_logout" PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.app_user_login_logout DROP CONSTRAINT "PK_app_user_login_logout";
       public            postgres    false    210            ?           2606    16642 %   app_user_setting PK_app_user_settings 
   CONSTRAINT     e   ALTER TABLE ONLY public.app_user_setting
    ADD CONSTRAINT "PK_app_user_settings" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public.app_user_setting DROP CONSTRAINT "PK_app_user_settings";
       public            postgres    false    212            ?           2606    24802    app_type PK_app_user_type 
   CONSTRAINT     ^   ALTER TABLE ONLY public.app_type
    ADD CONSTRAINT "PK_app_user_type" PRIMARY KEY (type_id);
 E   ALTER TABLE ONLY public.app_type DROP CONSTRAINT "PK_app_user_type";
       public            postgres    false    221            {           1259    16591 
   UC_Version    INDEX     R   CREATE UNIQUE INDEX "UC_Version" ON public."VersionInfo" USING btree ("Version");
     DROP INDEX public."UC_Version";
       public            postgres    false    200               Q   x?3?LJ-?K???/N?09?o? "???????˙difnljl$?,MR?R?RҒ??-,-8?b???? B ;            x?????? ? ?            x?3?4??<?-/?$39?3?+F??? H??            x?????? ? ?         d   x?M??	?0?s=EH???S??9:S?B?AHX f???C????V?T??Ǎ??I?t??.?`?y*/????M??d|Rޜ?.?y?֗t5"z S ^      .   b  x????j?0????x6Mj?vЃ?????PD??????i#M&Mŋ???ժX6?y?o??~????\???aY+??t??v?B??4???!?gd?ŀ?4?ϝ?8?|FP?A?????J?iڎ?W{?7??!?
x?|?!??Y?n6?#?в?7????????>?d?R??Z?W-n ??^0֔f׭.?O???{,???7¿ k_?#*??3%L?Oe????ed CB$p?GvS??Kq[*?R????8?~i%KL??????6e?զ??x?)??]??ȑ?1*ɑ5T???a?wX2)X>u??)Ag?J?4?A.onyIs?#`1?vۅ?mc?$:??8ouGc?!??N-,;      *   ?   x?m?=n1?k?)8AČ??P?$?)͒X?Zk??Xn?8Xf???\???{??
?-|q?|??g@TԂm]>:@a????O>j-?2??	?? ?́?O?qd???GW???=;?9?~??Z??Q!5f`@??yT Q@;r q?X? ? ??ey??%??Q?,*ڴ4m?G??b???7?y??Z?z???+??Тe??5?p????z-b?>J>N??' ?w?      )   .   x?3?9??(???TΒ"ݐ .#N׼??????<??`?=... ??      '      x?????? ? ?      %      x?????? ? ?      ,   1   x?3?tI-?.?/?2?OM?2?tL????2?J-?/*??K?????? ??Z      !     x??ӱNA???)???ٝ?ݝ?R51????C?x???a???=??@˵f?Ō?֩ݖj??Sf????1Z?!j?UF?uV,???1?m??n??}j#̛类?	+???ھt9,??Q????)|9;??ݮN???U&???`v??????6	n?????[ۼ??X??:t?ix*_˶??:XLNg??A	???ܞ?K??ٓc??8???LJ?2??펺=h???"DrI??
???z?ɑ??(????l???Y8??$.p??rNI+????Py?? ???      #      x?????? ? ?     