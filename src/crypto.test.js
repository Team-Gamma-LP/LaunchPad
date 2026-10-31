import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pbkdf2Sync, webcrypto } from "node:crypto";
import { passwordHash, createId } from "./crypto.js";
const accounts = JSON.parse(
  readFileSync(new URL("../public/demo-accounts.json", import.meta.url)),
);
const fallback = { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) };
test("LAN fallback verifies every seeded admin and rejects a wrong password", async () => {
  for (const user of accounts) {
    assert.equal(
      await passwordHash("Launch123!", user.salt, fallback),
      user.passwordHash,
    );
  }
  assert.notEqual(
    await passwordHash("wrong-password", accounts[0].salt, fallback),
    accounts[0].passwordHash,
  );
});
test("LAN fallback verifies the seeded usher password", async () => {
  const state = JSON.parse(
    readFileSync(new URL("../public/seed.json", import.meta.url)),
  );
  const usher = state.clients.verdae.ushers[0];
  assert.equal(
    await passwordHash("Welcome123!", usher.salt, fallback),
    usher.passwordHash,
  );
});
test("native and JS PBKDF2 match the Node reference including Unicode inputs", async () => {
  const password = "pässword 🌿",
    salt = "sált launch";
  const expected = pbkdf2Sync(password, salt, 100000, 32, "sha256").toString(
    "hex",
  );
  assert.equal(await passwordHash(password, salt, webcrypto), expected);
  assert.equal(await passwordHash(password, salt, fallback), expected);
});
test("LAN ID generation produces distinct RFC 4122 version 4 IDs without randomUUID", () => {
  const ids = Array.from({ length: 100 }, () => createId(fallback));
  assert.equal(new Set(ids).size, 100);
  for (const id of ids)
    assert.match(
      id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
});
