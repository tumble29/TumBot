const {SlashCommandBuilder,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, embedLength } = require('discord.js');
const {botColor}=require('../config.json');

module.exports={
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play a game of TicTacToe!")
    .addUserOption(option=>option
        .setName("user")
        .setDescription("User that you want to play with.")
        .setRequired(true))
        ,
  async execute(interaction){    
    const inviter=interaction.user;
    const invitee=interaction.options.getUser('user');
    
    //Accept/Decline button
    const decision=new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('accept')
          .setLabel('Play!')
          .setStyle(ButtonStyle.Success),
          )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('decline')
          .setLabel('Reject!')
          .setStyle(ButtonStyle.Danger)
      );
    //Bot response
    const message=new EmbedBuilder()
      .setTitle("TicTacToe")
      .setColor(botColor.default)
      .setDescription(`${invitee}, do you want to play a game of TicTacToe with ${inviter}`)

    //Send invite
    await interaction.reply({
      embeds:[message],
      components: [decision],
    });

    //Collector
    const collector=interaction.channel.createMessageComponentCollector({time:30000});
    collector.on('collect',async i=>{
      if (i.customId!='accept' && i.customId!='decline') return;
      //The user clicking the button is not the invitee
      if (i.user!=invitee){
        await i.reply({
            content:`Hey impostor, you're not ${invitee}!`,
            ephemeral:true,
        })
        return;
      }
      
      switch (i.customId){
        case 'decline':
          message.setDescription(`${invitee} has declined your invitation.`);
          await i.update({
            embeds:[message],
            components:[],
          });
          return;
        case 'accept':{
          let turnPlayed=0;
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
            .addComponents(new ButtonBuilder().setCustomId("22").setLabel(" ").setStyle(ButtonStyle.Primary))]
          
          const gameCollector=interaction.channel.createMessageComponentCollector({time:300000});
          const board=[[0,1,2],
                       [3,4,5],
                       [6,7,8]];

          //Inviter will be green, invitee will be red
          let playerTurn = Math.floor(Math.random()*2)==1 ? inviter : invitee;
          
          message.setDescription(`${inviter} :green_square: **VS** :red_square: ${invitee}\n${playerTurn} ${playerTurn==inviter?':green_square:':':red_square:'}'s turn!`);
          await i.update({
            embeds:[message],
            components:[...row],
          });
          gameCollector.on('collect',async button=>{
            if (button.customId!='00'&&button.customId!='01'&&button.customId!='02'&&button.customId!='10'&&button.customId!='11'&&button.customId!='12'&&button.customId!='20'&&button.customId!='21'&&button.customId!='22') return;
            if (button.user!=playerTurn){
              if (button.user == inviter || button.user == invitee){
                await button.reply({
                  content:`Wait for your turn, hothead!`,
                  ephemeral:true,
                })
                return;
              }
              await button.reply({
                  content:`Hey impostor, you're not ${playerTurn}!`,
                  ephemeral:true,
              })
              return;
            }
        
            //Update button color to match with player's move
            row.forEach(r=>r.components.forEach(rc=>{
              if (rc.data.custom_id==button.customId){
                rc
                  .setDisabled(true)
                  .setStyle(button.user==inviter?ButtonStyle.Success:ButtonStyle.Danger);
                board[parseInt(button.customId[0])][parseInt(button.customId[1])]=playerTurn;
              }
            }))
            
            let winner=(()=>{
              if ((board[0][0] == board[0][1] && board[0][1] == board[0][2]) || //row
                  (board[1][0] == board[1][1] && board[1][1] == board[1][2]) || //row 
                  (board[2][0] == board[2][1] && board[2][1] == board[2][2]) || //row 
                  (board[0][0] == board[1][0] && board[1][0] == board[2][0]) || //column
                  (board[0][1] == board[1][1] && board[1][1] == board[2][1]) || //column
                  (board[0][2] == board[1][2] && board[1][2] == board[2][2]) || //column
                  (board[0][0] == board[1][1] && board[1][1] == board[2][2]) || //diag
                  (board[0][2] == board[1][1] && board[1][1] == board[2][0])) { //diag
                    return playerTurn;
                  }
              return null;
            })()
            if (winner){
              row.forEach(r=>r.components.forEach(button=>{button.setDisabled(true)}));
              message.setDescriptionsetDescription(`${inviter} :green_square: **VS** :red_square: ${invitee}\n${playerTurn} ${playerTurn==inviter?':green_square:':':red_square:'}'s **Wins!**`);
              await button.update({
                embeds:[message],
                components:[...row],
              });
            } else {
              //Draw
              if (turnPlayed==9){ 
                message.setDescription(`${inviter} :green_square: **VS** :red_square: ${invitee}\n**Draw!** All squares filled.`);
              }else{
                playerTurn = playerTurn==inviter ? invitee : inviter;
                message.setDescription(`${inviter} :green_square: **VS** :red_square: ${invitee}\n${playerTurn} ${playerTurn==inviter?':green_square:':':red_square:'}'s turn!`);
              }
              await button.update({
                embeds:[message],
                components:[...row],
              });
            }
          })
          
        }
          break;
        default:
          console.log('Button custom ID error');
      }
    })


    
    

    // await interaction.editReply('You won');
  }
}