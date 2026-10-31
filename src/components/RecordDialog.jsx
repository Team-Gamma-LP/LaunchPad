import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function RecordDialog({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="record-dialog" aria-labelledby="record-dialog-title" onCancel={e => { e.preventDefault(); onClose(); }}>
    <div className="section-title"><h2 id="record-dialog-title">{title}</h2><button className="secondary icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></div>
    {children}
  </dialog>;
}

export function ConfirmDelete({ title, description, onClose, onConfirm }) {
  return <RecordDialog title={title} onClose={onClose}><p>{description}</p><div className="dialog-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="danger" onClick={onConfirm}>Delete</button></div></RecordDialog>;
}
