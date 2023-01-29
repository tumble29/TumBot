const { SlashCommandBuilder } = require('discord.js');

module.exports={
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get your Avatar.')
        .addUserOption(option=>
            option
                .setName('user')
                .setDescription('Discord tag of a user')
        ),
    async execute(interaction){
            const user=interaction.options.getUser('user')??null;
            if (user){
                await interaction.reply(`${user.avatarURL(true).replace('webp','png?size=1024')}`);
            } else{
                await interaction.reply(`${interaction.user.avatarURL(true).replace('webp','png?size=1024')}`);
            }
        }
}