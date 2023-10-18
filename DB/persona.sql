/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 150003 (150003)
 Source Host           : 173.212.203.210:5432
 Source Catalog        : db_registro
 Source Schema         : persona

 Target Server Type    : PostgreSQL
 Target Server Version : 150003 (150003)
 File Encoding         : 65001

 Date: 15/10/2023 18:58:43
*/


-- ----------------------------
-- Sequence structure for tabla_id_ejemplo_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "persona"."tabla_id_ejemplo_seq";
CREATE SEQUENCE "persona"."tabla_id_ejemplo_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for persona
-- ----------------------------
DROP TABLE IF EXISTS "persona"."persona";
CREATE TABLE "persona"."persona" (
  "id_persona" int4 NOT NULL DEFAULT nextval('"persona".tabla_id_ejemplo_seq'::regclass),
  "cedula_identidad" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "nombres" varchar(255) COLLATE "pg_catalog"."default",
  "apellidos" varchar(255) COLLATE "pg_catalog"."default",
  "celular" int4,
  "fecha_nacimiento" date
)
;

-- ----------------------------
-- Records of persona
-- ----------------------------
INSERT INTO "persona"."persona" VALUES (1, '6951939', 'Carlos', 'Macuchapi', 73019292, '1992-08-18');
INSERT INTO "persona"."persona" VALUES (2, '5959919', 'Ana', 'Perez', 75929122, '2009-06-28');
INSERT INTO "persona"."persona" VALUES (3, '5918181', 'Juan', 'Quispe', 69884181, '1992-05-05');
INSERT INTO "persona"."persona" VALUES (81, '64946464', 'Carlos', 'Estrada', 764946494, '2023-08-29');
INSERT INTO "persona"."persona" VALUES (82, '5184649', 'Juana ', 'Mamani', 73494949, '2023-08-29');
INSERT INTO "persona"."persona" VALUES (83, '4958761', 'Oscar', 'Perez', 67412369, '2023-08-17');
INSERT INTO "persona"."persona" VALUES (47, '6951939', 'Carlos ', 'Macuchapi ', 73019056, '1992-08-18');
INSERT INTO "persona"."persona" VALUES (48, '6319494', 'Janeth', 'Luna', 76494649, '1989-08-15');
INSERT INTO "persona"."persona" VALUES (49, '46497649', 'Nataly', 'Zapata', 76494949, '1997-06-14');
INSERT INTO "persona"."persona" VALUES (80, '64949494', 'Alex', 'Quispe', 73059865, '1993-08-18');

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "persona"."tabla_id_ejemplo_seq"
OWNED BY "persona"."persona"."id_persona";
SELECT setval('"persona"."tabla_id_ejemplo_seq"', 83, true);

-- ----------------------------
-- Primary Key structure for table persona
-- ----------------------------
ALTER TABLE "persona"."persona" ADD CONSTRAINT "tabla_pkey" PRIMARY KEY ("id_persona");
