// ===== USE TEACHER PROFILE DATA =====
// Abstraktionsschicht für Teacher Profile Daten.
// Aktuell: Mock-Daten. Später: API-Call via Supabase/REST.
//
// USAGE:
//   const { teacher, upcomingMeetings, pastMeetings, documents, isLoading } = useTeacherProfileData(teacherId);

import { useMemo } from 'react';
import {
  getTeacherProfile,
  getTeacherMeetings,
  getTeacherDocuments,
} from '@/mocks/teacherProfile.mock';
import type {
  TeacherProfile,
  TeacherMeeting,
  SharedDocument,
} from '@/mocks/teacherProfile.mock';

export interface TeacherProfileData {
  teacher: TeacherProfile | null;
  upcomingMeetings: TeacherMeeting[];
  pastMeetings: TeacherMeeting[];
  documents: SharedDocument[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook für Teacher-Profile-Daten.
 * Gibt alle teacher-scoped Daten zurück (Profil, Meetings, Dokumente).
 * 
 * @param teacherId - ID des Lehrers (null = kein Lehrer ausgewählt)
 * @returns TeacherProfileData
 * 
 * TODO: Für API-Integration ersetze die Mock-Calls durch:
 *   const { data, isLoading, error } = useSWR(`/api/teachers/${teacherId}`, fetcher);
 */
export function useTeacherProfileData(teacherId: string | null): TeacherProfileData {
  return useMemo(() => {
    if (!teacherId) {
      return {
        teacher: null,
        upcomingMeetings: [],
        pastMeetings: [],
        documents: [],
        isLoading: false,
        error: null,
      };
    }

    const teacher = getTeacherProfile(teacherId);
    if (!teacher) {
      return {
        teacher: null,
        upcomingMeetings: [],
        pastMeetings: [],
        documents: [],
        isLoading: false,
        error: `Teacher with ID ${teacherId} not found`,
      };
    }

    const { upcoming, past } = getTeacherMeetings(teacherId);
    const documents = getTeacherDocuments(teacherId);

    return {
      teacher,
      upcomingMeetings: upcoming,
      pastMeetings: past,
      documents,
      isLoading: false,
      error: null,
    };
  }, [teacherId]);
}
