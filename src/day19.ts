import { Equal, Expect } from './utils/testing'

// This all looks wildly complex, i guess there might be an easier way?
// * we could change the Heystack to be a union type for easier access?
// * maybe the "Times" type is not necessary and there is a built in way of handling this with less code?

const Heystack = ['🛹', '🚲', '🛴', '🏄'] as const
type HeystackMap<T extends number> = (typeof Heystack)[T]

/**
 * This type allows to create an array of a certain length with a certain value
 * This allows us to select n times an entry from the Heystack and create an array out of it
 */
type Times<
	Amount extends number,
	Key extends number,
	Iterator extends number[] = [],
	FinalArray extends any[] = [],
> = Iterator['length'] extends Amount
	? FinalArray
	: Times<Amount, Key, [...Iterator, 0], [...FinalArray, HeystackMap<Key>]>

/**
 * This type allows us to collect Items from the Heystack
 *
 * The Input array determines how many items we want to have from the Heystack, where the index of the item
 * determines which item in the Heystack we want, and the value determines how many of the item we want
 *
 * The HeystackIterator keeps track of the times we have cycled through the heystack already to restart from 0 when we have
 * reached the end of the Heystack while having more entries in Input
 *
 * The Output array is the result of the Rebuild function containing the items from the Heystack according to the amounts set per input
 */
type Rebuild<
	Input extends readonly number[],
	HeystackIterator extends any[] = [],
	Output extends any[] = [],
> = Input extends [infer Needle extends number, ...infer Rest extends number[]]
	? Input['length'] extends 0
		? Output
		: HeystackIterator['length'] extends (typeof Heystack)['length']
		  ? Rebuild<Input, [], Output>
		  : Rebuild<
					Rest,
					[...HeystackIterator, 0],
					[...Output, ...Times<Needle, HeystackIterator['length']>]
			  >
	: Output

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>
type test_0_expected = [
	'🛹',
	'🛹',
	'🚲',
	'🛴',
	'🛴',
	'🛴',
	'🏄',
	'🏄',
	'🏄',
	'🛹',
	'🚲',
	'🛴',
	'🛴',
]
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>
type test_1_expected = [
	'🛹',
	'🛹',
	'🛹',
	'🚲',
	'🚲',
	'🚲',
	'🛴',
	'🛴',
	'🏄',
	'🛹',
	'🛹',
	'🚲',
	'🛴',
	'🛴',
]
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>
type test_2_expected = [
	'🛹',
	'🛹',
	'🚲',
	'🚲',
	'🚲',
	'🛴',
	'🛴',
	'🛴',
	'🏄',
	'🏄',
	'🏄',
	'🏄',
	'🏄',
	'🛹',
	'🚲',
	'🛴',
	'🛴',
]
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>
