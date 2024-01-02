import { Equal, Expect } from "./utils/testing";

/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";
/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
  | Dasher
  | Dancer
  | Prancer
  | Vixen
  | Comet
  | Cupid
  | Donner
  | Blitzen
  | Rudolph;

type ValidAmt = 9;
// for each given row test if all reindeers are available at least once
// if a reindeer is found a second time the row is invalid
// if we don't end up with the full amt of reindeers in the end the row is invalid
// do this by keeping a visited record, feels kinda wonky but works
type ValidateRow<
  Row extends unknown[],
  Visited extends Record<Reindeer, any[]> = Record<Reindeer, any[]>,
  N extends number[] = []
> = Row extends [infer Start extends Reindeer, ...infer Rest extends Reindeer[]]
  ? Visited[Start]["length"] extends 1
    ? false
    : ValidateRow<Rest, Visited & { [K in Start]: [0] }, [...N, 0]>
  : N["length"] extends ValidAmt
  ? true
  : false;

// Utils to merge the group arrays for easier checks
type MergeColumns<Row extends unknown[][]> = [...Row[0], ...Row[1], ...Row[2]];

type MergedMap<
  M extends unknown[][][],
  NM extends unknown[][] = []
> = M extends [
  infer Start extends Reindeer[][],
  ...infer Rest extends unknown[][][]
]
  ? MergedMap<Rest, [...NM, MergeColumns<Start>]>
  : NM;

// Handle Rows
type ValidateRows<M extends unknown[][]> = M extends [
  infer Start extends unknown[],
  ...infer Rest extends unknown[][]
]
  ? ValidateRow<Start> extends true
    ? ValidateRows<Rest>
    : false
  : true;

// Handle Columns
// pick the desired column out of each row and return a new array
// this way we can reuse all of our previous logic
type RotateRow<
  M extends unknown[],
  ColI extends number[] = [],
  NewM extends unknown[] = []
> = M extends [infer Start extends unknown[], ...infer Rest extends unknown[]]
  ? RotateRow<Rest, ColI, [...NewM, Start[ColI["length"]]]>
  : NewM;

// Apply rotation logic for each column
type RotateRows<
  M extends unknown[],
  MaxCols extends number = M["length"],
  ColI extends number[] = [],
  NewM extends unknown[][] = []
> = ColI["length"] extends MaxCols
  ? NewM
  : RotateRows<M, MaxCols, [...ColI, 0], [...NewM, RotateRow<M, ColI>]>;

// groups
// could be a loop yadda yadda, being a lazy boy today
// for each group we know, collect the columns that make up the grou and merge them
// this way we can just reuse the same validation logic as the rest
type ValidateGroups<M extends unknown[][][]> = ValidateRow<
  [...M[0][0], ...M[1][0], ...M[2][0]]
> &
  ValidateRow<[...M[0][1], ...M[1][1], ...M[2][1]]> &
  ValidateRow<[...M[0][2], ...M[1][2], ...M[2][2]]> &
  // mid
  ValidateRow<[...M[3][0], ...M[4][0], ...M[5][0]]> &
  ValidateRow<[...M[3][1], ...M[4][1], ...M[5][1]]> &
  ValidateRow<[...M[3][2], ...M[4][2], ...M[5][2]]> &
  // Lower
  ValidateRow<[...M[6][0], ...M[7][0], ...M[8][0]]> &
  ValidateRow<[...M[6][1], ...M[7][1], ...M[8][1]]> &
  ValidateRow<[...M[6][2], ...M[7][2], ...M[8][2]]>;

// apply all three types of Validation
type Validate<M extends unknown[][][]> = ValidateRows<MergedMap<M>> extends true
  ? ValidateRows<RotateRows<MergedMap<M>, M["length"]>> extends true
    ? ValidateGroups<M> extends true
      ? true
      : false
    : false
  : false;

