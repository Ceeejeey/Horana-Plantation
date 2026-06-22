import { API_ROUTES, getApiBaseUrl } from "../api";

describe("shared api helpers", () => {
  it("exposes gemini chat route", () => {
    expect(API_ROUTES.geminiChat).toBe("/api/gemini/chat");
  });

  it("exposes release status route", () => {
    expect(API_ROUTES.releaseStatus).toBe("/api/app/release-status");
  });

  it("defaults API base URL to empty string in Node", () => {
    expect(getApiBaseUrl()).toBe("");
  });
});
