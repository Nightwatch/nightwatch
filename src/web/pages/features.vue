<template>
  <div>
    <div class="header-text">
      <img src="@/assets/features.png" alt="features" />
    </div>
    <div class="features-list">
      <dl>
        <dt>Roles</dt>
        <hr />
        <p>
          There are a number of commands associated with the role plugin. These
          allow the administrator to promote, demote, or change user roles.
        </p>
        <p1>These commands are:</p1>

        <dd>
          ban- bans the user for the specified amount of time, echoes a message
          with the ban reason to said user
        </dd>
        <dd>
          softban - bans, then immediately unbans the user, removing everything
          they have posted in chat and echoing them the reason given for the ban
        </dd>
        <dd>
          kick - kicks the user from the channel, echoes them the reason given
        </dd>
        <dd>
          mute - mutes the user for given number of time in minutes, echoes the
          reason given to them
        </dd>
        <dd>addrole - assigns a new given role to the given user</dd>
        <dd>delrole - removes a given role from the given user</dd>
        <dd>role - lists the roles that belong to the given user</dd>
        <dt>Friends List Management</dt>
        <hr />
        <p>
          NightWatch keeps a custom friend list for each user in the server.
          Users are able to view and modify their friend list with a number of
          commands.
        </p>
        <p1>These commands are:</p1>
        <dd>add - sends a friend request to a specified user</dd>
        <dd>accept - accepts the friend request of a specified user</dd>
        <dd>decline - refuses the friend request of the specified user</dd>
        <dd>delete - deletes specified user from friend list</dd>
        <dd>list - lists users friends (or your own if no field is given)</dd>
        <dd>
          incoming/outgoing - lists all current requests (defaults to incoming)
        </dd>
        <dt>Music and Playlist Management</dt>
        <hr />
        <p>
          NightWatch allows users to create and manage music playlists to play
          through the Discord application. Users can create queues of songs from
          a number of sources: Youtube, Spotify, or Soundcloud. The bot plays
          music by simply following the hyperlink provided to it by the user.
          This allows for multiple sources of music to play with no conflicts,
          including Youtube, Spotify, Soundcloud, etc.
        </p>
        <p>The commands associated with playlist management are:</p>
        <dd>
          queue - adds the song at the link to the queue (if there is no queue
          the song begins immediately)
        </dd>
        <dd>next - skips to the next song in the queue</dd>
        <dd>back - plays the previous song in the queue</dd>
        <dd>clear - clears the queue</dd>
        <dd>pause - pauses the queue</dd>
        <dd>resume - resumes the queue</dd>
        <dt>Miscellaneous Commands</dt>
        <hr />
        <p>
          There are a number of other commands that will be implemented in
          NightWatch, with more being optionally added as development continues.
        </p>
        <p1>Alphabetically, these commands are listed below:</p1>
        <dd>echo - echoes back the statement to the user</dd>
        <dd>embed - builds a rich embed based on the RichEmbed Discord API</dd>
        <dd>
          help - returns a list of the commands currently available to the user
        </dd>
        <dd>lmgtfy - googles the field and returns top results in text form</dd>
        <dd>nick - changes the user’s display name to the new field</dd>
        <dd>poll - creates a poll and echoes results</dd>
        <dd>reverse - prints the field in reverse order</dd>
        <dd>
          uptime - returns how long the bot has been running since the last
          restart
        </dd>
      </dl>
    </div>
  </div>
</template>
