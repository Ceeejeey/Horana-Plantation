import type { ReleaseStatus } from "@horana/shared";
import { getFirestore } from "./firestore";

const RELEASE_DOC_PATH = "appConfig/release";

export async function getReleaseStatus(): Promise<ReleaseStatus> {
  const snap = await getFirestore().doc(RELEASE_DOC_PATH).get();

  if (!snap.exists) {
    return { released: false };
  }

  const data = snap.data();
  const updatedAt = data?.updatedAt;

  return {
    released: data?.released === true,
    updatedAt:
      updatedAt && typeof updatedAt.toDate === "function"
        ? updatedAt.toDate().toISOString()
        : typeof updatedAt === "string"
          ? updatedAt
          : undefined,
  };
}
