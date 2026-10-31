// Local-network HTTP does not expose SubtleCrypto or randomUUID in many browsers.
// Keep the existing PBKDF2 format, using a JS implementation when needed.
export async function passwordHash(
  password,
  salt,
  provider = globalThis.crypto,
) {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);
  let derived;
  if (provider?.subtle) {
    const key = await provider.subtle.importKey(
      "raw",
      passwordBytes,
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    derived = new Uint8Array(
      await provider.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: saltBytes,
          iterations: 100000,
          hash: "SHA-256",
        },
        key,
        256,
      ),
    );
  } else {
    const [{ pbkdf2Async }, { sha256 }] = await Promise.all([
      import("@noble/hashes/pbkdf2.js"),
      import("@noble/hashes/sha2.js"),
    ]);
    derived = await pbkdf2Async(sha256, passwordBytes, saltBytes, {
      c: 100000,
      dkLen: 32,
      asyncTick: 10,
    });
  }
  return Array.from(derived, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function createId(provider = globalThis.crypto) {
  if (typeof provider?.randomUUID === "function") return provider.randomUUID();
  if (typeof provider?.getRandomValues !== "function") {
    throw Error(
      "This browser cannot generate event IDs. Please use a current browser.",
    );
  }
  const bytes = provider.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
