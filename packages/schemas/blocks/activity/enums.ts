export enum ActivityBlockType {
  DRAW = "drawing",
  MULTIPLE_CHOICE = "multiple choice",
  SINGLE_CHOICE = "single choice",
  TRUE_FALSE = "true false",
  SHORT_ANSWER = "short answer",
  DRAG_MULTIPLE_CHOICE = "drag multiple",
  MATCH_CORRESPONDING = "match",
  DROP_DOWN = "drop down",
  DRAG_AND_DROP = "drag and drop",
  MEMORY = "memory",
  TELL_HISTORY = "tell history",
  WHEEL = 'wheel',
}
export const BLOCK_ACTIVITY_LIST = Object.values(ActivityBlockType);
