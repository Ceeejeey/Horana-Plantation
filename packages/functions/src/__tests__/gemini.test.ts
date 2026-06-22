import { SYSTEM_INSTRUCTION } from "../config/gemini";

describe("gemini config", () => {
  it("includes graph render tag instruction", () => {
    expect(SYSTEM_INSTRUCTION).toContain("<render-comparison-graph />");
  });

  it("documents six capitals framework", () => {
    expect(SYSTEM_INSTRUCTION).toContain("Financial Capital");
    expect(SYSTEM_INSTRUCTION).toContain("Natural Capital");
  });
});
