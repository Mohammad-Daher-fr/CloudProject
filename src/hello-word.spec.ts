/*import { describe, expect, it } from '@jest/globals';
import { helloWorld } from './hello-world';

describe('typeScript test suite', () => {
  it('should return "Hello world!"', () => {
    expect.assertions(1);
    expect(helloWorld()).toBe('Hello, World!');
  });
});*/
import { describe, expect, it } from '@jest/globals';
import { getSystemInformation } from "./index";

describe("getSystemInformation()", () => {
  it("devrait renvoyer toutes les clés système attendues", async () => {
    const info = await getSystemInformation();
    expect(info).toHaveProperty("cpu");
    expect(info).toHaveProperty("system");
    expect(info).toHaveProperty("mem");
    expect(info).toHaveProperty("os");
    expect(info).toHaveProperty("currentLoad");
    expect(info).toHaveProperty("processes");
    expect(info).toHaveProperty("diskLayout");
    expect(info).toHaveProperty("networkInterfaces");
  });

  it("devrait contenir des valeurs plausibles pour la mémoire", async () => {
    const info = await getSystemInformation();
    expect(info.mem.total).toBeGreaterThan(0);
    expect(info.mem.free).toBeGreaterThanOrEqual(0);
  });
});