type test_sudoku_1_actual = Validate<
  [
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
    [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
    [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["🌩️", "🔴", "⚡"]],
    [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
    [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
  ]
>;
type test_sudoku_1 = Expect<Equal<test_sudoku_1_actual, true>>;

type test_sudoku_2_actual = Validate<
  [
    [["🌩️", "💨", "☄️"], ["🌟", "🦌", "⚡"], ["❤️", "🔴", "💃"]],
    [["🌟", "⚡", "❤️"], ["🔴", "💃", "☄️"], ["🌩️", "💨", "🦌"]],
    [["🔴", "🦌", "💃"], ["💨", "❤️", "🌩️"], ["🌟", "⚡", "☄️"]],
    [["❤️", "☄️", "🌩️"], ["💃", "⚡", "🔴"], ["💨", "🦌", "🌟"]],
    [["🦌", "💃", "⚡"], ["🌩️", "🌟", "💨"], ["🔴", "☄️", "❤️"]],
    [["💨", "🌟", "🔴"], ["🦌", "☄️", "❤️"], ["⚡", "💃", "🌩️"]],
    [["☄️", "🔴", "💨"], ["❤️", "🌩️", "🦌"], ["💃", "🌟", "⚡"]],
    [["💃", "❤️", "🦌"], ["⚡", "🔴", "🌟"], ["☄️", "🌩️", "💨"]],
    [["⚡", "🌩️", "🌟"], ["☄️", "💨", "💃"], ["🦌", "❤️", "🔴"]]
  ]
>;
type test_sudoku_2 = Expect<Equal<test_sudoku_2_actual, true>>;

type test_sudoku_3_actual = Validate<
  [
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🌟", "⚡", "💨"], ["❤️", "💃", "🔴"], ["☄️", "🌩️", "🦌"]],
    [["☄️", "🌩️", "❤️"], ["⚡", "🌟", "🦌"], ["💃", "🔴", "💨"]],
    [["🌩️", "💃", "🔴"], ["🦌", "💨", "⚡"], ["🌟", "☄️", "❤️"]],
    [["❤️", "☄️", "⚡"], ["💃", "🌩️", "🌟"], ["🦌", "💨", "🔴"]],
    [["💨", "🌟", "🦌"], ["☄️", "🔴", "❤️"], ["🌩️", "💃", "⚡"]],
    [["💃", "💨", "🌟"], ["🔴", "🦌", "☄️"], ["❤️", "⚡", "🌩️"]],
    [["🔴", "❤️", "☄️"], ["🌟", "⚡", "🌩️"], ["💨", "🦌", "💃"]],
    [["⚡", "🦌", "🌩️"], ["💨", "❤️", "💃"], ["🔴", "🌟", "☄️"]]
  ]
>;
type test_sudoku_3 = Expect<Equal<test_sudoku_3_actual, true>>;

type test_sudoku_4_actual = Validate<
  [
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
    [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
    [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["⚡", "🔴", "🌟"]],
    [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
    [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
  ]
>;
type test_sudoku_4 = Expect<Equal<test_sudoku_4_actual, false>>;

type test_sudoku_5_actual = Validate<
  [
    [["🌩️", "💨", "☄️"], ["🌟", "🦌", "⚡"], ["❤️", "🔴", "💃"]],
    [["🌟", "⚡", "❤️"], ["🔴", "💃", "☄️"], ["🌩️", "💨", "🦌"]],
    [["🔴", "🦌", "💃"], ["💨", "❤️", "🌩️"], ["🌟", "⚡", "☄️"]],
    [["❤️", "☄️", "🌩️"], ["💃", "⚡", "🔴"], ["💨", "🦌", "🌟"]],
    [["🦌", "💃", "⚡"], ["🌩️", "🌟", "💨"], ["🔴", "☄️", "❤️"]],
    [["💨", "🌟", "🔴"], ["🦌", "☄️", "❤️"], ["⚡", "💃", "🌩️"]],
    [["☄️", "🔴", "💨"], ["❤️", "💃", "🦌"], ["💃", "🌟", "⚡"]],
    [["💃", "❤️", "🦌"], ["⚡", "🔴", "🌟"], ["☄️", "🌩️", "💨"]],
    [["⚡", "🌩️", "🌟"], ["☄️", "💨", "💃"], ["🦌", "❤️", "🔴"]]
  ]
>;
type test_sudoku_5 = Expect<Equal<test_sudoku_5_actual, false>>;

type test_sudoku_6_actual = Validate<
  [
    [["⚡", "🔴", "🌩️"], ["🦌", "❤️", "💨"], ["💨", "🌟", "☄️"]],
    [["❤️", "🦌", "🌟"], ["💨", "🌟", "🔴"], ["💃", "⚡", "🌩️"]],
    [["💨", "💃", "🌟"], ["☄️", "⚡", "🌩️"], ["🔴", "❤️", "🦌"]],
    [["🦌", "⚡", "🔴"], ["❤️", "💃", "💨"], ["☄️", "🌩️", "🌟"]],
    [["🌟", "🌩️", "💃"], ["⚡", "🔴", "☄️"], ["❤️", "🦌", "💨"]],
    [["☄️", "💨", "❤️"], ["🌟", "🌩️", "🦌"], ["⚡", "💃", "🔴"]],
    [["🌩️", "☄️", "💨"], ["💃", "🦌", "⚡"], ["🌟", "🔴", "❤️"]],
    [["🔴", "❤️", "⚡"], ["🌩️", "☄️", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🌟", "🦌"], ["🔴", "💨", "❤️"], ["🌩️", "☄️", "⚡"]]
  ]
>;
type test_sudoku_6 = Expect<Equal<test_sudoku_6_actual, false>>;

type test_sudoku_7_actual = Validate<
  [
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["💃", "🦌", "☄️"], ["❤️", "🌩️", "🌟"], ["⚡", "🔴", "💨"]],
    [["🦌", "☄️", "❤️"], ["🌩️", "🌟", "⚡"], ["🔴", "💨", "💃"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["❤️", "🌩️", "🌟"], ["⚡", "🔴", "💨"], ["💃", "🦌", "☄️"]],
    [["🌩️", "🌟", "⚡"], ["🔴", "💨", "💃"], ["🦌", "☄️", "❤️"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["⚡", "🔴", "💨"], ["💃", "🦌", "☄️"], ["❤️", "🌩️", "🌟"]],
    [["🔴", "💨", "💃"], ["🦌", "☄️", "❤️"], ["🌩️", "🌟", "⚡"]]
  ]
>;

type test_sudoku_7 = Expect<Equal<test_sudoku_7_actual, false>>;

type test_sudoku_8_actual = Validate<
  [
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]]
  ]
>;

type test_sudoku_8 = Expect<Equal<test_sudoku_8_actual, false>>;
