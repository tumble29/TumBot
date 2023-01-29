const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports={
    data: new SlashCommandBuilder()
        .setName('embedtest')
        .setDescription('Embed your message.')
        ,
    async execute(interaction){
        const embedMessage = new EmbedBuilder()
            .setColor(0xff8566)
            .setTitle('Your message:')
            .addFields(
                {
                    name: 'Your game:!',
                    value: "TicTacToe"
                }
            )
        const row = [
            new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId("00").setLabel(" ").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("01").setLabel(" ").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("02").setLabel(" ").setStyle(ButtonStyle.Primary))
            ,new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId("10").setLabel(" ").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("11").setLabel(" ").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("12").setLabel(" ").setStyle(ButtonStyle.Primary))
            ,new ActionRowBuilder()
            .addComponents(new ButtonBuilder().setCustomId("20").setLabel(" ").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("21").setLabel(" ").setStyle(ButtonStyle.Primary))
            .addComponents(new ButtonBuilder().setCustomId("22").setLabel(" ").setStyle(ButtonStyle.Primary))];
        await interaction.reply({
            embeds:[embedMessage],
            components:[...row],
        });
    }
}