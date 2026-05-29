// ===== MEETING RATINGS HOOK =====
// Stores meeting ratings in-memory (later: Supabase)
// Rating: 1-4 smiley scale + optional message

import { useState, useCallback } from 'react';

export interface MeetingRating {
  meetingId: string;
  rating: 1 | 2 | 3 | 4; // 1=Schlecht, 2=Ok, 3=Gut, 4=Super
  message: string;
  createdAt: Date;
}

// Singleton store so ratings persist across component mounts
const ratingsStore = new Map<string, MeetingRating>();

export function useMeetingRatings() {
  const [ratings, setRatings] = useState<Map<string, MeetingRating>>(new Map(ratingsStore));

  const submitRating = useCallback((meetingId: string, rating: 1 | 2 | 3 | 4, message: string) => {
    const entry: MeetingRating = {
      meetingId,
      rating,
      message,
      createdAt: new Date(),
    };
    ratingsStore.set(meetingId, entry);
    setRatings(new Map(ratingsStore));
  }, []);

  const getRating = useCallback((meetingId: string): MeetingRating | undefined => {
    return ratingsStore.get(meetingId);
  }, []);

  const hasRating = useCallback((meetingId: string): boolean => {
    return ratingsStore.has(meetingId);
  }, []);

  return { ratings, submitRating, getRating, hasRating };
}
