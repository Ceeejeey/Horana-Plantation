import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import type { ReleaseStatus } from "@horana/shared";
import { getDb } from "@/lib/firebase";

interface UseReleaseStatusResult {
  released: boolean;
  loading: boolean;
  error: string | null;
  /** True when VITE_RELEASE_OVERRIDE is set (Firestore skipped). */
  usingLocalOverride: boolean;
}

const DEFAULT_STATUS: ReleaseStatus = { released: false };

/** Temporary local flag — set VITE_RELEASE_OVERRIDE=true|false in apps/web/.env */
function parseReleaseOverride(): boolean | null {
  const value = import.meta.env.VITE_RELEASE_OVERRIDE;
  if (value === undefined || value === null) return null;

  let raw = String(value).trim().toLowerCase();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  if (!raw) return null;

  if (raw === "true" || raw === "1" || raw === "on" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "off" || raw === "no") return false;

  console.warn(
    `[release] Invalid VITE_RELEASE_OVERRIDE="${value}" — use true or false`,
  );
  return null;
}

export function useReleaseStatus(): UseReleaseStatusResult {
  const localOverride = parseReleaseOverride();
  const [status, setStatus] = useState<ReleaseStatus>(() =>
    localOverride === null ? DEFAULT_STATUS : { released: localOverride },
  );
  const [loading, setLoading] = useState(localOverride === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localOverride !== null) {
      if (import.meta.env.DEV) {
        console.info(
          `[release] Local override active — released: ${localOverride} (Firestore skipped)`,
        );
      }
      setStatus({ released: localOverride });
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const applyStatus = (next: ReleaseStatus) => {
      if (!cancelled) {
        setStatus(next);
        setLoading(false);
      }
    };

    try {
      const releaseRef = doc(getDb(), "appConfig", "release");

      const unsubscribe = onSnapshot(
        releaseRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            applyStatus(DEFAULT_STATUS);
            return;
          }

          const data = snapshot.data();
          applyStatus({ released: data.released === true });
          setError(null);
        },
        (snapshotError) => {
          console.warn("Firestore release listener failed:", snapshotError);
          if (!cancelled) {
            setError(
              "Could not load release status. Check apps/web/.env and Firestore rules.",
            );
            applyStatus(DEFAULT_STATUS);
          }
        },
      );

      return () => {
        cancelled = true;
        unsubscribe();
      };
    } catch (initError) {
      const message =
        initError instanceof Error ? initError.message : "Firebase init failed.";
      console.warn(message);
      if (!cancelled) {
        setError(
          `${message} Copy .env.example to .env in the project root.`,
        );
        applyStatus(DEFAULT_STATUS);
      }
      return () => {
        cancelled = true;
      };
    }
  }, [localOverride]);

  return {
    released: status.released,
    loading,
    error,
    usingLocalOverride: localOverride !== null,
  };
}
