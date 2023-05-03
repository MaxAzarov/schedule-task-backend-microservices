import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventTable1683135171359 implements MigrationInterface {
  name = 'AddEventTable1683135171359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "event" (
                "id" SERIAL NOT NULL,
                "start" TIMESTAMP NOT NULL,
                "end" TIMESTAMP NOT NULL,
                "resource" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "userId" integer,
                CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
            )
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
            DROP TABLE "event"
        `);
  }
}
