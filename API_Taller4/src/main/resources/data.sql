INSERT INTO public."roles" VALUES ('SUDO','sysadmin') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";
INSERT INTO public."roles" VALUES ('ASST','assistant') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";
INSERT INTO public."roles" VALUES ('PCNT','patient') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";
INSERT INTO public."roles" VALUES ('DCTR','doctor') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";

