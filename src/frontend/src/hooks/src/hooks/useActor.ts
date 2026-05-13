import { useState, useEffect } from "react";
import { createActor } from "@/backend";

export const useActor = () => {
  const [actor, setActor] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const a = createActor();
      setActor(a);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  return { actor, isFetching, error };
};
