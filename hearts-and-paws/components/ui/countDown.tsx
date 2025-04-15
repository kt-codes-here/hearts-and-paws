import { useState, useEffect } from "react";

function Countdown({ appointmentDate }: { appointmentDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function updateTime() {
      const target = new Date(appointmentDate).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }
    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [appointmentDate]);

  return <div className="text-sm text-gray-600 mt-2">Time Remaining: {timeLeft}</div>;
}

export default Countdown;
