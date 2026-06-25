"use client";

import React from "react";

export default function InfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-md ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Why does detecting fake news matter?</h3>
            <p className="mt-3 text-sm text-zinc-300">
              False or manipulative information spreads quickly across networks and can influence
              opinions, decisions, and public processes. This extension helps surface signals of
              propaganda — not only from local sources, but also from external actors distributing
              coordinated messages.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>• Shows credibility signals directly in the page.</li>
              <li>• Lowers the chance of sharing harmful content unintentionally.</li>
              <li>• Provides quick context without leaving the site.</li>
            </ul>

            <p className="mt-4 text-sm text-zinc-300">
              Try the interactive demo below: click one of the figurines to see how an item spreads on
              the map and how problematic points can be identified.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Got it — continue
          </button>
        </div>
      </div>
    </div>
  );
}
