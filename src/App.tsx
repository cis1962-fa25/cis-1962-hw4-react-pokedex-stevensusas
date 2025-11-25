import { useState } from "react";
import { setAuthToken, PokemonAPI } from "./api/PokemonAPI";
import PokemonList from "./components/PokemonList";
import BoxList from "./components/BoxList";
import { Pokemon } from "./types/types";
import "./styles/styles.css";
type View = "pokemon" | "box";

// Token for the API
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwZW5ua2V5IjoiaGFucWlzdSIsImlhdCI6MTc1OTA5ODIxOCwiaXNzIjoiZWR1OnVwZW5uOnNlYXM6Y2lzMTk2MiIsImF1ZCI6ImVkdTp1cGVubjpzZWFzOmNpczE5NjIiLCJleHAiOjE3NjQyODIyMTh9.Duq4OT_lgH7GA7lzrJVFbniW2bdXnd4bxDHyZLV1vfY";
setAuthToken(TOKEN);

// App component
function App() {
    const [view, setView] = useState<View>("pokemon");
    const [pokemonById, setPokemonById] = useState<Record<number, Pokemon>>({});
    const [boxRefreshKey, setBoxRefreshKey] = useState(0);
    const fetchPokemonById = async (id: number): Promise<Pokemon | undefined> => {
        if (pokemonById[id]) {
            return pokemonById[id];
        }
        try {
            const pokemon = await PokemonAPI.getPokemonByName(id.toString());
            setPokemonById((prev) => ({ ...prev, [id]: pokemon }));
            return pokemon;
        }
        catch (err) {
            console.error(`Failed to fetch Pokemon #${id}:`, err);
            return undefined;
        }
    };
    const handleBoxUpdated = () => {
        setBoxRefreshKey((k) => k + 1);
    };
    return (<div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Pokédex</h1>
            </header>

            
            <div className="tab-navigation">
                <button className="tab-button" onClick={() => setView("pokemon")} disabled={view === "pokemon"}>
                    All Pokémon
                </button>
                <button className="tab-button" onClick={() => setView("box")} disabled={view === "box"}>
                    My Box
                </button>
            </div>

            
            {view === "pokemon" && (<PokemonList onBoxUpdated={handleBoxUpdated} onPokemonLoaded={(pokemon: Pokemon[]) => {
                const newMap: Record<number, Pokemon> = {};
                pokemon.forEach((p) => (newMap[p.id] = p));
                setPokemonById((prev) => ({ ...prev, ...newMap }));
            }}/>)}

            {view === "box" && (<BoxList pokemonById={pokemonById} refreshKey={boxRefreshKey} fetchPokemonById={fetchPokemonById}/>)}
        </div>);
}
export default App;
