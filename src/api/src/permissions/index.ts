import { Resource } from './resource'
import { Role } from './role'
import { AccessControl } from 'accesscontrol'

export const accessControl = new AccessControl()

// prettier-ignore
accessControl
  .grant(Role.Muted)
    .readAny(Resource.Message)
  .grant(Role.Member)
    .extend(Role.Muted)
    .createOwn(Resource.Message)
    .updateOwn(Resource.Message)
    .deleteOwn(Resource.Message)
    .createOwn(Resource.SongRequest)
    .updateOwn(Resource.SongRequest)
    .deleteOwn(Resource.SongRequest)
    .readAny(Resource.SongRequest)
  .grant(Role.DJ)
    .updateAny(Resource.SongRequest)
    .deleteAny(Resource.SongRequest)
  .grant(Role.Moderator)
    .extend(Role.DJ)
    .deleteAny(Resource.Message)
    .readAny(Resource.Mute)
    .readAny(Resource.Kick)
    .createAny(Resource.Mute)
    .createAny(Resource.Kick)
    .updateAny(Resource.Mute)
    .updateAny(Resource.Kick)
    .deleteAny(Resource.Mute)
    .deleteAny(Resource.Kick)
  .grant(Role.Administrator)
    .extend(Role.Moderator)
    .readAny(Resource.Ban)
    .createAny(Resource.Ban)
    .updateAny(Resource.Ban)
    .deleteAny(Resource.Ban)
