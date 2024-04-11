import React from "react";

export default function InputBox({ label, placeholder, type, onChange }) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-1">{label}</div>
      <div>
        <input className="w-full  border rounded border-slate-200" onChange={onChange} type={type} placeholder={placeholder} />
      </div>
    </div>
  );
}
