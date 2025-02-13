import XMLHttpRequestInterceptor from "@/utils/XMLHttpRequestInterceptor";

export default defineUnlistedScript(() => {
  XMLHttpRequestInterceptor.enable((url, response) => {
    console.log(url, response);
    const routeType = getRouteType(url);
    switch (routeType) {
      case "AUTH_TOKEN":{
        const typedResponse = response as TokenResponse;
        const parsedJwt = parseJwt(typedResponse.access_token);
        console.log("userId", parsedJwt);
      }
        break;
      case "USER_SETTINGS": {
        const typedResponse = response as UserSettingsResponse;
        console.log("USER_SETTINGS", typedResponse);
        break;
      }
      case "MATCH_STATS": {
        const typedResponse = response as MatchStatsResponse;
        console.log("MATCH_STATS", typedResponse);
        break;
      }
      case "UNKNOWN_ROUTE":
      default:
        break;
    }
  });
});

type RouteType =
  | "AUTH_TOKEN"
  | "USER_SETTINGS"
  | "MATCH_STATS"
  | "UNKNOWN_ROUTE";

interface RoutePattern {
  type: RouteType;
  regex: RegExp;
}

const routePatterns: RoutePattern[] = [
  {
    type: "AUTH_TOKEN",
    regex: /^https:\/\/login\.autodarts\.io\/realms\/autodarts\/protocol\/openid-connect\/token$/,
  },
  {
    type: "USER_SETTINGS",
    regex: /^https:\/\/api\.autodarts\.io\/us\/v0\/profile\/settings$/,
  },
  {
    type: "MATCH_STATS",
    regex: /^https:\/\/api\.autodarts\.io\/as\/v0\/matches\/[a-f0-9-]+\/stats$/,
  },
];

function getRouteType(url: string): RouteType {
  for (const pattern of routePatterns) {
    if (pattern.regex.test(url)) {
      return pattern.type;
    }
  }
  return "UNKNOWN_ROUTE";
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(window.atob(base64).split("").map((c) => {
    return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
  }).join(""));

  return JSON.parse(jsonPayload) as DecodedToken;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

export interface UserSettingsResponse {
  showCheckoutGuide: boolean;
  countEachThrow: boolean;
  showChalkboard: boolean;
  showAnimations: boolean;
  caller: string;
  callerEmotion: string;
  callerLanguage: string;
  callerVolume: number;
  callScores: boolean;
  callCheckouts: boolean;
  showSeasonalEffects: boolean;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface RealmAccess {
  roles: string[];
}

export interface ResourceAccess {
  account: Account;
}

export interface Account {
  roles: string[];
}

export interface MatchStatsResponse {
  id: string;
  createdAt: string;
  finishedAt: string;
  host: any;
  type: string;
  scores: Score[];
  variant: string;
  players: Player[];
  targetSets: any;
  targetLegs: number;
  hostId: any;
  winner: number;
  games: Game[];
  duration: string;
  totalLegs: number;
  totalSets: number;
  settings: Settings2;
  matchStats: MatchStat[];
  setStats: any;
  legStats: LegStat[];
}

export interface Score {
  sets: number;
  legs: number;
}

export interface Player {
  id: string;
  index: number;
  userId: string;
  name: string;
  avatarUrl: string;
  hostId: string;
  host: Host;
  boardId: string;
  cpuPPR: any;
}

export interface Host {
  id: string;
  country: string;
  legsPlayed: number;
  total180s: number;
  average: number;
  averageUntil170: number;
  first9Average: number;
  checkoutRate: number;
  tournamentsPlayed: number;
  tournamentWins: number;
  tournamentAverage: number;
  tournamentAverageUntil170: number;
  tournament180s: number;
}

export interface Game {
  id: string;
  matchId: string;
  createdAt: string;
  finishedAt: string;
  set: number;
  leg: number;
  variant: string;
  winner: number;
  winnerPlayerId: string;
  scores: number[];
  turns: Turn[];
  settings: Settings;
}

export interface Turn {
  id: string;
  createdAt: string;
  finishedAt: string;
  round: number;
  turn: number;
  playerId: string;
  score: number;
  points: number;
  marks: any;
  busted: boolean;
  throws: Throw[];
}

export interface Throw {
  id: string;
  throw: number;
  createdAt: string;
  segment: Segment;
  coords?: Coords;
  entry: string;
  marks: any;
}

export interface Segment {
  name: string;
  number: number;
  bed: string;
  multiplier: number;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Settings {
  gameId: string;
  inMode: string;
  outMode: string;
  bullMode: string;
  baseScore: number;
  maxRounds: number;
}

export interface Settings2 {
  baseScore: number;
  bullMode: string;
  gameId: string;
  inMode: string;
  maxRounds: number;
  outMode: string;
}

export interface MatchStat {
  setsWon: number;
  set: number;
  legsWon: number;
  gameId: string;
  playerId: string;
  dartsThrown: number;
  average: number;
  first9Average: number;
  checkouts: number;
  checkoutPoints: number;
  less60: number;
  plus60: number;
  plus100: number;
  plus140: number;
  plus170: number;
  total180: number;
  score: number;
  first9Score: number;
  averageUntil170: number;
  dartsUntil170: number;
  scoreUntil170: number;
  checkoutsHit: number;
  checkoutPercent: number;
  checkoutPointsAverage: number;
}

export interface LegStat {
  stats: Stat[];
  playerIndices: number[];
  winner: number;
  set: number;
  leg: number;
}

export interface Stat {
  gameId: string;
  playerId: string;
  dartsThrown: number;
  average: number;
  first9Average: number;
  checkouts: number;
  checkoutPoints: number;
  less60: number;
  plus60: number;
  plus100: number;
  plus140: number;
  plus170: number;
  total180: number;
  score: number;
  first9Score: number;
  averageUntil170: number;
  dartsUntil170: number;
  scoreUntil170: number;
  checkoutsHit: number;
  checkoutPercent: number;
  checkoutPointsAverage: number;
}
