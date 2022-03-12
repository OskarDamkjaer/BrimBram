import { getRandomizer } from './rand';

function createDeck(playerCount: number) {
	if (playerCount < 2 || playerCount > 5) {
		throw new Error(`Invalid player count, got ${playerCount} only 2,3,4 allowed`);
	}

	return Object.entries(cardDistribition).reduce(
		(acc, [name, obj]) => acc.concat(Array.from({ length: obj[playerCount] }, () => name)),
		[]
	);
}

function shuffle(deck: string[], seed: number) {
	const rand = getRandomizer(seed);

	return deck
		.map((value) => ({ value, sort: rand() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

function split(deck: string[], pieceCount: number) {
	return deck.reduce((acc, card, index) => {
		const shouldGet = index % pieceCount;
		const curr = acc[shouldGet];
		return { ...acc, [shouldGet]: curr ? [...curr, card] : [card] };
	}, {});
}

type CreateDeckParams = { playerCount: number; seed: number; playerIndex: number };
export function createDeckForPlayer({
	playerCount,
	seed,
	playerIndex
}: CreateDeckParams): string[] {
	const deck = createDeck(playerCount);
	const shuffledDeck = shuffle(deck, seed);
	const inPieces = split(shuffledDeck, playerCount);

	return inPieces[playerIndex];
}

// prettier-ignore
export const cardDistribition = {
	BELPER:            { 2: 0, 3: 0, 4: 2, },
	DERBY:             { 2: 0, 3: 0, 4: 3, },
	LEEK:              { 2: 0, 3: 2, 4: 2, },
	'STOKE-ON TRENT':  { 2: 0, 3: 3, 4: 3, },
	STONE:             { 2: 0, 3: 2, 4: 2, },
	UTTOXETER:         { 2: 0, 3: 1, 4: 2, },
	STAFFORD:          { 2: 2, 3: 2, 4: 2, },
	'BURTON-ON-TRENT': { 2: 2, 3: 2, 4: 2, },
	CANNOCK:           { 2: 2, 3: 2, 4: 2, },
	TAMWORTH:          { 2: 1, 3: 1, 4: 1, },
	WALSALL:           { 2: 1, 3: 1, 4: 1, },
	COALBROOKDALE:     { 2: 3, 3: 3, 4: 3, },
	DUDLEY:            { 2: 2, 3: 2, 4: 2, },
	KIDDERMINSTER:     { 2: 2, 3: 2, 4: 2, },
	WOLVERHAMPTION:    { 2: 2, 3: 2, 4: 2, },
	WORCESTER:         { 2: 2, 3: 2, 4: 2, },
	BRIMINGHAM:        { 2: 3, 3: 3, 4: 3, },
	COVERNTRY:         { 2: 3, 3: 3, 4: 3, },
	NUNEATON:          { 2: 1, 3: 1, 4: 1, },
	REDDITCH:          { 2: 1, 3: 1, 4: 1, },

	'IRON WORKS':               { 2: 4, 3: 4, 4: 4, },
	'COAL MINE':                { 2: 2, 3: 2, 4: 3, },
	'MAN. GOODS / COTTON MILL': { 2: 0, 3: 6, 4: 8, },
	POTTERY:                    { 2: 2, 3: 2, 4: 2, },
	BREWERY:                    { 2: 5, 3: 5, 4: 5, },

};

export const cardColor = {
	BELPER: 'teal',
	DERBY: 'teal',
	LEEK: 'blue',
	'STOKE-ON TRENT': 'blue',
	STONE: 'blue',
	UTTOXETER: 'blue',
	STAFFORD: 'red',
	'BURTON-ON-TRENT': 'red',
	CANNOCK: 'red',
	TAMWORTH: 'red',
	WALSALL: 'red',
	COALBROOKDALE: 'yellow',
	DUDLEY: 'yellow',
	KIDDERMINSTER: 'yellow',
	WOLVERHAMPTION: 'yellow',
	WORCESTER: 'yellow',
	BRIMINGHAM: 'purple',
	COVERNTRY: 'purple',
	NUNEATON: 'purple',
	REDDITCH: 'purple',

	'IRON WORKS': 'brown',
	'COAL MINE': 'brown',
	'MAN. GOODS / COTTON MILL': 'brown',
	POTTERY: 'brown',
	BREWERY: 'brown'
};
