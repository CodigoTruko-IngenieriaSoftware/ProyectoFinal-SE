INSERT INTO public."roles" VALUES ('SUDO','sysadmin') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";
INSERT INTO public."roles" VALUES ('LBRN','librarian') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";
INSERT INTO public."roles" VALUES ('USER','user') ON CONFLICT("id") DO UPDATE SET "name" = excluded."name";
