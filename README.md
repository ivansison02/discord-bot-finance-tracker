# discord-bot-finance-tracker
Bot for tracking finance

### How to setup
1. Create your application first in discord dev portal.
2. Create config.json at the root level to store clientId, guildId and token.
3. Run command `npm run db:init` for database initialization. <br>
   It should show 3 tables in your preferred sqlite viewer.
4. Run command `npm run start` to start the bot. <br>
   It should show these logs in the terminal: <br>
   (Datetime): Successfully reloaded <#> application (/) commands. <br>
   (Datetime): Ready! Logged in as <username.tag>
