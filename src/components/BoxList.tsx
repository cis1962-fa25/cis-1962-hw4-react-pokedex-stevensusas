import { useEffect, useState } from "react";
import { BoxEntry, Pokemon, UpdateBoxEntry } from "../types/types";
import { PokemonAPI, APIException } from "../api/PokemonAPI";
import BoxCard from "./BoxCard";
import Modal from "./Modal";
import ErrorDisplay from "./ErrorDisplay";
import SkeletonLoader from "./SkeletonLoader";
interface BoxListProps {
    pokemonById: Record<number, Pokemon>;
    refreshKey: number;
    fetchPokemonById: (id: number) => Promise<Pokemon | undefined>;
}

// Component to display a box list
export default function BoxList({ pokemonById, refreshKey, fetchPokemonById, }: BoxListProps) {
    const [entries, setEntries] = useState<BoxEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editEntry, setEditEntry] = useState<BoxEntry | null>(null);
    const [editLocation, setEditLocation] = useState("");
    const [editLevel, setEditLevel] = useState(1);
    const [editNotes, setEditNotes] = useState("");
    const [editError, setEditError] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    async function loadBox() {
        setLoading(true);
        setError(null);
        try {
            const ids = await PokemonAPI.listBoxEntries();
            const fullEntries = await Promise.all(ids.map((id) => PokemonAPI.getBoxEntry(id)));
            setEntries(fullEntries);
            const uniquePokemonIds = [
                ...new Set(fullEntries.map((e) => e.pokemonId)),
            ];
            const uncachedIds = uniquePokemonIds.filter((id) => !pokemonById[id]);
            if (uncachedIds.length > 0) {
                await Promise.all(uncachedIds.map((id) => fetchPokemonById(id)));
            }
        }
        catch (err) {
            if (err instanceof APIException) {
                setError(err.message);
            }
            else if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError("Failed to load box entries.");
            }
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadBox();
    }, [refreshKey]);
    async function handleDelete(id: string) {
        setDeleteId(id);
        setDeleteConfirmOpen(true);
    }
    async function confirmDelete() {
        if (!deleteId)
            return;
        setDeleteLoading(true);
        setError(null);
        try {
            await PokemonAPI.deleteBoxEntry(deleteId);
            setDeleteConfirmOpen(false);
            setDeleteId(null);
            loadBox();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete entry.";
            setError(errorMessage);
        }
        finally {
            setDeleteLoading(false);
        }
    }
    function cancelDelete() {
        setDeleteConfirmOpen(false);
        setDeleteId(null);
    }
    function startEdit(entry: BoxEntry) {
        setEditEntry(entry);
        setEditLocation(entry.location);
        setEditLevel(entry.level);
        setEditNotes(entry.notes || "");
        setEditError(null);
        setEditOpen(true);
    }
    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editEntry)
            return;
        if (!editLocation.trim()) {
            setEditError("Location cannot be empty.");
            return;
        }
        if (editLevel < 1 || editLevel > 100) {
            setEditError("Level must be between 1 and 100.");
            return;
        }
        const patch: UpdateBoxEntry = {
            location: editLocation.trim(),
            level: editLevel,
            notes: editNotes.trim() || undefined,
        };
        try {
            setEditLoading(true);
            await PokemonAPI.updateBoxEntry(editEntry.id, patch);
            setEditLoading(false);
            setEditOpen(false);
            loadBox();
        }
        catch (err) {
            if (err instanceof APIException) {
                setEditError(err.message);
            }
            else if (err instanceof Error) {
                setEditError(err.message);
            }
            else {
                setEditError("Failed to update entry.");
            }
            setEditLoading(false);
        }
    }
    return (<div style={{ marginTop: "1rem" }}>
            <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>My Box</h2>

            {error && (<ErrorDisplay error={error} onRetry={() => {
                setError(null);
                loadBox();
            }}/>)}

            {loading && !error && <SkeletonLoader type="box-card" count={3}/>}

            {!loading && !error && entries.length === 0 && (<div className="empty-state">
                    <div className="empty-state-icon"></div>
                    <p className="empty-state-text">No Pokémon caught yet.</p>
                    <p style={{ marginTop: "0.5rem", color: "#666" }}>
                        Go to the Pokédex tab to catch some Pokémon!
                    </p>
                </div>)}

            {!loading && !error && entries.length > 0 && (<div className="fade-in">
                    {entries.map((entry) => (<BoxCard key={entry.id} entry={entry} pokemon={pokemonById[entry.pokemonId]} onEdit={startEdit} onDelete={handleDelete}/>))}
                </div>)}

            
            <Modal open={editOpen} onClose={() => !editLoading && setEditOpen(false)}>
                <div style={{ padding: "2rem", minWidth: "400px" }}>
                    <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
                        Edit{" "}
                        {(editEntry &&
            pokemonById[editEntry.pokemonId]?.name) ||
            "Entry"}
                    </h2>

                    {editError && (<div className="error-message" style={{ marginBottom: "1rem" }}>
                            {editError}
                        </div>)}

                    <form onSubmit={handleEditSubmit}>
                        <div className="form-group">
                            <label className="form-label">Location:</label>
                            <input className="form-input" type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required disabled={editLoading} maxLength={50}/>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Level (1–100):</label>
                            <input className="form-input" type="number" min={1} max={100} value={editLevel} onChange={(e) => setEditLevel(Number(e.target.value))} required disabled={editLoading}/>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Notes (optional):
                            </label>
                            <textarea className="form-textarea" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} disabled={editLoading} maxLength={500} placeholder="Any special notes about this Pokémon?"/>
                            <small style={{ color: "#666", fontSize: "0.8rem" }}>
                                {editNotes.length}/500 characters
                            </small>
                        </div>

                        <div style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1.5rem",
        }}>
                            <button type="submit" className="btn btn-primary" disabled={editLoading} style={{ flex: 1 }}>
                                {editLoading ? "Saving..." : "\uD83D\uDCBE Save Changes"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditOpen(false)} disabled={editLoading} style={{ flex: 1 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            
            <Modal open={deleteConfirmOpen} onClose={() => !deleteLoading && cancelDelete()}>
                <div style={{
            padding: "2rem",
            minWidth: "350px",
            textAlign: "center",
        }}>
                    <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
                        Confirm Release
                    </h2>
                    <p style={{ marginBottom: "1.5rem", color: "#666" }}>
                        Are you sure you want to release this Pokémon?
                        <br />
                        <strong>This action cannot be undone.</strong>
                    </p>
                    <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
        }}>
                        <button className="btn btn-danger" onClick={confirmDelete} disabled={deleteLoading} style={{ minWidth: "120px" }}>
                            {deleteLoading ? "Releasing..." : "\uD83D\uDD13 Release"}
                        </button>
                        <button className="btn btn-secondary" onClick={cancelDelete} disabled={deleteLoading} style={{ minWidth: "120px" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>);
}
