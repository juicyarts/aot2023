import { Equal, Expect } from './utils/testing'

type Letters = {
	A: ['█▀█ ', '█▀█ ', '▀ ▀ ']
	B: ['█▀▄ ', '█▀▄ ', '▀▀  ']
	C: ['█▀▀ ', '█ ░░', '▀▀▀ ']
	E: ['█▀▀ ', '█▀▀ ', '▀▀▀ ']
	H: ['█ █ ', '█▀█ ', '▀ ▀ ']
	I: ['█ ', '█ ', '▀ ']
	M: ['█▄░▄█ ', '█ ▀ █ ', '▀ ░░▀ ']
	N: ['█▄░█ ', '█ ▀█ ', '▀ ░▀ ']
	P: ['█▀█ ', '█▀▀ ', '▀ ░░']
	R: ['█▀█ ', '██▀ ', '▀ ▀ ']
	S: ['█▀▀ ', '▀▀█ ', '▀▀▀ ']
	T: ['▀█▀ ', '░█ ░', '░▀ ░']
	Y: ['█ █ ', '▀█▀ ', '░▀ ░']
	W: ['█ ░░█ ', '█▄▀▄█ ', '▀ ░ ▀ ']
	' ': ['░', '░', '░']
	':': ['#', '░', '#']
	'*': ['░', '#', '░']
}

/**
 * Phew, this one was naughty. I guess one could create more abstractions and make some parts more dynamic/generic,
 * but it servces the purpose. Especially the casing stuff was annoying
 */

/**
 * Append each row of the `Letters` type to a given row
 * This helps to concatinate the letters arrays with previous ones
 */
type CharArray<
	T extends keyof Letters,
	Output extends string[] = ['', '', ''],
> = [
	`${Output[0]}${Letters[T][0]}`,
	`${Output[1]}${Letters[T][1]}`,
	`${Output[2]}${Letters[T][2]}`,
]

/**
 * This iterates over the string T as long as there is a char in `T`
 * For each char in `T`, if it is a key of Letters we recurse with the new output that uses the
 * `CharArray` type to concatinate previous outputs with new ones.
 *
 * In case `\n` is found, we return the previous output plus a new iteration of `ToAsciiArt` with a
 * new `Output` array
 *
 * This allows us to add 3 new lines after each `\n` which will then be populated by each chart after `\n`
 * and the output of that is merged back with the previous outputs
 */
type ToAsciiArt<
	T extends string,
	Output extends string[] = ['', '', ''],
	TU extends Uppercase<T> = Uppercase<T>,
> = TU extends `${infer Start extends string}${infer End extends string}`
	? Start extends keyof Letters
		? ToAsciiArt<End, CharArray<Start, Output>>
		: Start extends '\n'
		  ? [...Output, ...ToAsciiArt<End, ['', '', '']>]
		  : Output
	: Output

type test_a_actual = ToAsciiArt<'   * : * Merry * : *   \n'>
type test_0_actual = ToAsciiArt<'   * : * Merry * : *   \n  Christmas  '>

type test_0_expected = [
	'░░░░░#░░░█▄░▄█ █▀▀ █▀█ █▀█ █ █ ░░░#░░░░░',
	'░░░#░░░#░█ ▀ █ █▀▀ ██▀ ██▀ ▀█▀ ░#░░░#░░░',
	'░░░░░#░░░▀ ░░▀ ▀▀▀ ▀ ▀ ▀ ▀ ░▀ ░░░░#░░░░░',
	'░░█▀▀ █ █ █▀█ █ █▀▀ ▀█▀ █▄░▄█ █▀█ █▀▀ ░░',
	'░░█ ░░█▀█ ██▀ █ ▀▀█ ░█ ░█ ▀ █ █▀█ ▀▀█ ░░',
	'░░▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ░▀ ░▀ ░░▀ ▀ ▀ ▀▀▀ ░░',
]
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>

type test_1_actual = ToAsciiArt<'  Happy new  \n  * : * : * Year * : * : *  '>
type test_1_expected = [
	'░░█ █ █▀█ █▀█ █▀█ █ █ ░█▄░█ █▀▀ █ ░░█ ░░',
	'░░█▀█ █▀█ █▀▀ █▀▀ ▀█▀ ░█ ▀█ █▀▀ █▄▀▄█ ░░',
	'░░▀ ▀ ▀ ▀ ▀ ░░▀ ░░░▀ ░░▀ ░▀ ▀▀▀ ▀ ░ ▀ ░░',
	'░░░░#░░░#░░░█ █ █▀▀ █▀█ █▀█ ░░░#░░░#░░░░',
	'░░#░░░#░░░#░▀█▀ █▀▀ █▀█ ██▀ ░#░░░#░░░#░░',
	'░░░░#░░░#░░░░▀ ░▀▀▀ ▀ ▀ ▀ ▀ ░░░#░░░#░░░░',
]
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>

type test_2_actual =
	ToAsciiArt<'  * : * : * : * : * : * \n  Trash  \n  * : * : * : * : * : * '>
type test_2_expected = [
	'░░░░#░░░#░░░#░░░#░░░#░░░',
	'░░#░░░#░░░#░░░#░░░#░░░#░',
	'░░░░#░░░#░░░#░░░#░░░#░░░',
	'░░▀█▀ █▀█ █▀█ █▀▀ █ █ ░░',
	'░░░█ ░██▀ █▀█ ▀▀█ █▀█ ░░',
	'░░░▀ ░▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀ ░░',
	'░░░░#░░░#░░░#░░░#░░░#░░░',
	'░░#░░░#░░░#░░░#░░░#░░░#░',
	'░░░░#░░░#░░░#░░░#░░░#░░░',
]
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>

type test_3_actual =
	ToAsciiArt<'  : * : * : * : * : * : * : \n  Ecyrbe  \n  : * : * : * : * : * : * : '>
type test_3_expected = [
	'░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
	'░░░░#░░░#░░░#░░░#░░░#░░░#░░░',
	'░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
	'░░█▀▀ █▀▀ █ █ █▀█ █▀▄ █▀▀ ░░',
	'░░█▀▀ █ ░░▀█▀ ██▀ █▀▄ █▀▀ ░░',
	'░░▀▀▀ ▀▀▀ ░▀ ░▀ ▀ ▀▀  ▀▀▀ ░░',
	'░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
	'░░░░#░░░#░░░#░░░#░░░#░░░#░░░',
	'░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
]
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>
