import { test } from "node:test";
import assert from "node:assert/strict";
import { admit, vote, addGuest, editGuest, deleteGuest, exportGuests, savePoll, editUsher, deleteUsher, validUsherSession } from "./domain.js";
const seed = () => ({
  clients: {
    a: {
      event: { capacity: 200 },
      ushers: [{id:"u",name:"Usher",email:"usher@example.com",passwordHash:"preserved",salt:"s"}],
      guests: [{ id: "g", checkInCode: "VD-001", token: "secret" }],
      polls: [{ id: "p", open: true, options: ["Yes", "No"], votes: {} }],
    },
    b: { event: { capacity: 200 }, guests: [], polls: [], ushers: [] },
  },
});
test("guests with missing required fields are rejected without changing state", () => {
  const complete = { name: "Guest", organization: "Example", ticketType: "General admission" };
  for (const field of ["name", "organization", "ticketType"]) {
    for (const missing of [undefined, null, "", "   "]) {
      const s = seed(), before = structuredClone(s);
      assert.throws(() => addGuest(s, "a", { ...complete, [field]: missing }), /name, organization and ticket type/);
      assert.deepEqual(s, before, `${field}=${String(missing)} must not leave a partial guest or advance the counter`);
    }
  }
});
test("a guest can omit an email and still receive a usable check-in-code", () => {
  const s = seed();
  const guest = addGuest(s, "a", { name: "Guest", organization: "Independent", ticketType: "Walk-in" });
  assert.equal(guest.email, "");
  assert.equal(guest.realRecipient, false);
  admit(s, "a", guest.checkInCode, "usher@example.com");
  assert.ok(guest.admittedAt);
});
test("ticket lookup skips records with missing codes and admits the matching guest", () => {
  const s = seed();
  s.clients.a.guests.unshift({ id: "missing-code" }, { id: "null-code", checkInCode: null }, { id: "numeric-code", checkInCode: 123 });
  const guest = admit(s, "a", " vd-001 ", "usher@example.com");
  assert.equal(guest.id, "g");
  assert.ok(guest.admittedAt);
  assert.equal(s.clients.a.guests[0].admittedAt, undefined);
});
test("missing or blank search codes return a helpful error without admitting anyone", () => {
  for (const code of [undefined, null, "", "   "]) {
    const s = seed();
    const before = structuredClone(s);
    assert.throws(() => admit(s, "a", code, "usher@example.com"), /No guest matches/);
    assert.deepEqual(s, before);
  }
});
test("team edit and deletion revoke old sessions without changing passwords or admission history", () => {
  const s=seed(), session={clientId:"a",id:"u",email:"usher@example.com"};
  assert.equal(validUsherSession(s,session),true);
  admit(s,"a","VD-001",session.email);
  editUsher(s,"a","u",{name:"New Name",email:"new@example.com"});
  assert.equal(validUsherSession(s,session),false);
  assert.equal(s.clients.a.ushers[0].passwordHash,"preserved");
  session.email="new@example.com";assert.equal(validUsherSession(s,session),true);
  deleteUsher(s,"a","u");assert.equal(validUsherSession(s,session),false);
  assert.equal(s.clients.a.guests[0].admittedBy,"usher@example.com");
});
test("admin additions and walk-ins generate unique stable codes, including after deletion", () => {
  const s = seed(), data = { name: " Joy ", organization: "Gamma", ticketType: "VIP" };
  const guest = addGuest(s, "a", data);
  assert.equal(guest.checkInCode, "VD-0002");
  assert.equal(guest.admittedAt, null);
  const token = guest.token;
  editGuest(s, "a", guest.id, {...data, name: "Joy A", checkInCode: "HACK", token: "other"});
  assert.equal(guest.checkInCode, "VD-0002");
  assert.equal(guest.token, token);
  deleteGuest(s, "a", guest.id);
  const walkIn = addGuest(s, "a", data, "usher@example.com");
  assert.equal(walkIn.checkInCode, "VD-0003");
  assert.ok(walkIn.admittedAt);
  assert.equal(walkIn.admittedBy, "usher@example.com");
  assert.throws(() => admit(s, "a", walkIn.checkInCode, "other"), /already/);
  assert.deepEqual(Object.keys(exportGuests([walkIn])[0]), ["Name", "Organization", "Ticket type", "Check-in-code"]);
});
test("guest deletion revokes token voting and removes responses only in its client", () => {
  const s = seed(); admit(s, "a", "VD-001", "usher"); vote(s,"a","secret","p","Yes");
  s.clients.b.polls.push({votes:{secret:"No"}});
  deleteGuest(s,"a","g");
  assert.deepEqual(s.clients.a.polls[0].votes,{});
  assert.equal(s.clients.b.polls[0].votes.secret,"No");
  assert.throws(()=>vote(s,"a","secret","p","Yes"),/Check in/);
});
test("capacity and deleted launch prevent admission, walk-ins and voting without partial additions", () => {
  const s=seed();s.clients.a.event.capacity=1;admit(s,"a","VD-001","usher");
  assert.throws(()=>addGuest(s,"a",{name:"A",organization:"B",ticketType:"VIP"},"usher"),/capacity/);
  assert.equal(s.clients.a.guests.length,1);
  s.clients.a.event.deletedAt="now";
  assert.throws(()=>vote(s,"a","secret","p","Yes"),/deleted/);
  assert.throws(()=>addGuest(s,"a",{name:"A",organization:"B",ticketType:"VIP"}),/deleted/);
});
test("poll edits preserve votes and reject changing voted options or invalid choices", () => {
  const s=seed(); const p=s.clients.a.polls[0];p.votes.secret="Yes";
  savePoll(s,"a","p",{question:"Updated?",options:["Yes","No"]});
  assert.equal(p.question,"Updated?");assert.equal(p.votes.secret,"Yes");
  assert.throws(()=>savePoll(s,"a","p",{question:"Other?",options:["A","B"]}),/cannot change/);
  assert.throws(()=>savePoll(s,"a",null,{question:"Choose",options:["yes","YES"]}),/distinct/);
  assert.equal(p.question,"Updated?");
});
test("check-in matches case-insensitively and refuses duplicates", () => {
  const s = seed();
  admit(s, "a", " vd-001 ", "usher");
  assert.ok(s.clients.a.guests[0].admittedAt);
  assert.throws(() => admit(s, "a", "VD-001", "usher"), /already/);
});
test("clients cannot check in another client guest", () =>
  assert.throws(() => admit(seed(), "b", "VD-001", "usher"), /No guest/));
test("voting requires admission, an open poll, valid option and one vote", () => {
  const s = seed();
  assert.throws(() => vote(s, "a", "secret", "p", "Yes"), /Check in/);
  admit(s, "a", "VD-001", "usher");
  assert.throws(() => vote(s, "a", "secret", "p", "Maybe"), /valid/);
  vote(s, "a", "secret", "p", "Yes");
  assert.throws(() => vote(s, "a", "secret", "p", "No"), /already/);
  s.clients.a.polls[0].open = false;
  assert.throws(() => vote(s, "a", "secret", "p", "Yes"), /closed/);
});
