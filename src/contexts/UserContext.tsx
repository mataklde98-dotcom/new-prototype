import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUserProfile, type UserProfile } from '@/lib/auth';

export interface UserAccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  countryFlag: string;
  bundesland: string;
  schoolType?: string;
  grade?: string;
}

export type TutoringStatus = 'notActivated' | 'requestSent' | 'activated';

export interface TutoringRequestData {
  tutoringType: 'online' | 'local';
  selectedPartner: {
    id: string;
    name: string;
    phone: string;
    email: string;
    city?: string;
    openingHours?: string[];
  } | null;
  selectedSubjects: string[];
  requestDate: string;
}

interface UserContextType {
  profileImage: string;
  setProfileImage: (image: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  accountData: UserAccountData;
  setAccountData: (data: UserAccountData) => void;
  tutoringStatus: TutoringStatus;
  setTutoringStatus: (status: TutoringStatus) => void;
  tutoringRequestData: TutoringRequestData | null;
  setTutoringRequestData: (data: TutoringRequestData | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI0NSIgY3k9IjQ1IiByPSI0NSIgZmlsbD0iIzFGMjAyOCIvPgogIDxwYXRoIGQ9Ik00NSAyM0MzNi43MTU3IDIzIDMwIDI5LjcxNTcgMzAgMzhDMzAgNDYuMjg0MyAzNi43MTU3IDUzIDQ1IDUzQzUzLjI4NDMgNTMgNjAgNDYuMjg0MyA2MCAzOEM2MCAyOS43MTU3IDUzLjI4NDMgMjMgNDUgMjNaIiBmaWxsPSIjMDBENEFBIi8+CiAgPHBhdGggZD0iTTIyLjUgNzEuMjVDMjIuNSA2MS41ODk2IDMwLjMzOTYgNTMuNzUgNDAgNTMuNzVINTBDNTkuNjYwNCA1My43NSA2Ny41IDYxLjU4OTYgNjcuNSA3MS4yNVY3OC43NUMyNS41IDc4Ljc1IDIyLjUgNzguNzUgMjIuNSA3MS4yNVoiIGZpbGw9IiMwMEQ0QUEiLz4KPC9zdmc+';

const DEFAULT_ACCOUNT_DATA: UserAccountData = {
  firstName: 'Alexander Johannes',
  lastName: 'Baum',
  email: 'alexanderbaum@gmail.com',
  phone: '123 456789',
  countryCode: '+49',
  countryFlag: '🇩🇪',
  bundesland: 'Bayern',
  schoolType: 'Gymnasium',
  grade: '10'
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profileImage, setProfileImageState] = useState<string>(DEFAULT_AVATAR);
  const [userName, setUserNameState] = useState<string>('Alexander Johannes Baum');
  const [accountData, setAccountDataState] = useState<UserAccountData>(DEFAULT_ACCOUNT_DATA);
  const [tutoringStatus, setTutoringStatusState] = useState<TutoringStatus>('notActivated');
  const [tutoringRequestData, setTutoringRequestDataState] = useState<TutoringRequestData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('userProfileImage');
    const savedName = localStorage.getItem('userName');
    const savedAccountData = localStorage.getItem('userAccountData');
    
    // Load tutoring state
    const savedTutoringStatus = localStorage.getItem('tutoringStatus') as TutoringStatus | null;
    const savedTutoringRequestData = localStorage.getItem('tutoringRequestData');
    if (savedTutoringStatus) setTutoringStatusState(savedTutoringStatus);
    if (savedTutoringRequestData) {
      try { setTutoringRequestDataState(JSON.parse(savedTutoringRequestData)); } catch (e) { /* ignore */ }
    }

    // ✅ Use centralized auth utils
    const userProfile = getCurrentUserProfile();
    
    // Check for userData from login/register
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        
        // Update account data from userData
        const updatedAccountData = {
          firstName: userData.firstName || userProfile.firstName,
          lastName: userData.lastName || userProfile.lastName,
          email: userData.email || userProfile.email,
          phone: DEFAULT_ACCOUNT_DATA.phone,
          countryCode: DEFAULT_ACCOUNT_DATA.countryCode,
          countryFlag: DEFAULT_ACCOUNT_DATA.countryFlag,
          bundesland: userData.bundesland || DEFAULT_ACCOUNT_DATA.bundesland,
          schoolType: userData.schoolType || DEFAULT_ACCOUNT_DATA.schoolType,
          grade: userData.grade || DEFAULT_ACCOUNT_DATA.grade
        };
        
        setAccountDataState(updatedAccountData);
        localStorage.setItem('userAccountData', JSON.stringify(updatedAccountData));
        
        // Update userName
        const fullName = `${userData.firstName || userProfile.firstName} ${userData.lastName || userProfile.lastName}`;
        setUserNameState(fullName);
        localStorage.setItem('userName', fullName);
        
        return;
      } catch (e) {
        console.error('Failed to parse userData:', e);
      }
    }
    
