import React from "react";
interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
export default function Modal({ open, onClose, children }: ModalProps) {
    if (!open)
        return null;
    return (<div onClick={onClose} style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>);
}
