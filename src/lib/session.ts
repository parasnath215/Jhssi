import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'ad_session_id';

export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
};