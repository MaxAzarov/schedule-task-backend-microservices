import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnstoIntegration1682705325244
  implements MigrationInterface
{
  name = 'AddColumnstoIntegration1682705325244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration"
            ADD "todoColumnId" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "integration"
            ADD "readyColumnId" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration" DROP COLUMN "readyColumnId"
        `);
    await queryRunner.query(`
            ALTER TABLE "integration" DROP COLUMN "todoColumnId"
        `);
  }
}
