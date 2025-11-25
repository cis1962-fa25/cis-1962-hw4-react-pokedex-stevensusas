import { Pokemon } from "../types/types";
import Modal from "./Modal";
import { PokemonTypeColors } from "../../colors";
interface PokemonDetailsProps {
    open: boolean;
    pokemon: Pokemon | null;
    onClose: () => void;
    onCatch: (pokemon: Pokemon) => void;
}

// Component to display pokemon details
export default function PokemonDetails({ open, pokemon, onClose, onCatch, }: PokemonDetailsProps) {
    if (!open || !pokemon)
        return null;
    const getStatPercentage = (value: number) => Math.min((value / 255) * 100, 100);
    return (<Modal open={open} onClose={onClose}>
            <div className="pokemon-details">
                <div className="pokemon-details-header">
                    <h2 className="pokemon-details-name">{pokemon.name}</h2>
                    <div className="pokemon-types" style={{ justifyContent: "center" }}>
                        {pokemon.types.map((type) => {
            const typeColor = type.color || PokemonTypeColors.normal;
            return (<span key={type.name} className="pokemon-type-badge" style={{ backgroundColor: typeColor }}>
                                    {type.name}
                                </span>);
        })}
                    </div>
                </div>

                <p style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "#666",
        }}>
                    {pokemon.description}
                </p>

                <div className="pokemon-sprites-grid">
                    <div className="pokemon-sprite-item">
                        <div className="pokemon-sprite-label">Normal</div>
                        <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`}/>
                    </div>
                    <div className="pokemon-sprite-item">
                        <div className="pokemon-sprite-label">Back</div>
                        <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`}/>
                    </div>
                    <div className="pokemon-sprite-item">
                        <div className="pokemon-sprite-label">Shiny</div>
                        <img src={pokemon.sprites.front_shiny} alt={`${pokemon.name} shiny`}/>
                    </div>
                    <div className="pokemon-sprite-item">
                        <div className="pokemon-sprite-label">Shiny Back</div>
                        <img src={pokemon.sprites.back_shiny} alt={`${pokemon.name} shiny back`}/>
                    </div>
                </div>

                <div className="pokemon-stats">
                    <h3 style={{ marginBottom: "1rem", color: "#333" }}>
                        Stats
                    </h3>
                    <div className="pokemon-stat">
                        <span className="pokemon-stat-label">HP</span>
                        <div className="pokemon-stat-bar">
                            <div className="pokemon-stat-fill" style={{
            width: `${getStatPercentage(pokemon.stats.hp)}%`,
            background: `linear-gradient(90deg, #4CAF50, #8BC34A)`,
        }}/>
                            <span className="pokemon-stat-value">
                                {pokemon.stats.hp}
                            </span>
                        </div>
                    </div>
                    <div className="pokemon-stat">
                        <span className="pokemon-stat-label">Attack</span>
                        <div className="pokemon-stat-bar">
                            <div className="pokemon-stat-fill" style={{
            width: `${getStatPercentage(pokemon.stats.attack)}%`,
            background: `linear-gradient(90deg, #F44336, #FF6B6B)`,
        }}/>
                            <span className="pokemon-stat-value">
                                {pokemon.stats.attack}
                            </span>
                        </div>
                    </div>
                    <div className="pokemon-stat">
                        <span className="pokemon-stat-label">Defense</span>
                        <div className="pokemon-stat-bar">
                            <div className="pokemon-stat-fill" style={{
            width: `${getStatPercentage(pokemon.stats.defense)}%`,
            background: `linear-gradient(90deg, #2196F3, #03A9F4)`,
        }}/>
                            <span className="pokemon-stat-value">
                                {pokemon.stats.defense}
                            </span>
                        </div>
                    </div>
                    <div className="pokemon-stat">
                        <span className="pokemon-stat-label">
                            Special Attack
                        </span>
                        <div className="pokemon-stat-bar">
                            <div className="pokemon-stat-fill" style={{
            width: `${getStatPercentage(pokemon.stats.specialAttack)}%`,
            background: `linear-gradient(90deg, #9C27B0, #BA68C8)`,
        }}/>
                            <span className="pokemon-stat-value">
                                {pokemon.stats.specialAttack}
                            </span>
                        </div>
                    </div>
                    <div className="pokemon-stat">
                        <span className="pokemon-stat-label">
                            Special Defense
                        </span>
                        <div className="pokemon-stat-bar">
                            <div className="pokemon-stat-fill" style={{
            width: `${getStatPercentage(pokemon.stats.specialDefense)}%`,
            background: `linear-gradient(90deg, #673AB7, #7E57C2)`,
        }}/>
                            <span className="pokemon-stat-value">
                                {pokemon.stats.specialDefense}
                            </span>
                        </div>
                    </div>
                    <div className="pokemon-stat">
                        <span className="pokemon-stat-label">Speed</span>
                        <div className="pokemon-stat-bar">
                            <div className="pokemon-stat-fill" style={{
            width: `${getStatPercentage(pokemon.stats.speed)}%`,
            background: `linear-gradient(90deg, #FF9800, #FFB74D)`,
        }}/>
                            <span className="pokemon-stat-value">
                                {pokemon.stats.speed}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                    <button className="btn btn-primary" onClick={() => onCatch(pokemon)} style={{ flex: 1 }}>
                        Catch Pokémon
                    </button>
                    <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>);
}
