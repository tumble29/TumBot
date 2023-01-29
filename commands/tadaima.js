const { SlashCommandBuilder } = require('discord.js');

module.exports={
  data: new SlashCommandBuilder()
    .setName("tadaima")
    .setDescription("Receive a warm welcome from your favorite maid!"),
  async execute(interaction){    
    await interaction.reply(`Okaeri na sai, **${interaction.user}-sama**`);
  }
}