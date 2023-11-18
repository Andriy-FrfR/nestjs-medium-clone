import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserFollowsTable1700269168129 implements MigrationInterface {
  name = 'CreateUserFollowsTable1700269168129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_following_users" ("followingUserId" integer NOT NULL, "followedUserId" integer NOT NULL, CONSTRAINT "PK_f481213f6840d2ee4470b99a6a9" PRIMARY KEY ("followingUserId", "followedUserId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b191256060c3b1fea24c848b1a" ON "users_following_users" ("followingUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b8549e158efea330f12bf40da" ON "users_following_users" ("followedUserId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_following_users" ADD CONSTRAINT "FK_b191256060c3b1fea24c848b1a6" FOREIGN KEY ("followingUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_following_users" ADD CONSTRAINT "FK_4b8549e158efea330f12bf40da9" FOREIGN KEY ("followedUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_following_users" DROP CONSTRAINT "FK_4b8549e158efea330f12bf40da9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_following_users" DROP CONSTRAINT "FK_b191256060c3b1fea24c848b1a6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b8549e158efea330f12bf40da"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b191256060c3b1fea24c848b1a"`,
    );
    await queryRunner.query(`DROP TABLE "users_following_users"`);
  }
}
