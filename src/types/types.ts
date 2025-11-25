// Types for the Pokemon API
export interface PokemonType {
    name: string;
    color: string;
}

// Type for a pokemon move
export interface PokemonMove {
    name: string;
    power?: number;
    type: PokemonType;
}

// Type for a pokemon
export interface Pokemon {
    id: number;
    name: string;
    description: string;
    types: PokemonType[];
    moves: PokemonMove[];
    sprites: {
        front_default: string;
        back_default: string;
        front_shiny: string;
        back_shiny: string;
    };
    stats: {
        hp: number;
        speed: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
    };
}

// Type for a box entry
export interface BoxEntry {
    id: string;
    createdAt: string;
    level: number;
    location: string;
    notes?: string;
    pokemonId: number;
}

// Type for a new box entry
export interface InsertBoxEntry {
    createdAt: string;
    level: number;
    location: string;
    notes?: string;
    pokemonId: number;
}

// Type for an updated box entry
export interface UpdateBoxEntry {
    createdAt?: string;
    level?: number;
    location?: string;
    notes?: string;
    pokemonId?: number;
}

// Type for an API error
export interface APIError {
    status: number;
    statusText: string;
    message: string;
}
