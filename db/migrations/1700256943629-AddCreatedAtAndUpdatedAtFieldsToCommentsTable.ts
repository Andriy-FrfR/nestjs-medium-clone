import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtAndUpdatedAtFieldsToCommentsTable1700256943629
  implements MigrationInterface
{
  name = 'AddCreatedAtAndUpdatedAtFieldsToCommentsTable1700256943629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdAt"`);
  }
}
