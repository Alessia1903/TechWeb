import { Request } from 'express';
import { Game, User } from '../models/Database';

export class GameController {
  
  static async getGamesForCurrentUser(req: Request) {
    const username = (req as any).username;
    const user = await User.findOne({ 
      where: { userName: username } 
    });
    if (!user) {
      return [];
    }
    const games: any = await Game.findAll({
      where: { userId: (user as any).id },
      order: [['createdAt', 'DESC']]
    });
    return games.map((game: any) => {
    const gameData = game.toJSON();

    if (gameData.status === 'IN_PROGRESS') {
      const guessed = gameData.guessedWords || [];
      gameData.articleTitle = this.obscureText(gameData.articleTitle, guessed);
      gameData.originalText = this.obscureText(gameData.originalText, guessed);
    }

    return gameData;
  });
  }

  static async findById(req: Request) {
    const game: any = await Game.findByPk(req.params.id as string);
    if (!game) return null;
    const guessedWords: string[] = game.guessedWords || [];

    if (game.status === 'IN_PROGRESS') {
      return {
        id: game.id,
        status: game.status,
        attemptsCount: game.attemptsCount,
        guessedWords: guessedWords,
        obscuredTitle: this.obscureText(game.articleTitle, guessedWords),
        obscuredText: this.obscureText(game.originalText, guessedWords)
      };
    } 
    return {
      id: game.id,
      status: game.status,
      attemptsCount: game.attemptsCount,
      guessedWords: guessedWords,
      correctTitle: game.articleTitle,
      fullText: game.originalText
    };
  }

  private static async fetchRandomWikipediaArticle(): Promise<{ title: string, text: string }> {
    const articlePool = [
      "Biancaneve e i sette nani (film 1937)",
      "Pinocchio (film 1940)",
      "Cenerentola (film 1950)",
      "Alice nel Paese delle Meraviglie",
      "Le avventure di Peter Pan",
      "La bella addormentata nel bosco",
      "La carica dei cento e uno",
      "Il libro della giungla (film 1967)",
      "Gli Aristogatti",
      "Robin Hood (film 1973)",
      "La sirenetta (film 1989)",
      "La bella e la bestia (film 1991)",
      "Aladdin (film 1992)",
      "Il re leone",
      "Pocahontas (film 1995)",
      "Il gobbo di Notre Dame (film 1996)",
      "Hercules (film 1997)",
      "Mulan (film 1998)",
      "Tarzan (film 1999)",
      "Le follie dell'imperatore",
      "Lilo & Stitch",
      "Rapunzel - L'intreccio della torre",
      "Frozen - Il regno di ghiaccio",
      "Oceania (film)"
    ];

    const randomIndex = Math.floor(Math.random() * articlePool.length);
    const chosenTitle = articlePool[randomIndex];
    const url = `https://it.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&titles=${encodeURIComponent(chosenTitle)}`;

    const response = await fetch(url);
    const data = await response.json();

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const article = pages[pageId];
    return {
      title: article.title,
      text: article.extract
    };
  }

  private static obscureText(text: string, guessedWords: string[] = []): string {
    return text.replace(/[a-zA-Z0-9À-ÿ]+/g, (match) => {
      // Se la parola è nell'array delle indovinate, la mostriamo!
      if (guessedWords.includes(match.toLowerCase())) {
        return match; 
      } else {
        return '_'.repeat(match.length);
      }
    });
  }

  static async startNewGame(req: Request) {
    const article = await this.fetchRandomWikipediaArticle();
    const obscuredText = this.obscureText(article.text);
    const obscuredTitle = this.obscureText(article.title);
    const currentUser = await User.findOne({ where: { username: (req as any).username } });

    let game = Game.build({
      articleTitle: article.title, 
      originalText: article.text, 
      status: 'IN_PROGRESS'        
    });
    
    (game as any).userId = (currentUser as any).id;
    await game.save();

    return {
      gameId: (game as any).id,
      obscuredTitle: obscuredTitle,
      obscuredText: obscuredText
    };
  }

