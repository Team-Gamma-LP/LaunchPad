import { productDefaults } from "./productDefaults.js";
export function migrateState(state) {
  if (state.contentRevision >= 3) return state;
  if (!(state.contentRevision >= 2)) {
  const event = state.clients.verdae?.event;
  if (event) {
    // Upgrade original demo copy while retaining admin edits and event activity.
    if (
      !event.productName ||
      event.productName === "The everyday botanical ritual"
    )
      event.productName = productDefaults.productName;
    if (!event.tagline || event.tagline === "Pure. Botanical. You.")
      event.tagline = productDefaults.tagline;
    if (
      !event.productAbout ||
      event.productAbout.startsWith("Slow down. Let nature lead.")
    )
      event.productAbout = productDefaults.productAbout;
    for (const key of [
      "productIncluded",
      "productSteps",
      "productInfo",
      "productWhy",
    ])
      if (event[key] === undefined)
        event[key] = structuredClone(productDefaults[key]);
  }
  if (state.clients.studio?.name === "Oxygene Studio")
    state.clients.studio.name = "Team Gamma Studio";
  }
  for (const client of Object.values(state.clients)) {
    for (const guest of client.guests || []) {
      guest.organization ??= "Not provided";
      guest.ticketType ??= "General admission";
      guest.checkInCode ??= guest.ticket;
      delete guest.ticket;
    }
    for (const usher of client.ushers || []) usher.name ??= "Event usher";
    client.nextGuestNumber = Math.max(client.nextGuestNumber || 1, ...((client.guests || []).map(g => (Number(g.checkInCode?.match(/-(\d+)$/)?.[1]) || 0) + 1)));
  }
  state.contentRevision = 3;
  return state;
}