    // Fallback to saved data or mock user
    if (savedImage) {
      setProfileImageState(savedImage);
    }
    if (savedName) {
      setUserNameState(savedName);
    } else {
      // Use mock user data as default
      const fullName = `${userProfile.firstName} ${userProfile.lastName}`;
      setUserNameState(fullName);
      localStorage.setItem('userName', fullName);
    }
    if (savedAccountData) {
      // Merge saved data with defaults to fill any missing fields (e.g. schoolType/grade added later)
      const parsed = JSON.parse(savedAccountData);
      const merged = { ...DEFAULT_ACCOUNT_DATA, ...parsed };
      // Backfill schoolType & grade if they were never set
      if (!merged.schoolType) merged.schoolType = DEFAULT_ACCOUNT_DATA.schoolType;
      if (!merged.grade) merged.grade = DEFAULT_ACCOUNT_DATA.grade;
      setAccountDataState(merged);
      localStorage.setItem('userAccountData', JSON.stringify(merged));
    } else {
      const defaultData = {
        ...DEFAULT_ACCOUNT_DATA,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
      };
      setAccountDataState(defaultData);
      localStorage.setItem('userAccountData', JSON.stringify(defaultData));
    }
  }, []);

  // Save to localStorage and update state
  const setProfileImage = (image: string) => {
    setProfileImageState(image);
    localStorage.setItem('userProfileImage', image);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('userName', name);
  };

  const setAccountData = (data: UserAccountData) => {
    setAccountDataState(data);
    localStorage.setItem('userAccountData', JSON.stringify(data));
    // Update userName when account data changes
    const fullName = `${data.firstName} ${data.lastName}`;
    setUserName(fullName);
  };

  const setTutoringStatus = (status: TutoringStatus) => {
    setTutoringStatusState(status);
    localStorage.setItem('tutoringStatus', status);
  };

  const setTutoringRequestData = (data: TutoringRequestData | null) => {
    setTutoringRequestDataState(data);
    if (data) {
      localStorage.setItem('tutoringRequestData', JSON.stringify(data));
    } else {
      localStorage.removeItem('tutoringRequestData');
    }
  };

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, userName, setUserName, accountData, setAccountData, tutoringStatus, setTutoringStatus, tutoringRequestData, setTutoringRequestData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Return safe defaults when used outside UserProvider (e.g. Figma preview)
    return {
      profileImage: DEFAULT_AVATAR,
      setProfileImage: () => {},
      userName: `${DEFAULT_ACCOUNT_DATA.firstName} ${DEFAULT_ACCOUNT_DATA.lastName}`,
      setUserName: () => {},
      accountData: DEFAULT_ACCOUNT_DATA,
      setAccountData: () => {},
      tutoringStatus: 'notActivated',
      setTutoringStatus: () => {},
      tutoringRequestData: null,
      setTutoringRequestData: () => {},
    } as UserContextType;
  }
  return context;
};