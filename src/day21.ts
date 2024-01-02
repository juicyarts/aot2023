import { Equal, Expect } from "./utils/testing";

// Replace a column in an array given its index and return the new result
type ReplaceCol<
  Source extends unknown[],
  P extends number,
  ReplaceWith,
  ACC extends any[] = [],
  Target extends unknown[] = []
> = Source extends [infer Start, ...infer Rest]
  ? ACC["length"] extends P
    ? ReplaceCol<Rest, P, ReplaceWith, [...ACC, 0], [...Target, ReplaceWith]>
    : ReplaceCol<Rest, P, ReplaceWith, [...ACC, 0], [...Target, Start]>
  : Target;

// Replace a desired column in an array of rows
type ReplaceRow<
  Source extends unknown[][],
  P extends number[],
  ReplaceWith,
  ACC extends any[] = [],
  Target extends unknown[] = []
> = Source extends [
  infer Start extends unknown[],
  ...infer Rest extends unknown[][]
]
  ? ACC["length"] extends P[0]
    ? ReplaceRow<
        Rest,
        P,
        ReplaceWith,
        [...ACC, 0],
        [...Target, ReplaceCol<Start, P[1], ReplaceWith>]
      >
    : ReplaceRow<Rest, P, ReplaceWith, [...ACC, 0], [...Target, Start]>
  : Target;

type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
type Delimiter = "-";

const Positions = {
  top: 0,
  middle: 1,
  bottom: 2,
  left: 0,
  center: 1,
  right: 2,
} as const;

type NewGame = {
  board: EmptyBoard;
  state: TicTacToeChip | TicTacToeEndState;
};

// helper to translate a string position to integer positions
type PositionstringToI<T extends TicTacToePositions> =
  T extends `${infer Y extends TicTacToeYPositions}${Delimiter}${infer X extends TicTacToeXPositions}`
    ? [(typeof Positions)[Y], (typeof Positions)[X]]
    : never;

// helper to check if a position is occupied already
type IsOccupied<
  Board extends unknown[][],
  Pos extends number[]
> = Board[Pos[0]][Pos[1]] extends TicTacToeChip ? true : false;

// ... 1.. .1. ..1 1.. ..1 111 ... ...
// ... 1.. .1. ..1 .1. .1. ... 111 ...
// ... 1.. .1. ..1 ..1 1.. ... ... 111
// too lazy for logic, so this is rahter a static approach here
type HorizontalWinA = [[0, 0], [0, 1], [0, 2]];
type HorizontalWinB = [[1, 0], [1, 1], [1, 2]];
type HorizontalWinC = [[2, 0], [2, 1], [2, 2]];
type VerticalWinA = [[0, 0], [1, 0], [2, 0]];
type VerticalWinB = [[0, 1], [1, 1], [2, 1]];
type VerticalWinC = [[0, 2], [1, 2], [2, 2]];
type DiagonalWinA = [[0, 0], [1, 1], [2, 2]];
type DiagonalWinB = [[0, 2], [1, 1], [2, 0]];

type Wins =
  | HorizontalWinA
  | HorizontalWinB
  | HorizontalWinC
  | VerticalWinA
  | VerticalWinB
  | VerticalWinC
  | DiagonalWinA
  | DiagonalWinB;

// if the moves collected match any of the patterns above we know its a win
type IsWin<P extends number[][]> = P extends Wins ? true : false;

// count the moves and positions of these moves for a side
type GetMoves<
  B extends unknown[][],
  CP,
  R extends number[][] = [],
  AccX extends number[] = [],
  AccY extends number[] = []
> = B extends [infer Row extends unknown[], ...infer RowR extends unknown[][]]
  ? Row extends [infer Col, ...infer ColR]
    ? Col extends CP
      ? GetMoves<
          [[...ColR], ...RowR],
          CP,
          [...R, [AccX["length"], AccY["length"]]],
          AccX,
          [...AccY, 0]
        >
      : GetMoves<[[...ColR], ...RowR], CP, R, AccX, [...AccY, 0]>
    : GetMoves<RowR, CP, R, [...AccX, 0], []>
  : R;

// rather dumb approach, when all fields are occupied it's a draw, no more logic
type IsDraw<
  B extends unknown[][],
  R extends number[] = [],
  AccX extends number[] = [],
  AccY extends number[] = [],
  Max extends number = 9
> = B extends [infer Row extends unknown[], ...infer RowR extends unknown[][]]
  ? Row extends [infer Col, ...infer ColR]
    ? Col extends TicTacToeEmptyCell
      ? IsDraw<[[...ColR], ...RowR], R, AccX, [...AccY, 0]>
      : IsDraw<[[...ColR], ...RowR], [...R, 0], AccX, [...AccY, 0]>
    : IsDraw<RowR, R, [...AccX, 0], []>
  : R["length"] extends Max
  ? true
  : false;

type TicTacToe<
  Game extends TicTacToeGame,
  Move extends TicTacToePositions,
  CP extends string = Game["state"] extends "❌"
    ? "❌"
    : Game["state"] extends "⭕"
    ? "⭕"
    : "❌",
  OP = Game["state"] extends "❌"
    ? "⭕"
    : Game["state"] extends "⭕"
    ? "❌"
    : "⭕"
> = {
  board: IsOccupied<Game["board"], PositionstringToI<Move>> extends true
    ? Game["board"]
    : ReplaceRow<Game["board"], PositionstringToI<Move>, CP>;
  state: IsOccupied<Game["board"], PositionstringToI<Move>> extends true
    ? CP
    : IsDraw<
        ReplaceRow<Game["board"], PositionstringToI<Move>, CP>
      > extends true
    ? `Draw`
    : IsWin<
        GetMoves<ReplaceRow<Game["board"], PositionstringToI<Move>, CP>, CP>
      > extends true
    ? `${CP} Won`
    : OP;
};

type test_move1_actual = TicTacToe<NewGame, "top-center">;
type test_move1_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
type test_move2_expected = {
  board: [["⭕", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "❌";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
type test_move3_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};

type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
type test_move4_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "  "]];
  state: "❌";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
type test_x_win_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]];
  state: "❌ Won";
};

type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
type type_move5_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕";
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
type test_o_win_expected = {
  board: [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕ Won";
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
type test_invalid_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "  "]];
  state: "⭕";
};
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
type test_draw_expected = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]];
  state: "Draw";
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
