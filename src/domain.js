import { createId } from "./crypto.js";
export const STORAGE_KEY = "launchpad.v1";
export function validUsherSession(state, session) {
  return Boolean(state.clients[session?.clientId]?.ushers?.some(u => u.id === session.id && u.email === session.email));
}
export function editUsher(state, clientId, memberId, data) {
  const name = String(data.name || "").trim(), email = String(data.email || "").trim().toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error("Enter a name and valid email.");
  const member = state.clients[clientId].ushers.find(u => u.id === memberId);
  if (!member) throw Error("This team member no longer exists.");
  if (Object.values(state.clients).some(c => c.ushers.some(u => u.id !== memberId && u.email.toLowerCase() === email))) throw Error("An usher already uses this email.");
  Object.assign(member, { name, email });
}
export function deleteUsher(state, clientId, memberId) {
  state.clients[clientId].ushers = state.clients[clientId].ushers.filter(u => u.id !== memberId);
}
export function requireLaunch(client) {
  if (!client.event || client.event.deletedAt) throw Error("This launch has been deleted. Ask the admin to restore it.");
}
export function guestDetails(data) {
  const value = {
    name: String(data.name || "").trim(),
    organization: String(data.organization || "").trim(),
    ticketType: String(data.ticketType || "").trim(),
    email: String(data.email || "").trim().toLowerCase(),
  };
  if (!value.name || !value.organization || !value.ticketType)
    throw Error("Enter a name, organization and ticket type.");
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
    throw Error("Enter a valid email address or leave it blank.");
  return value;
}
export function addGuest(state, clientId, data, usher = null) {
  const c = state.clients[clientId];
  requireLaunch(c);
  const details = guestDetails(data);
  if (usher && c.guests.filter(g => g.admittedAt).length >= Number(c.event.capacity))
    throw Error("The event is at capacity. Ask the admin to increase capacity.");
  const existingMax = Math.max(0, ...c.guests.map(g => Number(g.checkInCode?.match(/-(\d+)$/)?.[1]) || 0));
  const number = Math.max(c.nextGuestNumber || 1, existingMax + 1);
  const prefix = c.guests[0]?.checkInCode?.split("-")[0] || clientId.slice(0, 2).toUpperCase();
  c.nextGuestNumber = number + 1;
  const guest = {
    id: createId(), ...details,
    checkInCode: `${prefix}-${String(number).padStart(4, "0")}`,
    token: createId(), realRecipient: Boolean(details.email),
    source: usher ? "walk-in" : "admin",
    admittedAt: usher ? new Date().toISOString() : null,
    admittedBy: usher,
  };
  c.guests.push(guest);
  return guest;
}
export function editGuest(state, clientId, guestId, data) {
  const g = state.clients[clientId].guests.find(g => g.id === guestId);
  if (!g) throw Error("This guest no longer exists.");
  const details = guestDetails(data);
  const emailChanged = g.email !== details.email;
  Object.assign(g, details);
  if (emailChanged) g.realRecipient = Boolean(details.email);
  return g;
}
export function deleteGuest(state, clientId, guestId) {
  const c = state.clients[clientId], g = c.guests.find(g => g.id === guestId);
  if (!g) throw Error("This guest no longer exists.");
  c.guests = c.guests.filter(g => g.id !== guestId);
  for (const poll of c.polls) delete poll.votes[g.token];
}
export function exportGuests(guests) {
  return guests.map(g => ({
    Name: g.name, Organization: g.organization,
    "Ticket type": g.ticketType, "Check-in-code": g.checkInCode,
  }));
}
export function savePoll(state, clientId, pollId, data) {
  requireLaunch(state.clients[clientId]);
  const question = String(data.question || "").trim();
  const options = data.options.map(o => o.trim()).filter(Boolean);
  if (!question || options.length < 2 || new Set(options.map(o => o.toLowerCase())).size !== options.length)
    throw Error("Enter a question and at least two distinct answer choices.");
  const polls = state.clients[clientId].polls;
  const poll = pollId ? polls.find(p => p.id === pollId) : null;
  if (pollId && !poll) throw Error("This poll no longer exists.");
  if (poll) {
    if (Object.keys(poll.votes).length && JSON.stringify(options) !== JSON.stringify(poll.options))
      throw Error("Answer choices cannot change after voting starts. Create a new poll instead.");
    Object.assign(poll, { question, options });
    return poll;
  }
  const created = { id: createId(), question, options, open: true, votes: {} };
  polls.push(created);
  return created;
}
export function admit(state, clientId, ticket, usher) {
  requireLaunch(state.clients[clientId]);
  const code = typeof ticket === "string" ? ticket.trim().toLowerCase() : "";
  if (!code) throw Error("No guest matches this ticket.");
  const guest = state.clients[clientId].guests.find(
    (g) => typeof g.checkInCode === "string" && g.checkInCode.toLowerCase() === code,
  );
  if (!guest) throw Error("No guest matches this ticket.");
  if (guest.admittedAt) throw Error("This guest has already been admitted.");
  if (state.clients[clientId].guests.filter(g => g.admittedAt).length >= Number(state.clients[clientId].event.capacity))
    throw Error("The event is at capacity. Ask the admin to increase capacity.");
  guest.admittedAt = new Date().toISOString();
  guest.admittedBy = usher;
  return guest;
}
export function vote(state, clientId, token, pollId, option) {
  requireLaunch(state.clients[clientId]);
  const c = state.clients[clientId],
    g = c.guests.find((g) => g.token === token),
    p = c.polls.find((p) => p.id === pollId);
  if (!g?.admittedAt) throw Error("Check in with an usher before voting.");
  if (!p?.open) throw Error("This poll is closed.");
  if (!p.options.includes(option)) throw Error("Choose a valid answer.");
  if (Object.hasOwn(p.votes, token))
    throw Error("You have already voted in this poll.");
  p.votes[token] = option;
}
export function download(name, value) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export { passwordHash } from "./crypto.js";
