import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegration1682019881239 implements MigrationInterface {
  name = 'AddIntegration1682019881239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."integration_type_enum" AS ENUM('jira', 'trello')
        `);
    await queryRunner.query(`
            CREATE TABLE "integration" (
                "id" SERIAL NOT NULL,
                "type" "public"."integration_type_enum" NOT NULL,
                "userId" integer NOT NULL,
                "accessToken" character varying NOT NULL,
                "refreshToken" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "UQ_d25268dc032406bd6f41c3ab6ea" UNIQUE ("type", "userId"),
                CONSTRAINT "PK_f348d4694945d9dc4c7049a178a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "integration"
            ADD CONSTRAINT "FK_e38baca49ddff880b963fcb5d08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "integration" DROP CONSTRAINT "FK_e38baca49ddff880b963fcb5d08"
        `);
    await queryRunner.query(`
            DROP TABLE "integration"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."integration_type_enum"
        `);
  }
}
