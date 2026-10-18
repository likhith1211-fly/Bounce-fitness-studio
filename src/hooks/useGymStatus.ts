import { useState, useEffect } from 'react';

export interface GymStatusInfo {
  isOpen: boolean;
  statusLabel: string;
  statusSubtext: string;
  istTimeFormatted: string;
  istDateFormatted: string;
  hoursToday: string;
  nextEvent: string;
}

export function useGymStatus(): GymStatusInfo {
  const [status, setStatus] = useState<GymStatusInfo>(() => computeGymStatus());

  useEffect(() => {
    // Update every second for real-time responsiveness
    const timer = setInterval(() => {
      setStatus(computeGymStatus());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return status;
}

function computeGymStatus(): GymStatusInfo {
  const now = new Date();

  // Convert to Indian Standard Time (Asia/Kolkata) where Bounce Fitness Studio is located
  const istFormatterTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const istFormatterDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const istTimeFormatted = istFormatterTime.format(now);
  const istDateFormatted = istFormatterDate.format(now);

  // Extract day, hour, minute in IST
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now);

  let dayStr = '';
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === 'weekday') dayStr = part.value;
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }

  const isSunday = dayStr === 'Sun';
  const currentMinutes = hour * 60 + minute;
  const openMinutes = 5 * 60 + 30; // 5:30 AM = 330
  const closeMinutes = 21 * 60; // 9:00 PM = 1260

  let isOpen = false;
  let statusLabel = 'CLOSED NOW';
  let statusSubtext = '';
  let hoursToday = isSunday ? 'Closed' : '5:30 AM – 9:00 PM';
  let nextEvent = '';

  if (isSunday) {
    isOpen = false;
    statusLabel = 'CLOSED TODAY';
    statusSubtext = 'Opens Monday at 5:30 AM IST';
    nextEvent = 'Opens Monday 5:30 AM';
  } else if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    isOpen = true;
    statusLabel = 'OPEN NOW';
    const remainingMins = closeMinutes - currentMinutes;
    const remHours = Math.floor(remainingMins / 60);
    const remMins = remainingMins % 60;
    const timeText = remHours > 0 ? `${remHours}h ${remMins}m` : `${remMins}m`;
    statusSubtext = `Open until 9:00 PM IST (Closes in ${timeText})`;
    nextEvent = 'Closes at 9:00 PM';
  } else if (currentMinutes < openMinutes) {
    isOpen = false;
    statusLabel = 'CLOSED NOW';
    const remainingMins = openMinutes - currentMinutes;
    const remHours = Math.floor(remainingMins / 60);
    const remMins = remainingMins % 60;
    const timeText = remHours > 0 ? `${remHours}h ${remMins}m` : `${remMins}m`;
    statusSubtext = `Opens today at 5:30 AM IST (in ${timeText})`;
    nextEvent = 'Opens at 5:30 AM';
  } else {
    // After 9:00 PM
    isOpen = false;
    statusLabel = 'CLOSED NOW';
    if (dayStr === 'Sat') {
      statusSubtext = 'Closed for the night. Opens Monday at 5:30 AM IST';
      nextEvent = 'Opens Monday 5:30 AM';
    } else {
      statusSubtext = 'Closed for the night. Opens tomorrow at 5:30 AM IST';
      nextEvent = 'Opens tomorrow 5:30 AM';
    }
  }

  return {
    isOpen,
    statusLabel,
    statusSubtext,
    istTimeFormatted,
    istDateFormatted,
    hoursToday,
    nextEvent,
  };
}
