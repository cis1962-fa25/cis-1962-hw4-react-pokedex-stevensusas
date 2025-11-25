interface SkeletonLoaderProps {
    type: "pokemon-card" | "box-card" | "details";
    count?: number;
}
export default function SkeletonLoader({ type, count = 1, }: SkeletonLoaderProps) {
    const renderSkeleton = () => {
        switch (type) {
            case "pokemon-card":
                return (<div className="skeleton skeleton-card" style={{
                        width: "100%",
                        height: "180px",
                        borderRadius: "12px",
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "loading 1.5s infinite",
                    }}></div>);
            case "box-card":
                return (<div className="skeleton" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        marginBottom: "1rem",
                    }}>
                        <div className="skeleton" style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "8px",
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "loading 1.5s infinite",
                    }}></div>
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{
                        width: "150px",
                        height: "20px",
                        marginBottom: "0.5rem",
                        borderRadius: "4px",
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "loading 1.5s infinite",
                    }}></div>
                            <div className="skeleton" style={{
                        width: "200px",
                        height: "16px",
                        borderRadius: "4px",
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "loading 1.5s infinite",
                    }}></div>
                        </div>
                    </div>);
            case "details":
                return (<div style={{ padding: "2rem" }}>
                        <div className="skeleton" style={{
                        width: "200px",
                        height: "32px",
                        margin: "0 auto 1.5rem",
                        borderRadius: "4px",
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "loading 1.5s infinite",
                    }}></div>
                        <div className="skeleton" style={{
                        width: "256px",
                        height: "256px",
                        margin: "0 auto",
                        borderRadius: "8px",
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "loading 1.5s infinite",
                    }}></div>
                    </div>);
            default:
                return null;
        }
    };
    return (<>
            {Array.from({ length: count }).map((_, index) => (<div key={index}>{renderSkeleton()}</div>))}
        </>);
}
