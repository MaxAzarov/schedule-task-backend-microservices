import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventTitle1683138006900 implements MigrationInterface {
  name = 'AddEventTitle1683138006900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "event"
            ADD "title" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "event" DROP CONSTRAINT "FK_01cd2b829e0263917bf570cb672"
        `);
    await queryRunner.query(`
            ALTER TABLE "event"
            ALTER COLUMN "userId"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "event"
            ADD CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "event" DROP CONSTRAINT "FK_01cd2b829e0263917bf570cb672"
        `);
    await queryRunner.query(`
            ALTER TABLE "event"
            ALTER COLUMN "userId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "event"
            ADD CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "event" DROP COLUMN "title"
        `);
  }
}
