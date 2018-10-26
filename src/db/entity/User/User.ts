import { Entity, PrimaryColumn, Column, OneToOne, OneToMany } from 'typeorm'
import { IsFQDN, IsString, MaxLength, IsDate } from 'class-validator'
import {
  UserSettings,
  UserVerification,
  UserLevel,
  UserBalance,
  UserProfile,
  UserReputation,
  UserFriend,
  UserFriendRequest,
  UserBackground,
  UserBadge,
  UserPerk
} from '.'

@Entity()
export class User {
  @PrimaryColumn()
  @IsString()
  id: string

  @Column('varchar', { length: 100 })
  @IsString()
  @MaxLength(100)
  name: string

  @Column('varchar', { nullable: true })
  @IsFQDN()
  avatarUrl: string

  @Column()
  @IsDate()
  dateCreated: Date

  @Column('timestamp without time zone', { nullable: true })
  dateLastMessage: Date | null

  @OneToOne(_ => UserSettings, userSettings => userSettings.user, {
    cascade: true
  })
  settings: UserSettings

  @OneToOne(_ => UserVerification, userVerification => userVerification.user, {
    cascade: true
  })
  verification: UserVerification

  @OneToOne(_ => UserLevel, userLevel => userLevel.user, {
    cascade: true
  })
  level: UserLevel

  @OneToOne(_ => UserBalance, userBalance => userBalance.user, {
    cascade: true
  })
  balance: UserBalance

  @OneToOne(_ => UserProfile, userProfile => userProfile.user, {
    cascade: true
  })
  profile: UserProfile

  @OneToOne(_ => UserReputation, userReputation => userReputation.user, {
    cascade: true
  })
  reputation: UserReputation

  @OneToMany(
    _ => UserFriendRequest,
    userFriendRequest => userFriendRequest.user,
    {
      cascade: ['remove']
    }
  )
  outgoingFriendRequests: UserFriendRequest[]

  @OneToMany(
    _ => UserFriendRequest,
    userFriendRequest => userFriendRequest.receiver,
    {
      cascade: ['remove']
    }
  )
  incomingFriendRequests: UserFriendRequest[]

  @OneToMany(_ => UserFriend, userFriend => userFriend, {
    cascade: ['remove']
  })
  friends: UserFriend[]

  @OneToMany(_ => UserBackground, userBackground => userBackground.user, {
    cascade: ['remove']
  })
  backgrounds: UserBackground[]

  @OneToMany(_ => UserBadge, userBadge => userBadge.user, {
    cascade: ['remove']
  })
  badges: UserBadge[]

  @OneToMany(_ => UserPerk, userPerk => userPerk.user, {
    cascade: ['remove']
  })
  perks: UserPerk[]

  constructor(user?: User) {
    if (user) {
      Object.assign(this, user)
    }
  }
}
