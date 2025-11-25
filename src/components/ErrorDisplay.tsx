import { APIException } from "../api/PokemonAPI";
interface ErrorDisplayProps {
    error: Error | APIException | string;
    onRetry?: () => void;
}

// Component to handle errors
export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
    let errorMessage = "";
    let errorType = "error";
    if (typeof error === "string") {
        errorMessage = error;
    }
    else if (error instanceof APIException) {
        errorMessage = error.message;
        if (error.status === 401) {
            errorType = "auth";
        }
        else if (error.status === 404) {
            errorType = "notfound";
        }
        else if (error.status >= 500) {
            errorType = "server";
        }
    }
    else if (error instanceof Error) {
        errorMessage = error.message;
    }
    const getErrorIcon = () => {
        switch (errorType) {
            case "auth":
                return "\uD83D\uDD12";
            case "notfound":
                return "\uD83D\uDD0D";
            case "server":
                return "\u26A0\uFE0F";
            default:
                return "\u274C";
        }
    };
    return (<div className="error-message" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {getErrorIcon()}
            </div>
            <p style={{ marginBottom: onRetry ? "1rem" : 0 }}>{errorMessage}</p>
            {onRetry && (<button className="btn btn-primary" onClick={onRetry} style={{ marginTop: "0.5rem" }}>
                    Try Again
                </button>)}
        </div>);
}
