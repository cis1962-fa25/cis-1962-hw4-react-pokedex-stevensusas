import { useState } from "react";
import { InsertBoxEntry, Pokemon } from "../types/types";
import Modal from "./Modal";
import { PokemonAPI, APIException } from "../api/PokemonAPI";
import { PokemonTypeColors } from "../../colors";
interface BoxFormProps {
    open: boolean;
    pokemon: Pokemon | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Component to display a box form
export default function BoxForm({ open, pokemon, onClose, onSuccess, }: BoxFormProps) {
    const [location, setLocation] = useState("");
    const [level, setLevel] = useState(1);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e: React.FormEvent) {
        if (!pokemon)
            return;
        e.preventDefault();
        setError(null);
        if (!location.trim()) {
            setError("Location cannot be empty.");
            return;
        }
        if (level < 1 || level > 100) {
            setError("Level must be between 1 and 100.");
            return;
        }
        const entry: InsertBoxEntry = {
            pokemonId: pokemon.id,
            location: location.trim(),
            level,
            createdAt: new Date().toISOString(),
            notes: notes.trim() || undefined,
        };
        try {
            setLoading(true);
            await PokemonAPI.createBoxEntry(entry);
            setLoading(false);
            onSuccess();
            onClose();
        }
        catch (err) {
            if (err instanceof APIException) {
                if (err.status === 400) {
                    setError(`Invalid data: ${err.message}`);
                }
                else {
                    setError(err.message);
                }
            }
            else if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Failed to create Box entry.");
            }
            setLoading(false);
        }
    }
    if (!open || !pokemon)
        return null;
    const primaryColor = pokemon.types[0]?.color || PokemonTypeColors.normal;
    return (<Modal open={open} onClose={() => !loading && onClose()}>
            <div style={{ padding: "2rem", minWidth: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: "96px", height: "96px" }}/>
                    <h2 style={{
            marginTop: "0.5rem",
            textTransform: "capitalize",
            color: primaryColor,
        }}>
                        Catch {pokemon.name}
                    </h2>
                    <div className="pokemon-types" style={{
            justifyContent: "center",
            marginTop: "0.5rem",
        }}>
                        {pokemon.types.map((type) => {
            const typeColor = type.color || PokemonTypeColors.normal;
            return (<span key={type.name} className="pokemon-type-badge" style={{ backgroundColor: typeColor }}>
                                    {type.name}
                                </span>);
        })}
                    </div>
                </div>

                {error && (<div className="error-message" style={{ marginBottom: "1rem" }}>
                        {error}
                    </div>)}

                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label className="form-label">Location:</label>
                        <input className="form-input" type="text" value={location} placeholder="e.g., Route 1, Viridian Forest" onChange={(e) => setLocation(e.target.value)} required disabled={loading} maxLength={50}/>
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Level (1–100):</label>
                        <input className="form-input" type="number" value={level} min={1} max={100} onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 1 && val <= 100)
                setLevel(val);
        }} required disabled={loading}/>
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Notes (optional):</label>
                        <textarea className="form-textarea" value={notes} placeholder="Anything special about this catch?" onChange={(e) => setNotes(e.target.value)} disabled={loading} maxLength={500}/>
                        <small style={{ color: "#666", fontSize: "0.8rem" }}>
                            {notes.length}/500 characters
                        </small>
                    </div>

                    
                    <div style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1.5rem",
        }}>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? (<>Catching...</>) : (<>Catch Pokémon</>)}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading} style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>);
}
