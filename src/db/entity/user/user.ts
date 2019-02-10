import { IsDate, IsFQDN, IsString, MaxLength } from 'class-validator'
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import {
  UserBackground,
  UserBadge,
  UserBalance,
  UserFriend,
  UserFriendRequest,
  UserLevel,
  UserPerk,
  UserProfile,
  UserReputation,
  UserSettings,
  UserVerification
} from '.'

@Entity()
export class User {
  @Column('varchar', { nullable: true })
  @IsFQDN()
  public avatarUrl: string

  @OneToMany(_ => UserBackground, userBackground => userBackground.user, {
    cascade: ['remove']
  })
  public backgrounds: ReadonlyArray<UserBackground>

  @OneToMany(_ => UserBadge, userBadge => userBadge.user, {
    cascade: ['remove']
  })
  public badges: ReadonlyArray<UserBadge>

  @OneToOne(_ => UserBalance, userBalance => userBalance.user, {
    cascade: true
  })
  public balance: UserBalance

  @Column()
  @IsDate()
  public dateCreated: Date

  @Column('timestamp without time zone', { nullable: true })
  public dateLastMessage: Date | null

  @OneToMany(_ => UserFriend, userFriend => userFriend, {
    cascade: ['remove']
  })
  public friends: ReadonlyArray<UserFriend>

  @PrimaryColumn()
  @IsString()
  public id: string

  @OneToMany(
    _ => UserFriendRequest,
    userFriendRequest => userFriendRequest.receiver,
    {
      cascade: ['remove']
    }
  )
  public incomingFriendRequests: ReadonlyArray<UserFriendRequest>

  @OneToOne(_ => UserLevel, userLevel => userLevel.user, {
    cascade: true
  })
  public level: UserLevel

  @Column('varchar', { length: 100 })
  @IsString()
  @MaxLength(100)
  public name: string

  @OneToMany(
    _ => UserFriendRequest,
    userFriendRequest => userFriendRequest.sender,
    {
      cascade: ['remove']
    }
  )
  public outgoingFriendRequests: ReadonlyArray<UserFriendRequest>

  @OneToMany(_ => UserPerk, userPerk => userPerk.user, {
    cascade: ['remove']
  })
  public perks: ReadonlyArray<UserPerk>

  @OneToOne(_ => UserProfile, userProfile => userProfile.user, {
    cascade: true
  })
  public profile: UserProfile

  @OneToOne(_ => UserReputation, userReputation => userReputation.user, {
    cascade: true
  })
  public reputation: UserReputation

  @OneToOne(_ => UserSettings, userSettings => userSettings.user, {
    cascade: true
  })
  public settings: UserSettings

  @OneToOne(_ => UserVerification, userVerification => userVerification.user, {
    cascade: true
  })
  public verification: UserVerification

  public constructor(user?: User) {
    if (user) {
      Object.assign(this, user)
    }
  }
}
