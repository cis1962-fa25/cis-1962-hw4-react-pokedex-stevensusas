interface LoadingSpinnerProps {
    message?: string;
}
export default function LoadingSpinner({ message = "Loading...", }: LoadingSpinnerProps) {
    return (<div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="spinner"></div>
            <p style={{ marginTop: "1rem", color: "#666" }}>{message}</p>
        </div>);
}
