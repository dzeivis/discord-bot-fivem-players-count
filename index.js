const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js')
config = require('./config')

const { DiscordFivemApi } = require('discord-fivem-api')
const api = new DiscordFivemApi(config.fivem_api, true, true)

const client = new Client({
    intents: [
	GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
})

function GetPresenceType() {
    if(config.presence_type.toLowerCase() == 'watching') Type = ActivityType.Watching
    if(config.presence_type.toLowerCase() == 'playing') Type = ActivityType.Playing
    if(config.presence_type.toLowerCase() == 'listening') Type = ActivityType.Listening
    if(config.presence_type.toLowerCase() == 'competing') Type = ActivityType.Competing

    return Type
}
async function GetPlayerCount() {
    var players = 0
    await api.getPlayersOnline().then((count) => players = count)
    return players
}
function Debug(content) {
    if(config.debug) console.log(new Date().toLocaleString() + " " + content)
}

client.on('ready', () => {
    Debug('Discord BOT Started')
    setInterval(async () => {
        client.user.setPresence({
            activities: [{ name: await GetPlayerCount() + ' Players', type: GetPresenceType() }],
            status: config.bot_status,
        })
    }, config.fivem_api.interval)
})

api.on('ready', () => Debug('API initialized'))
api.on('readyPlayers', (players) => Debug('Players: ' + players.length))
api.on('readyResources', (resources) => Debug('Resources: ' + resources.length))
api.on('playerJoin', (player) => Debug(player.name + ' Joined the server'))
api.on('playerLeave', (player) => Debug(player.name + ' Left the server'))
api.on('resourceAdd', (resource) => Debug('Resource added:' + resource))
api.on('resourceRemove', (resource) => Debug('Resource removed:' + resource))

client.login(config.token)
