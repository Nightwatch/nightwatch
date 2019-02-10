import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1548891086971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "avatarUrl" character varying, "dateCreated" TIMESTAMP NOT NULL, "dateLastMessage" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_settings" ("id" SERIAL NOT NULL, "levelsEnabled" boolean NOT NULL, "directMessagesEnabled" boolean NOT NULL, "userId" character varying, CONSTRAINT "REL_986a2b6d3c05eb4091bb8066f7" UNIQUE ("userId"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_986a2b6d3c05eb4091bb8066f7" ON "user_settings" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_verification" ("id" SERIAL NOT NULL, "verified" boolean NOT NULL, "verificationToken" character varying, "userId" character varying, CONSTRAINT "REL_b98835ab0c83f27ff7c4c7de3d" UNIQUE ("userId"), CONSTRAINT "PK_679edeb6fcfcbc4c094573e27e7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b98835ab0c83f27ff7c4c7de3d" ON "user_verification" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_level" ("id" SERIAL NOT NULL, "xp" integer NOT NULL, "level" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL, "userId" character varying, CONSTRAINT "REL_d5fd95368e5ce39ff4baa96446" UNIQUE ("userId"), CONSTRAINT "PK_d33d938ab8244a12eccac00edd2" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d5fd95368e5ce39ff4baa96446" ON "user_level" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_referral" ("id" SERIAL NOT NULL, "dateUsed" TIMESTAMP NOT NULL, "userId" character varying, "referralId" integer, CONSTRAINT "PK_6ae3fd2cc21b481dabc7735016f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_balance" ("id" SERIAL NOT NULL, "netWorth" integer NOT NULL, "balance" integer NOT NULL, "dateLastClaimedDailies" TIMESTAMP, "userId" character varying, CONSTRAINT "REL_4cac061e709256ecb43cc39d3f" UNIQUE ("userId"), CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4cac061e709256ecb43cc39d3f" ON "user_balance" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "bio" character varying NOT NULL, "background" character varying NOT NULL, "userId" character varying, CONSTRAINT "REL_51cb79b5555effaf7d69ba1cff" UNIQUE ("userId"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_51cb79b5555effaf7d69ba1cff" ON "user_profile" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_reputation" ("id" SERIAL NOT NULL, "reputation" integer NOT NULL, "userId" character varying, CONSTRAINT "REL_315eba59de6157f1ffff3c83ca" UNIQUE ("userId"), CONSTRAINT "PK_ec14681fc369ab917c73b7bc3cf" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_315eba59de6157f1ffff3c83ca" ON "user_reputation" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_friend_request" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "senderId" character varying, "receiverId" character varying, CONSTRAINT "PK_f013fa5c9f6c02f00163a635ed9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2dc2772e03e2384282f0a8d230" ON "user_friend_request" ("senderId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0296ec78335b6da1d39304a5c1" ON "user_friend_request" ("receiverId") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a7e866fab73655d9206eab9667" ON "user_friend_request" ("senderId", "receiverId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_friend" ("dateAdded" TIMESTAMP NOT NULL, "id" SERIAL NOT NULL, "userId" character varying, "friendId" character varying, CONSTRAINT "PK_2c6e15dda4790a316501bd89bee" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6b8a8ff21cb7439e8eb12cb75a" ON "user_friend" ("userId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5b823df6e9a0737aa618592383" ON "user_friend" ("friendId") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_55b8464e039467430750cb3921" ON "user_friend" ("userId", "friendId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_background" ("id" SERIAL NOT NULL, "datetime" TIMESTAMP NOT NULL, "userId" character varying, "backgroundId" integer, CONSTRAINT "PK_6d5d914027f7b34bbe272ad808d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8c89c1cc19a0bc780556a5f3fa" ON "user_background" ("userId", "backgroundId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_badge" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "x" integer NOT NULL, "y" integer NOT NULL, "userId" character varying, "badgeId" integer, CONSTRAINT "PK_c5db2542e028558c5306c9d7f42" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ddbf1063a9d50fc27e44401e7f" ON "user_badge" ("x", "y", "userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "user_perk" ("id" SERIAL NOT NULL, "perkId" integer, "userId" character varying, CONSTRAINT "PK_f7c3b2df815d57eb21d9b1be0b8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_125788470f4385bc27e0a3c593" ON "user_perk" ("perkId", "userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "guild" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "dateCreated" TIMESTAMP NOT NULL, CONSTRAINT "PK_cfbbd0a2805cab7053b516068a3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "guild_settings" ("id" SERIAL NOT NULL, "levelsEnabled" boolean NOT NULL, "directMessagesEnabled" boolean NOT NULL, "welcomeMessagesEnabled" boolean NOT NULL, "leaveMessagesEnabled" boolean NOT NULL, "welcomeMessage" character varying, "leaveMessage" character varying, "joinLeaveNotificationChannelId" character varying, "autoAssignRole" boolean NOT NULL, "autoAssignRoleId" character varying, "prefix" character varying(32), "guildId" character varying, CONSTRAINT "REL_432a30e6ec70f4096d9b696088" UNIQUE ("guildId"), CONSTRAINT "PK_259bd839beb2830fe5c2ddd2ff5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_432a30e6ec70f4096d9b696088" ON "guild_settings" ("guildId") `
    )
    await queryRunner.query(
      `CREATE TABLE "guild_suggestion" ("id" SERIAL NOT NULL, "color" character varying NOT NULL, "description" character varying NOT NULL, "messageId" character varying NOT NULL, "userId" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "likes" integer NOT NULL, "dislikes" integer NOT NULL, "guildId" character varying, CONSTRAINT "PK_1755c856332967f3afd8d9ac7e8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "guild_support_ticket" ("id" SERIAL NOT NULL, "messageId" character varying NOT NULL, "type" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "dateClosed" TIMESTAMP, "dateCreated" TIMESTAMP NOT NULL, "color" character varying NOT NULL, "title" character varying NOT NULL, "userId" character varying NOT NULL, "closedUserId" character varying NOT NULL, "closedReason" character varying, "guildId" character varying, CONSTRAINT "PK_7e42f170306b017996f92714f9d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "guild_user" ("id" SERIAL NOT NULL, "nickname" character varying(100) NOT NULL, "dateJoined" TIMESTAMP NOT NULL, "dateLastMessage" TIMESTAMP, "userId" character varying, "guildId" character varying, CONSTRAINT "PK_5657668761cb02b441bb17103b5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "guild_user_ban" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "reason" character varying NOT NULL, "length" character varying(10), "issuerId" integer, "userId" integer, CONSTRAINT "PK_97b29920e7e8af0883e738ac783" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a44b0cc6ca998381bdd9f12104" ON "guild_user_ban" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "guild_user_kick" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "reason" character varying NOT NULL, "issuerId" integer, "userId" integer, CONSTRAINT "PK_0566aa96616e7d463a9721454f7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b5bbb9bf45764f05261801d342" ON "guild_user_kick" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "guild_user_warning" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "reason" character varying NOT NULL, "issuerId" integer, "userId" integer, CONSTRAINT "PK_d13eda01bc36a2987d2b4ba25dc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b6e55a0382f08de86411cbaad9" ON "guild_user_warning" ("userId") `
    )
    await queryRunner.query(
      `CREATE TABLE "guild_perk" ("id" SERIAL NOT NULL, "perkId" integer, "guildId" character varying, CONSTRAINT "PK_df2d58433d611561e693fbfdd7e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e36cc493b9bd2b5348a0bd2f78" ON "guild_perk" ("guildId", "perkId") `
    )
    await queryRunner.query(
      `CREATE TABLE "guild_self_assignable_role" ("id" SERIAL NOT NULL, "roleId" character varying NOT NULL, "guildId" character varying, CONSTRAINT "PK_b5634eb63ec63a971374d97cb5f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "referral" ("id" integer NOT NULL, "inviteUrl" character varying NOT NULL, "joinCount" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "userId" character varying, "guildId" character varying, CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "referral_role" ("id" SERIAL NOT NULL, "members" integer NOT NULL, "roleId" character varying NOT NULL, "referralId" integer, CONSTRAINT "REL_ca25e961a93b0bc93eb043e88f" UNIQUE ("referralId"), CONSTRAINT "PK_6f05f9b90ea78c5623b9d9a8733" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ca25e961a93b0bc93eb043e88f" ON "referral_role" ("referralId") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_75f40b79e07fc4d997cf304846" ON "referral_role" ("roleId") `
    )
    await queryRunner.query(
      `CREATE TABLE "referral_reward" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "referralsNeeded" integer NOT NULL, CONSTRAINT "PK_039e9361b7ea8c9a9e500ee6e1e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "referral_unlocked_reward" ("id" SERIAL NOT NULL, "dateUnlocked" TIMESTAMP NOT NULL, "rewardId" integer, "referralId" integer, CONSTRAINT "PK_0809a7ae8bc4b67e5f9d7e10886" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "background" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "url" character varying NOT NULL, "filePath" character varying NOT NULL, "likes" integer NOT NULL, "purchases" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL, "typeId" integer, CONSTRAINT "PK_7271b4d2e4bd0f68b3fdb5c090a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_301cedecc8682ab08f43b96451" ON "background" ("name") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5743761263d730589d369964d3" ON "background" ("url") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_09d47307ca46221cbf16a1d70c" ON "background" ("filePath") `
    )
    await queryRunner.query(
      `CREATE TABLE "background_type" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_5925e69d1af02792a769731d9a1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_eda2229e6b9769bc0993e9ee6a" ON "background_type" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_23c05c292c439d77b0de816b50" ON "category" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "badge" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "price" integer NOT NULL, "url" character varying NOT NULL, "filePath" character varying NOT NULL, "likes" integer NOT NULL, "purchases" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_76b7011c864d4521a14a5196c49" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_35ed068bad78456ff543323916" ON "badge" ("name") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0137fe7ba5244db3a7d2e7277d" ON "badge" ("url") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7bc2db9af731e06b6a111618b5" ON "badge" ("filePath") `
    )
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6a9775008add570dc3e5a0bab7" ON "tag" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "badge_category" ("id" SERIAL NOT NULL, "badgeId" integer, "categoryId" integer, CONSTRAINT "PK_f52cbe9f31a2693ac54c635acbb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6d47adfe172a61eecfa6e587b1" ON "badge_category" ("badgeId", "categoryId") `
    )
    await queryRunner.query(
      `CREATE TABLE "badge_tag" ("id" SERIAL NOT NULL, "badgeId" integer, "tagId" integer, CONSTRAINT "PK_895c31648b7c562f12c34134ac3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_29fc64f9f55853f11bd67d0b18" ON "badge_tag" ("badgeId", "tagId") `
    )
    await queryRunner.query(
      `CREATE TABLE "background_category" ("id" SERIAL NOT NULL, "backgroundId" integer, "categoryId" integer, CONSTRAINT "PK_6fd337ab4a675b4418d96a1b78a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_01524a475d9ece638caa46ae72" ON "background_category" ("backgroundId", "categoryId") `
    )
    await queryRunner.query(
      `CREATE TABLE "background_tag" ("id" SERIAL NOT NULL, "backgroundId" integer, "tagId" integer, CONSTRAINT "PK_d47da20eadc21515c3a6eb6d92a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_42c401ad4352310cfc64b91b62" ON "background_tag" ("backgroundId", "tagId") `
    )
    await queryRunner.query(
      `CREATE TABLE "perk" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "duration" character varying, "typeId" integer, CONSTRAINT "PK_4311750adf0a905f585e75176e4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e6e580c3461b79c3ec4d6774d5" ON "perk" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "perk_type" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_806c58a50b31c1b3970e60afda3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0e092abd83f1b90c857c0780f5" ON "perk_type" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "giveaway" ("id" SERIAL NOT NULL, "dateEnd" TIMESTAMP NOT NULL, "dateStart" TIMESTAMP NOT NULL, "active" boolean NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "ownerId" character varying, "guildId" character varying, CONSTRAINT "PK_fdbebb79a049e10c16e3df5d447" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "giveaway_item_key" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "giveawayItemId" integer, "giveawayId" integer, CONSTRAINT "REL_66d146bf8596dcf8cf9d1d55cf" UNIQUE ("giveawayItemId"), CONSTRAINT "REL_82432e7a3e4062edd8b738fe4a" UNIQUE ("giveawayId"), CONSTRAINT "PK_4fd0b10122739ef2bafe7f59fa6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e2e6a6b11f9536e4c686eaa348" ON "giveaway_item_key" ("key") `
    )
    await queryRunner.query(
      `CREATE TABLE "giveaway_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "giveawayId" integer, CONSTRAINT "PK_956053c89917b4c1a90cfcd1fcb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "giveaway_entry" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "userId" character varying, "giveawayId" integer, CONSTRAINT "PK_499f9b1b6762095c80f1b5f76b7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "FK_b98835ab0c83f27ff7c4c7de3db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_level" ADD CONSTRAINT "FK_d5fd95368e5ce39ff4baa96446a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_referral" ADD CONSTRAINT "FK_9d444b1e7ef029f8264439062b3" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_referral" ADD CONSTRAINT "FK_e9ac79c4cb0666be9212031ddb4" FOREIGN KEY ("referralId") REFERENCES "referral"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_balance" ADD CONSTRAINT "FK_4cac061e709256ecb43cc39d3f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "FK_51cb79b5555effaf7d69ba1cff9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_reputation" ADD CONSTRAINT "FK_315eba59de6157f1ffff3c83cae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "FK_2dc2772e03e2384282f0a8d2302" FOREIGN KEY ("senderId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "FK_0296ec78335b6da1d39304a5c16" FOREIGN KEY ("receiverId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend" ADD CONSTRAINT "FK_6b8a8ff21cb7439e8eb12cb75ae" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend" ADD CONSTRAINT "FK_5b823df6e9a0737aa6185923837" FOREIGN KEY ("friendId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_background" ADD CONSTRAINT "FK_075aae701c8c78eb3184756ff7a" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_background" ADD CONSTRAINT "FK_b5fa3cbfd450cf21dbfcd7c730e" FOREIGN KEY ("backgroundId") REFERENCES "background"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_badge" ADD CONSTRAINT "FK_dc6bb11dce7a0a591b5cae0af25" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_badge" ADD CONSTRAINT "FK_8a49533f303db990198b8c9ddf7" FOREIGN KEY ("badgeId") REFERENCES "badge"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_perk" ADD CONSTRAINT "FK_d068771ac414a9917a9238599f2" FOREIGN KEY ("perkId") REFERENCES "perk"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "user_perk" ADD CONSTRAINT "FK_1f3f4ac8cf30f6f8e11cde43215" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_settings" ADD CONSTRAINT "FK_432a30e6ec70f4096d9b6960888" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_suggestion" ADD CONSTRAINT "FK_dd1e07ffbefb468d026722922d9" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_support_ticket" ADD CONSTRAINT "FK_8ab5ff37de4ab7a0047e67921f6" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user" ADD CONSTRAINT "FK_9f216372d4949e76f35b19b9992" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user" ADD CONSTRAINT "FK_3d4b74637f0c0c6b52d740a80d2" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_ban" ADD CONSTRAINT "FK_bac49882e8e51b3ba65c88baaff" FOREIGN KEY ("issuerId") REFERENCES "guild_user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_ban" ADD CONSTRAINT "FK_a44b0cc6ca998381bdd9f121042" FOREIGN KEY ("userId") REFERENCES "guild_user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_kick" ADD CONSTRAINT "FK_71a4d2611d2cbb3a627819f49cc" FOREIGN KEY ("issuerId") REFERENCES "guild_user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_kick" ADD CONSTRAINT "FK_b5bbb9bf45764f05261801d3426" FOREIGN KEY ("userId") REFERENCES "guild_user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_warning" ADD CONSTRAINT "FK_054cbbd580ed8a029799f0e235f" FOREIGN KEY ("issuerId") REFERENCES "guild_user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_warning" ADD CONSTRAINT "FK_b6e55a0382f08de86411cbaad9b" FOREIGN KEY ("userId") REFERENCES "guild_user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_perk" ADD CONSTRAINT "FK_38558e3586032fecf7fd18a1052" FOREIGN KEY ("perkId") REFERENCES "perk"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_perk" ADD CONSTRAINT "FK_e3f01176e0fccfe397add55a58e" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_self_assignable_role" ADD CONSTRAINT "FK_b3ebc20d45cba1e3da18b003740" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "referral" ADD CONSTRAINT "FK_1fbffba89b7ed9ca14a5b750240" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "referral" ADD CONSTRAINT "FK_47d07faee4001f6827fbea37bb6" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "referral_role" ADD CONSTRAINT "FK_ca25e961a93b0bc93eb043e88fb" FOREIGN KEY ("referralId") REFERENCES "referral"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "referral_unlocked_reward" ADD CONSTRAINT "FK_1750d94fcdd4d26bf9699199ddf" FOREIGN KEY ("rewardId") REFERENCES "referral_reward"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "referral_unlocked_reward" ADD CONSTRAINT "FK_bb1e7cc1d12d3a0ddf0e11eef24" FOREIGN KEY ("referralId") REFERENCES "referral"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "background" ADD CONSTRAINT "FK_896a197e3b754f633b7d3f7c370" FOREIGN KEY ("typeId") REFERENCES "background_type"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_category" ADD CONSTRAINT "FK_bf88678864e34ff6f95aa5a16b5" FOREIGN KEY ("badgeId") REFERENCES "badge"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_category" ADD CONSTRAINT "FK_3906c3dc0eaaa9d77058f23ad21" FOREIGN KEY ("categoryId") REFERENCES "category"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_tag" ADD CONSTRAINT "FK_0d9843d9d11aef54abf35fbc989" FOREIGN KEY ("badgeId") REFERENCES "badge"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_tag" ADD CONSTRAINT "FK_13eb7d7291cf91055e44113f36f" FOREIGN KEY ("tagId") REFERENCES "tag"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "background_category" ADD CONSTRAINT "FK_3f40fe04fa5659236d40b130359" FOREIGN KEY ("backgroundId") REFERENCES "background"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "background_category" ADD CONSTRAINT "FK_2648f0782cded852c2dfce28d20" FOREIGN KEY ("categoryId") REFERENCES "category"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "background_tag" ADD CONSTRAINT "FK_f1c30e4547b81147749ff79b02a" FOREIGN KEY ("backgroundId") REFERENCES "background"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "background_tag" ADD CONSTRAINT "FK_c3078aeeba4d8a92cfc6eb138c9" FOREIGN KEY ("tagId") REFERENCES "tag"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "perk" ADD CONSTRAINT "FK_e4b0ae0002c8285da9a66b4f98b" FOREIGN KEY ("typeId") REFERENCES "perk_type"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway" ADD CONSTRAINT "FK_5d4d7b8703e62da624612fb6925" FOREIGN KEY ("ownerId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway" ADD CONSTRAINT "FK_dab2ba3782dcfefada153cb92ea" FOREIGN KEY ("guildId") REFERENCES "guild"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_item_key" ADD CONSTRAINT "FK_66d146bf8596dcf8cf9d1d55cf7" FOREIGN KEY ("giveawayItemId") REFERENCES "giveaway_item"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_item_key" ADD CONSTRAINT "FK_82432e7a3e4062edd8b738fe4a6" FOREIGN KEY ("giveawayId") REFERENCES "giveaway"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_item" ADD CONSTRAINT "FK_3bf029cfa0bbb04b8a9f92644f4" FOREIGN KEY ("giveawayId") REFERENCES "giveaway"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_entry" ADD CONSTRAINT "FK_a6f6503a84292ec33522095fe56" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_entry" ADD CONSTRAINT "FK_aaae4a35954e3abf988b5dcf871" FOREIGN KEY ("giveawayId") REFERENCES "giveaway"("id")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "giveaway_entry" DROP CONSTRAINT "FK_aaae4a35954e3abf988b5dcf871"`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_entry" DROP CONSTRAINT "FK_a6f6503a84292ec33522095fe56"`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_item" DROP CONSTRAINT "FK_3bf029cfa0bbb04b8a9f92644f4"`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_item_key" DROP CONSTRAINT "FK_82432e7a3e4062edd8b738fe4a6"`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway_item_key" DROP CONSTRAINT "FK_66d146bf8596dcf8cf9d1d55cf7"`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway" DROP CONSTRAINT "FK_dab2ba3782dcfefada153cb92ea"`
    )
    await queryRunner.query(
      `ALTER TABLE "giveaway" DROP CONSTRAINT "FK_5d4d7b8703e62da624612fb6925"`
    )
    await queryRunner.query(
      `ALTER TABLE "perk" DROP CONSTRAINT "FK_e4b0ae0002c8285da9a66b4f98b"`
    )
    await queryRunner.query(
      `ALTER TABLE "background_tag" DROP CONSTRAINT "FK_c3078aeeba4d8a92cfc6eb138c9"`
    )
    await queryRunner.query(
      `ALTER TABLE "background_tag" DROP CONSTRAINT "FK_f1c30e4547b81147749ff79b02a"`
    )
    await queryRunner.query(
      `ALTER TABLE "background_category" DROP CONSTRAINT "FK_2648f0782cded852c2dfce28d20"`
    )
    await queryRunner.query(
      `ALTER TABLE "background_category" DROP CONSTRAINT "FK_3f40fe04fa5659236d40b130359"`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_tag" DROP CONSTRAINT "FK_13eb7d7291cf91055e44113f36f"`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_tag" DROP CONSTRAINT "FK_0d9843d9d11aef54abf35fbc989"`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_category" DROP CONSTRAINT "FK_3906c3dc0eaaa9d77058f23ad21"`
    )
    await queryRunner.query(
      `ALTER TABLE "badge_category" DROP CONSTRAINT "FK_bf88678864e34ff6f95aa5a16b5"`
    )
    await queryRunner.query(
      `ALTER TABLE "background" DROP CONSTRAINT "FK_896a197e3b754f633b7d3f7c370"`
    )
    await queryRunner.query(
      `ALTER TABLE "referral_unlocked_reward" DROP CONSTRAINT "FK_bb1e7cc1d12d3a0ddf0e11eef24"`
    )
    await queryRunner.query(
      `ALTER TABLE "referral_unlocked_reward" DROP CONSTRAINT "FK_1750d94fcdd4d26bf9699199ddf"`
    )
    await queryRunner.query(
      `ALTER TABLE "referral_role" DROP CONSTRAINT "FK_ca25e961a93b0bc93eb043e88fb"`
    )
    await queryRunner.query(
      `ALTER TABLE "referral" DROP CONSTRAINT "FK_47d07faee4001f6827fbea37bb6"`
    )
    await queryRunner.query(
      `ALTER TABLE "referral" DROP CONSTRAINT "FK_1fbffba89b7ed9ca14a5b750240"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_self_assignable_role" DROP CONSTRAINT "FK_b3ebc20d45cba1e3da18b003740"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_perk" DROP CONSTRAINT "FK_e3f01176e0fccfe397add55a58e"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_perk" DROP CONSTRAINT "FK_38558e3586032fecf7fd18a1052"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_warning" DROP CONSTRAINT "FK_b6e55a0382f08de86411cbaad9b"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_warning" DROP CONSTRAINT "FK_054cbbd580ed8a029799f0e235f"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_kick" DROP CONSTRAINT "FK_b5bbb9bf45764f05261801d3426"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_kick" DROP CONSTRAINT "FK_71a4d2611d2cbb3a627819f49cc"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_ban" DROP CONSTRAINT "FK_a44b0cc6ca998381bdd9f121042"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user_ban" DROP CONSTRAINT "FK_bac49882e8e51b3ba65c88baaff"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user" DROP CONSTRAINT "FK_3d4b74637f0c0c6b52d740a80d2"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_user" DROP CONSTRAINT "FK_9f216372d4949e76f35b19b9992"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_support_ticket" DROP CONSTRAINT "FK_8ab5ff37de4ab7a0047e67921f6"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_suggestion" DROP CONSTRAINT "FK_dd1e07ffbefb468d026722922d9"`
    )
    await queryRunner.query(
      `ALTER TABLE "guild_settings" DROP CONSTRAINT "FK_432a30e6ec70f4096d9b6960888"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_perk" DROP CONSTRAINT "FK_1f3f4ac8cf30f6f8e11cde43215"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_perk" DROP CONSTRAINT "FK_d068771ac414a9917a9238599f2"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_badge" DROP CONSTRAINT "FK_8a49533f303db990198b8c9ddf7"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_badge" DROP CONSTRAINT "FK_dc6bb11dce7a0a591b5cae0af25"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_background" DROP CONSTRAINT "FK_b5fa3cbfd450cf21dbfcd7c730e"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_background" DROP CONSTRAINT "FK_075aae701c8c78eb3184756ff7a"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend" DROP CONSTRAINT "FK_5b823df6e9a0737aa6185923837"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend" DROP CONSTRAINT "FK_6b8a8ff21cb7439e8eb12cb75ae"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "FK_0296ec78335b6da1d39304a5c16"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "FK_2dc2772e03e2384282f0a8d2302"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_reputation" DROP CONSTRAINT "FK_315eba59de6157f1ffff3c83cae"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP CONSTRAINT "FK_51cb79b5555effaf7d69ba1cff9"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_balance" DROP CONSTRAINT "FK_4cac061e709256ecb43cc39d3f4"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_referral" DROP CONSTRAINT "FK_e9ac79c4cb0666be9212031ddb4"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_referral" DROP CONSTRAINT "FK_9d444b1e7ef029f8264439062b3"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_level" DROP CONSTRAINT "FK_d5fd95368e5ce39ff4baa96446a"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "FK_b98835ab0c83f27ff7c4c7de3db"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78"`
    )
    await queryRunner.query(`DROP TABLE "giveaway_entry"`)
    await queryRunner.query(`DROP TABLE "giveaway_item"`)
    await queryRunner.query(`DROP INDEX "IDX_e2e6a6b11f9536e4c686eaa348"`)
    await queryRunner.query(`DROP TABLE "giveaway_item_key"`)
    await queryRunner.query(`DROP TABLE "giveaway"`)
    await queryRunner.query(`DROP INDEX "IDX_0e092abd83f1b90c857c0780f5"`)
    await queryRunner.query(`DROP TABLE "perk_type"`)
    await queryRunner.query(`DROP INDEX "IDX_e6e580c3461b79c3ec4d6774d5"`)
    await queryRunner.query(`DROP TABLE "perk"`)
    await queryRunner.query(`DROP INDEX "IDX_42c401ad4352310cfc64b91b62"`)
    await queryRunner.query(`DROP TABLE "background_tag"`)
    await queryRunner.query(`DROP INDEX "IDX_01524a475d9ece638caa46ae72"`)
    await queryRunner.query(`DROP TABLE "background_category"`)
    await queryRunner.query(`DROP INDEX "IDX_29fc64f9f55853f11bd67d0b18"`)
    await queryRunner.query(`DROP TABLE "badge_tag"`)
    await queryRunner.query(`DROP INDEX "IDX_6d47adfe172a61eecfa6e587b1"`)
    await queryRunner.query(`DROP TABLE "badge_category"`)
    await queryRunner.query(`DROP INDEX "IDX_6a9775008add570dc3e5a0bab7"`)
    await queryRunner.query(`DROP TABLE "tag"`)
    await queryRunner.query(`DROP INDEX "IDX_7bc2db9af731e06b6a111618b5"`)
    await queryRunner.query(`DROP INDEX "IDX_0137fe7ba5244db3a7d2e7277d"`)
    await queryRunner.query(`DROP INDEX "IDX_35ed068bad78456ff543323916"`)
    await queryRunner.query(`DROP TABLE "badge"`)
    await queryRunner.query(`DROP INDEX "IDX_23c05c292c439d77b0de816b50"`)
    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP INDEX "IDX_eda2229e6b9769bc0993e9ee6a"`)
    await queryRunner.query(`DROP TABLE "background_type"`)
    await queryRunner.query(`DROP INDEX "IDX_09d47307ca46221cbf16a1d70c"`)
    await queryRunner.query(`DROP INDEX "IDX_5743761263d730589d369964d3"`)
    await queryRunner.query(`DROP INDEX "IDX_301cedecc8682ab08f43b96451"`)
    await queryRunner.query(`DROP TABLE "background"`)
    await queryRunner.query(`DROP TABLE "referral_unlocked_reward"`)
    await queryRunner.query(`DROP TABLE "referral_reward"`)
    await queryRunner.query(`DROP INDEX "IDX_75f40b79e07fc4d997cf304846"`)
    await queryRunner.query(`DROP INDEX "IDX_ca25e961a93b0bc93eb043e88f"`)
    await queryRunner.query(`DROP TABLE "referral_role"`)
    await queryRunner.query(`DROP TABLE "referral"`)
    await queryRunner.query(`DROP TABLE "guild_self_assignable_role"`)
    await queryRunner.query(`DROP INDEX "IDX_e36cc493b9bd2b5348a0bd2f78"`)
    await queryRunner.query(`DROP TABLE "guild_perk"`)
    await queryRunner.query(`DROP INDEX "IDX_b6e55a0382f08de86411cbaad9"`)
    await queryRunner.query(`DROP TABLE "guild_user_warning"`)
    await queryRunner.query(`DROP INDEX "IDX_b5bbb9bf45764f05261801d342"`)
    await queryRunner.query(`DROP TABLE "guild_user_kick"`)
    await queryRunner.query(`DROP INDEX "IDX_a44b0cc6ca998381bdd9f12104"`)
    await queryRunner.query(`DROP TABLE "guild_user_ban"`)
    await queryRunner.query(`DROP TABLE "guild_user"`)
    await queryRunner.query(`DROP TABLE "guild_support_ticket"`)
    await queryRunner.query(`DROP TABLE "guild_suggestion"`)
    await queryRunner.query(`DROP INDEX "IDX_432a30e6ec70f4096d9b696088"`)
    await queryRunner.query(`DROP TABLE "guild_settings"`)
    await queryRunner.query(`DROP TABLE "guild"`)
    await queryRunner.query(`DROP INDEX "IDX_125788470f4385bc27e0a3c593"`)
    await queryRunner.query(`DROP TABLE "user_perk"`)
    await queryRunner.query(`DROP INDEX "IDX_ddbf1063a9d50fc27e44401e7f"`)
    await queryRunner.query(`DROP TABLE "user_badge"`)
    await queryRunner.query(`DROP INDEX "IDX_8c89c1cc19a0bc780556a5f3fa"`)
    await queryRunner.query(`DROP TABLE "user_background"`)
    await queryRunner.query(`DROP INDEX "IDX_55b8464e039467430750cb3921"`)
    await queryRunner.query(`DROP INDEX "IDX_5b823df6e9a0737aa618592383"`)
    await queryRunner.query(`DROP INDEX "IDX_6b8a8ff21cb7439e8eb12cb75a"`)
    await queryRunner.query(`DROP TABLE "user_friend"`)
    await queryRunner.query(`DROP INDEX "IDX_a7e866fab73655d9206eab9667"`)
    await queryRunner.query(`DROP INDEX "IDX_0296ec78335b6da1d39304a5c1"`)
    await queryRunner.query(`DROP INDEX "IDX_2dc2772e03e2384282f0a8d230"`)
    await queryRunner.query(`DROP TABLE "user_friend_request"`)
    await queryRunner.query(`DROP INDEX "IDX_315eba59de6157f1ffff3c83ca"`)
    await queryRunner.query(`DROP TABLE "user_reputation"`)
    await queryRunner.query(`DROP INDEX "IDX_51cb79b5555effaf7d69ba1cff"`)
    await queryRunner.query(`DROP TABLE "user_profile"`)
    await queryRunner.query(`DROP INDEX "IDX_4cac061e709256ecb43cc39d3f"`)
    await queryRunner.query(`DROP TABLE "user_balance"`)
    await queryRunner.query(`DROP TABLE "user_referral"`)
    await queryRunner.query(`DROP INDEX "IDX_d5fd95368e5ce39ff4baa96446"`)
    await queryRunner.query(`DROP TABLE "user_level"`)
    await queryRunner.query(`DROP INDEX "IDX_b98835ab0c83f27ff7c4c7de3d"`)
    await queryRunner.query(`DROP TABLE "user_verification"`)
    await queryRunner.query(`DROP INDEX "IDX_986a2b6d3c05eb4091bb8066f7"`)
    await queryRunner.query(`DROP TABLE "user_settings"`)
    await queryRunner.query(`DROP TABLE "user"`)
  }
}
