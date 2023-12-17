export type Expect<T extends true> = T extends true ? true : false

export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <
	T,
>() => T extends B ? 1 : 2
	? true
	: false
