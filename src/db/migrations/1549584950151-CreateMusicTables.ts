import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMusicTables1549584950151 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "song" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "userId" character varying NOT NULL, "guildId" character varying, CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`)
    await queryRunner.query(`CREATE INDEX "IDX_1cf2820b0e3f5962ee67ec1915" ON "song" ("userId")`)
    await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "FK_25f7fb284bdfdbb1f6f55ad5074" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`)
  }

  public async down(_queryRunner: QueryRunner): Promise<any> {
      // No down
  }
}
