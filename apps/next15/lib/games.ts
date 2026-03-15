export interface GameConfig {
  id: string;
  botName: string;
  userCharName: string;
  botAvatar: string;
  userAvatar: string;
  maxScore: number;
}

export const GAMES: GameConfig[] = [
  {
    id: 'game1',
    botName: '마르코',
    userCharName: '브렛',
    botAvatar: '/m.jpg',
    userAvatar: '/b.png',
    maxScore: 73,
  },
  {
    id: 'game2',
    botName: '???',
    userCharName: '???',
    botAvatar: '/m.jpg',
    userAvatar: '/b.png',
    maxScore: 100,
  },
];
