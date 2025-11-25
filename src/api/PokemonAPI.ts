// This file contains all the API endpoints

import { Pokemon, BoxEntry, InsertBoxEntry, UpdateBoxEntry, } from "../types/types";

// Base URL provided by the class for the API
const BASE_URL = "https://hw4.cis1962.esinx.net/api";
let authToken: string | null = null;
export function setAuthToken(token: string) {
    authToken = token;
}

function getHeaders(isAuthRequired: boolean = false) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (isAuthRequired) {
        if (!authToken) {
            throw new Error("Auth token not set.");
        }
        headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
}

// Data class for API exceptions
class APIException extends Error {
    status: number;
    statusText: string;
    constructor(status: number, statusText: string, message: string) {
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.name = "APIException";
    }
}

// Handle responses from the API
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = "";
        try {
            const errorText = await response.text();
            errorMessage = errorText;
        }
        catch {
            errorMessage = "Failed to parse error response";
        }
        switch (response.status) {
            case 401:
                throw new APIException(response.status, response.statusText, "Authentication failed. Please check your API token.");
            case 404:
                throw new APIException(response.status, response.statusText, "Resource not found. The requested item does not exist.");
            case 400:
                throw new APIException(response.status, response.statusText, `Invalid request: ${errorMessage}`);
            case 500:
            case 502:
            case 503:
                throw new APIException(response.status, response.statusText, "Server error. Please try again later.");
            default:
                throw new APIException(response.status, response.statusText, `API Error: ${errorMessage}`);
        }
    }
    if (response.status === 204 ||
        response.headers.get("content-length") === "0") {
        return undefined as unknown as T;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return undefined as unknown as T;
    }
    return response.json();
}

export { APIException };

export const PokemonAPI = {
    // List all Pokemons
    async listPokemon(limit: number, offset: number): Promise<Pokemon[]> {
        // use limit and offset to paginate results
        const url = `${BASE_URL}/pokemon/?limit=${limit}&offset=${offset}`;
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(false),
        });
        return handleResponse<Pokemon[]>(response);
    },

    // Get a Pokemon by name
    async getPokemonByName(name: string): Promise<Pokemon> {
        const url = `${BASE_URL}/pokemon/${name}`;
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(false),
        });
        return handleResponse<Pokemon>(response);
    },

    // List all Box entries
    async listBoxEntries(): Promise<string[]> {
        const url = `${BASE_URL}/box/`;
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(true),
        });
        return handleResponse<string[]>(response);
    },

    // Create a new Box entry
    async createBoxEntry(data: InsertBoxEntry): Promise<BoxEntry> {
        const url = `${BASE_URL}/box/`;
        const response = await fetch(url, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        return handleResponse<BoxEntry>(response);
    },

    // Get a Box entry by ID
    async getBoxEntry(id: string): Promise<BoxEntry> {
        const url = `${BASE_URL}/box/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(true),
        });
        return handleResponse<BoxEntry>(response);
    },

    // Update a Box entry
    async updateBoxEntry(id: string, data: UpdateBoxEntry): Promise<BoxEntry> {
        const url = `${BASE_URL}/box/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        return handleResponse<BoxEntry>(response);
    },

    // Delete a Box entry
    async deleteBoxEntry(id: string): Promise<void> {
        const url = `${BASE_URL}/box/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: getHeaders(true),
        });
        await handleResponse(response);
    },
};
