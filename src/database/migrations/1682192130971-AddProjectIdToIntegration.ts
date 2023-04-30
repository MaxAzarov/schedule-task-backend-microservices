import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectIdToIntegration1682192130971
  implements MigrationInterface
{
  name = 'AddProjectIdToIntegration1682192130971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration"
            ADD "projectId" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration" DROP COLUMN "projectId"
        `);
  }
}
