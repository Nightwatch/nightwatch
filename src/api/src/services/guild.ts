import {
  Guild,
  GuildSuggestion,
  GuildSupportTicket,
  GuildSettings,
  GuildUser,
  GuildSelfAssignableRole,
  Song,
  GuildUserMessage,
} from '../../../db'
import { getRepository } from 'typeorm'
import { injectable } from 'inversify'
import { GuildService as IGuildService } from '../interfaces'

/**
 * Guild service that handles storing and modifying guild data
 */
@injectable()
export class GuildService implements IGuildService {
  private readonly guildRepository = getRepository(Guild)
  private readonly suggestionRepository = getRepository(GuildSuggestion)
  private readonly supportTicketRepository = getRepository(GuildSupportTicket)
  private readonly settingsRepository = getRepository(GuildSettings)
  private readonly guildUserRepository = getRepository(GuildUser)
  private readonly selfAssignableRoleRepository = getRepository(
    GuildSelfAssignableRole
  )
  private readonly songRepository = getRepository(Song)
  private readonly guildUserMessageRepository = getRepository(GuildUserMessage)

  public find() {
    return this.guildRepository.find()
  }

  public async findById(id: string) {
    return this.guildRepository.findOneOrFail(id, {
      relations: ['settings', 'suggestions', 'supportTickets']
    })
  }

  public async create(guild: Guild) {
    guild.dateCreated = new Date()
    return this.guildRepository.save(guild)
  }

  public async update(_: string, guild: Guild) {
    return this.guildRepository.save(guild)
  }

  public async delete(id: string) {
    const guild = await this.guildRepository.findOne(id)

    if (!guild) {
      return
    }

    await this.guildRepository.remove(guild)
  }

  public async findSuggestions(id: string) {
    return this.suggestionRepository.find({ where: { guild: { id } } })
  }

  public async findSuggestionById(_: string, suggestionId: number) {
    return this.suggestionRepository.findOne(suggestionId)
  }

  public async createSuggestion(_: string, suggestion: GuildSuggestion) {
    suggestion.dateCreated = new Date()
    return this.suggestionRepository.save(suggestion)
  }

  public async deleteSuggestion(_: string, suggestionId: number) {
    const suggestion = await this.suggestionRepository.findOne(suggestionId)

    if (!suggestion) {
      return
    }

    await this.suggestionRepository.remove(suggestion)
  }

  public async updateSuggestion(
    _: string,
    suggestionId: number,
    suggestion: GuildSuggestion
  ) {
    const dbSuggestion = await this.suggestionRepository.findOne(suggestionId)
    return this.suggestionRepository.save({...dbSuggestion, ...suggestion})
  }

  public findSupportTickets(id: string) {
    return this.supportTicketRepository.find({ where: { guild: { id } } })
  }

  public findSupportTicketById(_: string, ticketId: number) {
    return this.supportTicketRepository.findOne(ticketId)
  }

  public async createSupportTicket(
    _: string,
    supportTicket: GuildSupportTicket
  ) {
    supportTicket.dateCreated = new Date()
    return this.supportTicketRepository.save(supportTicket)
  }

  public async deleteSupportTicket(_: string, ticketId: number) {
    const ticket = await this.supportTicketRepository.findOne(ticketId)

    if (!ticket) {
      return
    }

    await this.supportTicketRepository.remove(ticket)
  }

  public async updateSupportTicket(
    _: string,
    ticketId: number,
    supportTicket: GuildSupportTicket
  ) {
    const dbTicket = await this.supportTicketRepository.findOne(ticketId)
    return this.supportTicketRepository.save({...dbTicket, ...supportTicket})
  }

  public async findSettings(id: string) {
    return this.settingsRepository.findOne({ where: { guild: { id } } })
  }

  public async updateSettings(id: string, settings: GuildSettings) {
    const dbSettings = await this.settingsRepository.findOne({guild: {id}})
    return this.settingsRepository.save({...dbSettings, ...settings})
  }

  public async findUsers(id: string) {
    return this.guildUserRepository.find({ where: { guild: { id } } })
  }

  public findUserById(id: string, userId: string) {
    return this.guildUserRepository.findOneOrFail({
      where: { guild: { id }, user: { id: userId } }
    })
  }

  public async createUser(id: string, user: GuildUser) {
    user.guild = await this.guildRepository.findOneOrFail({id})
    user.dateJoined = new Date()
    return this.guildUserRepository.save(user)
  }

  public async deleteUser(id: string, userId: string) {
    const user = await this.guildUserRepository.findOne({
      where: { guild: { id }, user: { id: userId } }
    })

    if (!user) {
      return
    }

    await this.guildUserRepository.remove(user)
  }

  public async updateUser(id: string, userId: string, user: GuildUser) {
    const dbUser = await this.guildUserRepository.findOne({guild: {id}, user: {id: userId}})
    return this.guildUserRepository.save({...dbUser, ...user})
  }

  public async findSelfAssignableRoles(id: string) {
    return this.selfAssignableRoleRepository.find({ where: { guild: { id } } })
  }

  public async findSelfAssignableRole(id: string, roleId: string) {
    return this.selfAssignableRoleRepository.findOne({
      where: { guild: { id }, roleId }
    })
  }

  public async createSelfAssignableRole(
    _: string,
    selfAssignableRole: GuildSelfAssignableRole
  ) {
    return this.selfAssignableRoleRepository.save(selfAssignableRole)
  }

  public async deleteSelfAssignableRole(id: string, roleId: string) {
    const selfAssignableRole = await this.selfAssignableRoleRepository.findOne({
      where: { guild: { id }, roleId }
    })

    if (!selfAssignableRole) {
      return
    }

    await this.selfAssignableRoleRepository.remove(selfAssignableRole)
  }

  public async findPlaylist(id: string) {
    return this.songRepository.find({ where: { guild: { id } } })
  }

  public async findPlaylistSongsByUserId(id: string, userId: string) {
    return this.songRepository.find({ where: { guild: { id }, userId } })
  }

  public async createSong(_: string, song: Song) {
    return this.songRepository.save(song)
  }

  public async deleteSong(id: string, songId: number) {
    const song = await this.songRepository.findOne({
      where: { guild: { id }, id: songId }
    })

    if (!song) {
      return
    }

    await this.songRepository.remove(song)
  }

  public async clearPlaylist(id: string) {
    const songs = await this.songRepository.find({ where: { guild: { id } } })

    await this.songRepository.remove(songs)
  }

  public async deleteSongsByUserId(id: string, userId: string) {
    const songs = await this.songRepository.find({
      where: { guild: { id }, userId }
    })

    await this.songRepository.remove(songs)
  }

  public async findMessagesByUserId(id: string, userId: string) {
    return this.guildUserMessageRepository.find({where: {guild: {id}, user: {id: userId}}})
  }

  public async findMessages(id: string) {
    return this.guildUserMessageRepository.find({where: {guild: {id}}, relations: ['user']})
  }

  public async createMessage(id: string, userId: string, message: Pick<GuildUserMessage, 'content'>) {
    const guild = await this.guildRepository.findOne({id})
    const user = await this.guildUserRepository.findOne({user: {id: userId}})

    return this.guildUserMessageRepository.save({
      content: message.content,
      guild,
      user,
      timestamp: new Date()
    })
  }
}
