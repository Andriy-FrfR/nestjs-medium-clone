import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsTable1700538026530 implements MigrationInterface {
  name = 'AddTagsTable1700538026530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "articles_tags_tags" ("articleId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_8496ea51ebd3ac3215b90fbabdc" PRIMARY KEY ("articleId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb78d851fe59ee8cfbe22b997c" ON "articles_tags_tags" ("articleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3f09559040c233b2cc41c72a49" ON "articles_tags_tags" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" ADD CONSTRAINT "FK_eb78d851fe59ee8cfbe22b997cd" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" ADD CONSTRAINT "FK_3f09559040c233b2cc41c72a496" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" DROP CONSTRAINT "FK_3f09559040c233b2cc41c72a496"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" DROP CONSTRAINT "FK_eb78d851fe59ee8cfbe22b997cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f09559040c233b2cc41c72a49"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb78d851fe59ee8cfbe22b997c"`,
    );
    await queryRunner.query(`DROP TABLE "articles_tags_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
