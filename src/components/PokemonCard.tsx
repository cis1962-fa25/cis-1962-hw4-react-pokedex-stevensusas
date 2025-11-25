import { Pokemon } from "../types/types";
import { PokemonTypeColors } from "../../colors";
interface PokemonCardProps {
    pokemon: Pokemon;
    onClick: () => void;
}

// Component to display a pokemon card
export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    const primaryType = pokemon.types[0];
    const primaryColor = primaryType
        ? primaryType.color || PokemonTypeColors.normal
        : PokemonTypeColors.normal;
    return (<div className="pokemon-card" onClick={onClick} style={{
            background: `linear-gradient(135deg, white 60%, ${primaryColor}15)`,
        }}>
            <img className="pokemon-sprite" src={pokemon.sprites.front_default} alt={pokemon.name} loading="lazy"/>
            <h4 className="pokemon-name">{pokemon.name}</h4>
            <div className="pokemon-types">
                {pokemon.types.map((type) => {
            const typeColor = type.color || PokemonTypeColors.normal;
            return (<span key={type.name} className="pokemon-type-badge" style={{
                    backgroundColor: typeColor,
                }}>
                            {type.name}
                        </span>);
        })}
            </div>
        </div>);
}
