export type category = 'Animation' | 'Short' | 'Comedy' | 'Action'

export enum TVRating {
	TV_Y = 'TV-Y',
	TV_Y7 = 'TV-Y7',
	TV_G = 'TV-G',
	TV_PG = 'TV-PG',
	TV_14 = 'TV-14',
	TV_MA = 'TV-MA',
}

export enum MovieRating {
	G = 'G',
	PG = 'PG',
	PG_13 = 'PG-13',
	R = 'R',
	NC_17 = 'NC-17',
}

export interface Film {
	id: string
	title: string
	description: string
	releaseYear: string
	imageSource: string
	videoSource: string
	duration: number
	director: string
	categories: category[]
	rating: MovieRating | TVRating
}

export interface Movie extends Film {
	type: 'Movie'
}

export interface Episode extends Film {
	type: 'Episode'
	season: number
	episodeNumber: number
}
