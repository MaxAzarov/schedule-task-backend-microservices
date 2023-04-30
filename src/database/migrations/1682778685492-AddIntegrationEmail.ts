import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegrationEmail1682778685492 implements MigrationInterface {
  name = 'AddIntegrationEmail1682778685492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration"
            ADD "email" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration" DROP COLUMN "email"
        `);
  }
}
