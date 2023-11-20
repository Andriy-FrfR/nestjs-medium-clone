import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoritesTable1700450732994 implements MigrationInterface {
  name = 'CreateFavoritesTable1700450732994';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "articles_favorited_by_users" ("articlesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_36a2163f84702d7cab7899c3a64" PRIMARY KEY ("articlesId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a4edf351aa152ef0143a6d22c5" ON "articles_favorited_by_users" ("articlesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be5e80e58412ae12f710f85678" ON "articles_favorited_by_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "articles_favorited_by_users" ADD CONSTRAINT "FK_a4edf351aa152ef0143a6d22c5b" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles_favorited_by_users" ADD CONSTRAINT "FK_be5e80e58412ae12f710f856782" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles_favorited_by_users" DROP CONSTRAINT "FK_be5e80e58412ae12f710f856782"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles_favorited_by_users" DROP CONSTRAINT "FK_a4edf351aa152ef0143a6d22c5b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_be5e80e58412ae12f710f85678"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4edf351aa152ef0143a6d22c5"`,
    );
    await queryRunner.query(`DROP TABLE "articles_favorited_by_users"`);
  }
}
