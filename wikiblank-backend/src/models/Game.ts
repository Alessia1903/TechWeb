import { DataTypes, Sequelize } from 'sequelize';

export function createModel(database: Sequelize) {
  database.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false // solo gli utenti registrati possono giocare
    },
    articleTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalText: {
      type: DataTypes.TEXT, // TEXT: permette stringhe molto lunghe
      allowNull: false
    },
    guessedWords: {
      type: DataTypes.JSON, 
      defaultValue: []
    },
    attemptsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING, 
      defaultValue: 'IN_PROGRESS'
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    // Opzioni del modello
    tableName: 'games'
  });
}