import { useEffect, useState } from "react";

export default function useCountdown(targetTime) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!targetTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(targetTime);
      const diff = end - now;

      if (diff <= 0) {
        setRemaining("0s");
        return;
      }

      const hrs = Math.floor(diff / 1000 / 3600);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setRemaining(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return remaining;
}
