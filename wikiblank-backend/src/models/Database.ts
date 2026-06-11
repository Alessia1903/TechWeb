import { Sequelize } from 'sequelize';
import { createModel as createUserModel } from './User';
import { createModel as createGameModel } from './Game';

import 'dotenv/config.js';

// connessuione al database
export const database = new Sequelize(
  process.env.DB_CONNECTION_URI || 'sqlite:./wikiblank.sqlite', 
  {
    logging: false
  }
);

// inizializzazione modelli
createUserModel(database);
createGameModel(database);

export const { User, Game } = database.models;

// associazioni
User.hasMany(Game, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
Game.belongsTo(User, { foreignKey: 'userId' });

// sincronizzazione automatica
database.sync().then(() => {
  console.log("Database sincronizzato e aggiornato correttamente");
}).catch(err => {
  console.error("Errore durante la sincronizzazione del database: " , err);
});