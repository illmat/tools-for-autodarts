import type { WxtStorageItem } from "wxt/storage";
import { storage } from "wxt/storage";

export const AutodartsVariants = [ "X01", "Shanghai", "Segment Training" ] as const;
export type TAutodartsVariant = typeof AutodartsVariants[number];

// Shanghai
export const ShanghaiModes = [ "1-20", "1-7" ] as const;
export type TShanghaiMode = typeof ShanghaiModes[number];

// X01
export const X01BullModes = [ "25/50", "50/50" ] as const;
export const X01InModes = [ "Straight", "Double", "Master" ] as const;
export const X01OutModes = [ "Straight", "Double", "Master" ] as const;
export const X01MaxRounds = [ 15, 20, 50, 80 ] as const;
export const X01BaseScores = [ 121, 170, 301, 501, 701, 901 ] as const;
export const X01BullOffModes = [ "Off", "Normal", "Official" ] as const;
export const X01Legs = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] as const;
export const X01Sets = [ 2, 3, 4, 5, 6, 7 ] as const;
export const X01BotLevels = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] as const;

export type TX01BullMode = typeof X01BullModes[number];
export type TX01InMode = typeof X01InModes[number];
export type TX01OutMode = typeof X01OutModes[number];
export type TX01MaxRounds = typeof X01MaxRounds[number];
export type TX01BaseScore = typeof X01BaseScores[number];
export type TX01BullOffMode = typeof X01BullOffModes[number];
export type TX01Legs = typeof X01Legs[number];
export type TX01Sets = typeof X01Sets[number];
export type TX01BotLevel = typeof X01BotLevels[number];

// Segment Training
export const SegmentTrainingModes = [ "Single", "Outer Single", "Double", "Triple", "Random" ] as const;
export const SegmentTrainingSegments = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "Bull", "Random" ] as const;
export const SegmentTrainingThrows = [ "33", "66", "99" ] as const;
export const SegmentTrainingHits = [ "1", "3", "5", "10", "15", "20" ] as const;
export type TSegmentTrainingMode = typeof SegmentTrainingModes[number];
export type TSegmentTrainingSegment = typeof SegmentTrainingSegments[number];
export type TSegmentTrainingThrow = typeof SegmentTrainingThrows[number];
export type TSegmentTrainingHit = typeof SegmentTrainingHits[number];

export interface ITrainingsSettingsBase {
  variant: TAutodartsVariant;
}

export interface ITrainingSettingsSegment extends ITrainingsSettingsBase {
  variant: "Segment Training";
  mode: TSegmentTrainingMode;
  segment: TSegmentTrainingSegment;
  hits?: TSegmentTrainingThrow;
  throws?: TSegmentTrainingHit;
}

export interface ITrainingSettingsX01 extends ITrainingsSettingsBase {
  variant: "X01";
  baseScore: TX01BaseScore;
  bullMode: TX01BullMode;
  inMode: TX01InMode;
  maxRounds: TX01MaxRounds;
  outMode: TX01OutMode;
  bullOffMode: TX01BullOffMode;
  legs?: TX01Legs;
  sets?: TX01Sets;
  botLevel?: TX01BotLevel;
}

export interface ITrainingSettingsShanghai extends ITrainingsSettingsBase {
  variant: "Shanghai";
  mode: TShanghaiMode;
}

export type TTrainingSettings = ITrainingSettingsX01 | ITrainingSettingsShanghai | ITrainingSettingsSegment;

export interface ITrainingsConfig {
  name: string;
  games: TTrainingSettings[];
}

export interface ITrainingsStore {
  trainings: ITrainingsConfig[];
}

export const defaultTrainingsConfig: ITrainingsStore = {
  trainings: [],
};

export const AutodartsToolsTrainingsConfig: WxtStorageItem<ITrainingsStore, any> = storage.defineItem(
  "local:trainingsconfig",
  {
    defaultValue: defaultTrainingsConfig,
  },
);
