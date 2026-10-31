import React from "react";
import { STORAGE_KEY } from "./domain";
import { migrateState } from "./migrate";
export const Icon = ({ icon: I, ...props }) => (
  <I size={19} strokeWidth={1.7} {...props} />
);
export const fmt = (d) =>
  new Date(d).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
export const link = (client, g) =>
  `${location.origin}${location.pathname}#/guest/${client}/${g.token}`;
export const load = async () => {
  try {
    const s = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("productlauncher.v1"),
    );
    if (s?.version === 1 && s.clients) {
      const migrated = migrateState(s);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {}
  return fetch("/seed.json")
    .then((r) => r.json())
    .then(migrateState);
};
