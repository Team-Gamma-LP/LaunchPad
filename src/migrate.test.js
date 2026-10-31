import { test } from "node:test";
import assert from "node:assert/strict";
import { migrateState } from "./migrate.js";
test("upgrades original product copy while retaining event activity", () => {
  const state = {
    version: 1,
    clients: {
      verdae: {
        event: {
          productName: "The everyday botanical ritual",
          tagline: "Pure. Botanical. You.",
          productAbout: "Slow down. Let nature lead. Old copy",
          venue: "Two Rivers Mall",
        },
        guests: [{ ticket: "VD-0001", admittedAt: "2026-10-31" }],
        polls: [{ votes: { guest: "Hydration" } }],
      },
    },
  };
  migrateState(state);
  assert.equal(
    state.clients.verdae.event.productName,
    "VERDAE Complete Botanical Skincare Set",
  );
  assert.equal(state.clients.verdae.event.productIncluded.length, 3);
  assert.equal(state.clients.verdae.guests[0].admittedAt, "2026-10-31");
  assert.equal(state.clients.verdae.guests[0].checkInCode, "VD-0001");
  assert.equal(state.clients.verdae.guests[0].organization, "Not provided");
  assert.equal(state.clients.verdae.guests[0].ticketType, "General admission");
  assert.equal(Object.hasOwn(state.clients.verdae.guests[0], "ticket"), false);
  assert.equal(state.clients.verdae.polls[0].votes.guest, "Hydration");
  assert.equal(state.clients.verdae.event.venue, "Two Rivers Mall");
});
test("revision 2 guests migrate without changing tokens, admission or customized fields", () => {
  const state={contentRevision:2,clients:{a:{guests:[{ticket:"VD-0100",token:"t",organization:"Custom",ticketType:"Press",admittedAt:"now"}],ushers:[{id:"u",email:"usher@example.com"}]}}};
  migrateState(state);
  assert.equal(state.clients.a.guests[0].checkInCode,"VD-0100");
  assert.equal(state.clients.a.guests[0].organization,"Custom");
  assert.equal(state.clients.a.guests[0].token,"t");
  assert.equal(state.clients.a.guests[0].admittedAt,"now");
  assert.equal(state.clients.a.nextGuestNumber,101);
  const saved=JSON.stringify(state);migrateState(state);assert.equal(JSON.stringify(state),saved);
});
test("migration retains admin customizations and is idempotent", () => {
  const state = {
    version: 1,
    clients: {
      verdae: {
        event: {
          productName: "Custom set",
          tagline: "Our own tagline",
          productAbout: "Approved copy",
          productInfo: { price: "KSh 2000" },
        },
      },
    },
  };
  migrateState(state);
  assert.equal(state.clients.verdae.event.productName, "Custom set");
  assert.equal(state.clients.verdae.event.productInfo.price, "KSh 2000");
  const snapshot = JSON.stringify(state);
  migrateState(state);
  assert.equal(JSON.stringify(state), snapshot);
});
