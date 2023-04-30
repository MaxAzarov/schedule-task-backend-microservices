import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIntegration1682238469014 implements MigrationInterface {
  name = 'UpdateIntegration1682238469014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration"
            ALTER COLUMN "projectId" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration"
            ALTER COLUMN "projectId"
            SET NOT NULL
        `);
  }
}
