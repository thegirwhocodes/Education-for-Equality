import assert from "node:assert/strict";

import {
  learnerKeyFor,
  looksLikePhoneSystemTranscript,
  normalizeChildNameForIdentity,
  sanitizeChildNameForStorage,
} from "../lib/voice/phone-normalization";

const blocked = [
  "Not available",
  "not available",
  "I am not available",
  "The number you have dialed is not available. Press one to leave a message.",
  "Please leave a message after the tone.",
  "I'm sorry.",
];

for (const phrase of blocked) {
  assert.equal(sanitizeChildNameForStorage(phrase), null, `${phrase} must not be stored as a name`);
  assert.equal(normalizeChildNameForIdentity(phrase), null, `${phrase} must not create an identity key`);
  assert.equal(learnerKeyFor("+18604367048", phrase), null, `${phrase} must not create a learner key`);
}

assert.equal(looksLikePhoneSystemTranscript("The number you have dialed is not available."), true);
assert.equal(sanitizeChildNameForStorage("My name is Naomi"), null);
assert.equal(sanitizeChildNameForStorage("Naomi"), "Naomi");
assert.equal(sanitizeChildNameForStorage("sabi"), "Sabi");
assert.equal(learnerKeyFor("+18604367048", "Naomi"), "+18604367048::naomi");

console.log("Sabi name guards OK");
