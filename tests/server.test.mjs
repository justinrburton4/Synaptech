import assert from "node:assert/strict";
import test from "node:test";
import { mapRequestToFile } from "../server.mjs";

test("the root request serves the landing page", () => {
  assert.equal(mapRequestToFile("/"), "index.html");
});

test("asset requests remain relative to the site root", () => {
  assert.equal(mapRequestToFile("/assets/synaptech-logo.png"), "assets/synaptech-logo.png");
});

test("malformed and traversal paths are rejected", () => {
  for (const path of ["/%E0%A4%A", "/../secret.txt", "/%2e%2e/secret.txt"]) {
    assert.equal(mapRequestToFile(path), null, `${path} should be rejected`);
  }
});
