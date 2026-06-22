import { getReleaseStatus } from "../services/release";
import { getFirestore } from "../services/firestore";

jest.mock("../services/firestore", () => ({
  getFirestore: jest.fn(),
}));

describe("getReleaseStatus", () => {
  const getMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getFirestore as jest.Mock).mockReturnValue({
      doc: () => ({ get: getMock }),
    });
  });

  it("returns released false when document is missing", async () => {
    getMock.mockResolvedValue({ exists: false });
    await expect(getReleaseStatus()).resolves.toEqual({ released: false });
  });

  it("returns released true when flag is set", async () => {
    getMock.mockResolvedValue({
      exists: true,
      data: () => ({ released: true }),
    });
    await expect(getReleaseStatus()).resolves.toEqual({ released: true });
  });

  it("treats non-boolean released as false", async () => {
    getMock.mockResolvedValue({
      exists: true,
      data: () => ({ released: "yes" }),
    });
    await expect(getReleaseStatus()).resolves.toEqual({ released: false });
  });
});
