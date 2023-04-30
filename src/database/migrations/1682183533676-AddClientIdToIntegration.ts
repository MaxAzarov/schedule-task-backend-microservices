import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientIdToIntegration1682183533676
  implements MigrationInterface
{
  name = 'AddClientIdToIntegration1682183533676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration"
            ADD "clientId" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration" DROP COLUMN "clientId"
        `);
  }
}
