import { BoxEntry, Pokemon } from "../types/types";
import { PokemonTypeColors } from "../../colors";
interface BoxCardProps {
    entry: BoxEntry;
    pokemon?: Pokemon;
    onEdit: (entry: BoxEntry) => void;
    onDelete: (id: string) => void;
}

// Component to display a box entry
export default function BoxCard({ entry, pokemon, onEdit, onDelete, }: BoxCardProps) {
    const primaryColor = pokemon?.types[0]?.color || PokemonTypeColors.normal;
    return (<div className="box-card" style={{
            background: `linear-gradient(135deg, white 85%, ${primaryColor}15)`,
        }}>
            
            <div className="box-card-sprite">
                {pokemon ? (<img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: "100%", height: "100%" }}/>) : (<div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "#999",
            }}>
                        #{entry.pokemonId}
                    </div>)}
            </div>

            
            <div className="box-card-info">
                <div className="box-card-name">
                    {pokemon ? pokemon.name : `Pokémon #${entry.pokemonId}`}
                </div>

                {pokemon && (<div className="pokemon-types" style={{ marginBottom: "0.5rem" }}>
                        {pokemon.types.map((type) => {
                const typeColor = type.color || PokemonTypeColors.normal;
                return (<span key={type.name} className="pokemon-type-badge" style={{
                        backgroundColor: typeColor,
                        fontSize: "0.65rem",
                        padding: "0.15rem 0.3rem",
                    }}>
                                    {type.name}
                                </span>);
            })}
                    </div>)}

                <div className="box-card-details">
                    <div className="box-card-detail">
                        <span className="box-card-detail-label">📍</span>
                        <span>{entry.location}</span>
                    </div>
                    <div className="box-card-detail">
                        <span className="box-card-detail-label">Lv.</span>
                        <span>{entry.level}</span>
                    </div>
                    <div className="box-card-detail">
                        <span className="box-card-detail-label">📅</span>
                        <span>
                            {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {entry.notes && (<div style={{
                marginTop: "0.5rem",
                fontSize: "0.85rem",
                color: "#666",
                fontStyle: "italic",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
            }}>
                        {entry.notes}
                    </div>)}
            </div>

            
            <div className="box-card-actions">
                <button className="btn btn-secondary" onClick={() => onEdit(entry)} style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                    Edit
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(entry.id)} style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                    Release
                </button>
            </div>
        </div>);
}
