import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSelfAssignableRoleTable1548886658227 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "guild_self_assignable_role" ("id" SERIAL NOT NULL, "roleId" character varying NOT NULL, "guildId" character varying, CONSTRAINT "PK_b5634eb63ec63a971374d97cb5f" PRIMARY KEY ("id"))`)
    await queryRunner.query(`ALTER TABLE "guild_self_assignable_role" ADD CONSTRAINT "FK_b3ebc20d45cba1e3da18b003740" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "guild_self_assignable_role" DROP CONSTRAINT "FK_b3ebc20d45cba1e3da18b003740"`)
    await queryRunner.query(`DROP TABLE "guild_self_assignable_role"`)
  }
}
