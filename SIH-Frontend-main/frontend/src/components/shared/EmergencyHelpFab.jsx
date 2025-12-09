import React, { useState } from "react";
import { Phone, X } from "lucide-react";

// Floating emergency helpline button (bottom-left)
const EmergencyHelpFab = ({ theme }) => {
  const [open, setOpen] = useState(false);
  const helplines = [
    { label: "Call 112 (24/7)", number: "112" },
    { label: "Child Helpline 1098", number: "1098" }
  ];

  return (
    <div className="fixed left-4 bottom-4 z-[1200] space-y-3">
      <div
        className={`rounded-2xl shadow-2xl overflow-hidden border border-cyan-200/60 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"
        } transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/70 dark:border-slate-700/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow">
              <Phone className="w-4 h-4" />
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Emergency Helplines
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Close helpline list"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-2">
          {helplines.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 hover:from-cyan-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-slate-700 transition"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.label}</p>
                <p className="text-xs text-cyan-700 dark:text-cyan-300">{item.number}</p>
              </div>
              <Phone className="w-4 h-4 text-cyan-600" />
            </a>
          ))}
          <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center pt-1">
            Available 24/7 — calls are confidential
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition"
        aria-label="Emergency helplines"
      >
        🚑
      </button>
    </div>
  );
};

export default EmergencyHelpFab;