  static async guessWord(req: Request) {
    const gameId = req.params.id as string;
    const game: any = await Game.findByPk(gameId);
    if (!game) throw new Error("Partita non trovata");
    
    const newGuess: string = req.body.word ? req.body.word.trim().toLowerCase() : '';
    if (!newGuess) throw new Error("Parola non valida");

    let guessedWords: string[] = game.guessedWords || [];
    const originalText: string = game.originalText;
    const articleTitle: string = game.articleTitle;

     // 'i' case-insensitive
    const guessRegex = new RegExp(`\\b${newGuess}\\b`, 'i');
    const isCorrect = guessRegex.test(originalText) || guessRegex.test(articleTitle);
    
    if (!guessedWords.includes(newGuess)) {
      // nuovo tentativo
      game.attemptsCount += 1; 
      if (isCorrect) {
        guessedWords.push(newGuess);
        game.guessedWords = [...guessedWords];
        game.changed('guessedWords', true);
      }

    }
    const updatedObscuredText = this.obscureText(originalText, guessedWords);
    const updatedObscuredTitle = this.obscureText(articleTitle, guessedWords);
    const isVictory = (updatedObscuredTitle === articleTitle);
    if (isVictory && game.status !== 'WON') {
      game.status = 'WON';
      game.endTime = new Date();
    }

    await game.save();

    return {
      correct: isCorrect,
      victory: isVictory,
      attemptsUsed: game.attemptsCount, 
      updatedTitle: updatedObscuredTitle,
      updatedText: updatedObscuredText,
      fullText: isVictory ? originalText : null
    };
  }

  static async surrender(req: Request) {
    const gameId = req.params.id as string;
    const game: any = await Game.findByPk(gameId);
    if (!game) throw new Error("Partita non trovata");

    if (game.status === 'WON' || game.status === 'SURRENDERED') {
      throw new Error("La partita è già terminata");
    }

    game.status = 'SURRENDERED'; 
    game.endTime = new Date();

    await game.save();

    return {
      status: game.status,
      attemptsUsed: game.attemptsCount,
      correctTitle: game.articleTitle,
      fullText: game.originalText
    };
  }

  static async getCompletedGames(req: Request) {
    const games: any = await Game.findAll({
      where: {
        status: ['WON', 'SURRENDERED'] 
      },
      include: [{ model: User, attributes: ['username'] }], 
      order: [['endTime', 'DESC']] // dalle più recenti
    });

    return games.map((g: any) => ({
      id: g.id,
      player: g.User ? g.User.username : 'Anonimo',
      status: g.status,
      attemptsCount: g.attemptsCount,
      timeTakenMs: g.endTime.getTime() - g.startTime.getTime(),
      endTime: g.endTime
    }));
  }

  static async getCompletedGameDetails(req: Request) {
    const gameId = req.params.id as string;
    const game: any = await Game.findByPk(gameId, {
      include: [{ model: User, attributes: ['username'] }]
    });
    if (!game || game.status === 'IN_PROGRESS') {
      throw new Error("Partita non trovata o non ancora conclusa");
    }

    const guessedWords: string[] = game.guessedWords || [];
    return {
      id: game.id,
      player: game.User ? game.User.username : 'Anonimo',
      status: game.status,
      attemptsCount: game.attemptsCount,
      timeTakenMs: game.endTime.getTime() - game.startTime.getTime(),
      correctTitle: game.articleTitle, 
      partiallyObscuredText: this.obscureText(game.originalText, guessedWords) 
    };
  }

  static async getLeaderboard(req: Request) {
    const wonGames: any = await Game.findAll({
      where: { status: 'WON' },
      include: [{ model: User, attributes: ['userName'] }]
    });

    const stats: Record<string, { wins: number, totalTime: number }> = {};

    wonGames.forEach((game: any) => {
      const username = game.User.userName;
      const timeTaken = game.endTime.getTime() - game.startTime.getTime();

      if (!stats[username]) {
        stats[username] = { wins: 0, totalTime: 0 };
      }
      stats[username].wins += 1;
      stats[username].totalTime += timeTaken;
    });

    const leaderboard = Object.keys(stats).map(username => {
      return {
        username: username,
        wins: stats[username].wins,
        averageTimeMs: stats[username].totalTime / stats[username].wins
      };
    });

    leaderboard.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins; // Ordine decrescente per vittorie
      return a.averageTimeMs - b.averageTimeMs;      // Ordine crescente per tempo
    });

    return leaderboard;
  }
}