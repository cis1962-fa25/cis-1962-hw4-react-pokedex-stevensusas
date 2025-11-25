import { useEffect, useState, useRef } from "react";
import { Pokemon } from "../types/types";
import { PokemonAPI, APIException } from "../api/PokemonAPI";
import PokemonCard from "./PokemonCard";
import PokemonDetails from "./PokemonDetails";
import BoxForm from "./BoxForm";
import ErrorDisplay from "./ErrorDisplay";
import SkeletonLoader from "./SkeletonLoader";
interface PokemonListProps {
    onBoxUpdated: () => void;
    onPokemonLoaded?: (pokemon: Pokemon[]) => void;
}

// Component to display pokemon list
export default function PokemonList({ onBoxUpdated, onPokemonLoaded, }: PokemonListProps) {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const PAGE_SIZE = 10;
    const [hasMorePages, setHasMorePages] = useState(true);
    const pokemonCacheRef = useRef<Record<number, Pokemon[]>>({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [catchModalOpen, setCatchModalOpen] = useState(false);
    const [catchPokemon, setCatchPokemon] = useState<Pokemon | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            if (pokemonCacheRef.current[currentPage]) {
                setPokemon(pokemonCacheRef.current[currentPage]);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const offset = currentPage * PAGE_SIZE;
                const results = await PokemonAPI.listPokemon(PAGE_SIZE, offset);
                pokemonCacheRef.current[currentPage] = results;
                setPokemon(results);
                if (onPokemonLoaded) {
                    onPokemonLoaded(results);
                }
                if (results.length < PAGE_SIZE) {
                    setHasMorePages(false);
                }
                else {
                    setHasMorePages(true);
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
                    setError("Failed to load Pok\u00E9mon.");
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, refreshTrigger, onPokemonLoaded]);
    async function handlePokemonClick(name: string) {
        try {
            const details = await PokemonAPI.getPokemonByName(name);
            setSelectedPokemon(details);
            setModalOpen(true);
        }
        catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Failed to load Pok\u00E9mon details.";
            setError(errorMessage);
        }
    }
    return (<div>
            <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Pokédex</h2>

            
            {error && (<ErrorDisplay error={error} onRetry={() => {
                setError(null);
                delete pokemonCacheRef.current[currentPage];
                setRefreshTrigger((prev) => prev + 1);
            }}/>)}

            
            {loading && !error && (<div className="pokemon-grid">
                    <SkeletonLoader type="pokemon-card" count={PAGE_SIZE}/>
                </div>)}

            
            {!loading && !error && (<>
                    {pokemon.length === 0 ? (<div className="empty-state">
                            <div className="empty-state-icon">🔍</div>
                            <p className="empty-state-text">
                                No Pokémon found.
                            </p>
                        </div>) : (<div className="pokemon-grid fade-in">
                            {pokemon.map((p) => (<PokemonCard key={p.id} pokemon={p} onClick={() => handlePokemonClick(p.name)}/>))}
                        </div>)}
                </>)}

            
            {!loading && !error && pokemon.length > 0 && (<div className="pagination">
                    <button className="btn btn-secondary" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0 || loading}>
                        ← Previous
                    </button>

                    <span className="pagination-info">
                        Page {currentPage + 1}
                    </span>

                    <button className="btn btn-secondary" onClick={() => setCurrentPage((p) => p + 1)} disabled={!hasMorePages || loading}>
                        Next →
                    </button>
                </div>)}

            
            <PokemonDetails open={modalOpen} pokemon={selectedPokemon} onClose={() => setModalOpen(false)} onCatch={(pokemon) => {
            setCatchPokemon(pokemon);
            setCatchModalOpen(true);
        }}/>

            
            <BoxForm open={catchModalOpen} pokemon={catchPokemon} onClose={() => setCatchModalOpen(false)} onSuccess={() => {
            onBoxUpdated();
        }}/>
        </div>);
}
