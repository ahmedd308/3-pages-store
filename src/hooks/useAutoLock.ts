import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../store/slices/auth.slice";
import {
  lockApp,
  selectIsLocked,
  updateActivity,
} from "../store/slices/lock.slice";

export function useAutoLock() {
  const dispatch = useDispatch();
  const isLocked = useSelector(selectIsLocked);
  const token = useSelector(selectCurrentToken);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only set timer if user is authenticated and app is unlocked
    if (token && !isLocked) {
      inactivityTimerRef.current = setTimeout(() => {
        dispatch(lockApp());
      }, AUTO_LOCK_TIMEOUT);
    }
  }, [token, isLocked, dispatch]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (token && !isLocked) {
      dispatch(updateActivity());
      resetInactivityTimer();
    }
  }, [token, isLocked, dispatch, resetInactivityTimer]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // App went to background
      if (
        appStateRef.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        if (token) {
          dispatch(lockApp());
        }
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, token]);

  // Set up inactivity timer
  useEffect(() => {
    if (token && !isLocked) {
      resetInactivityTimer();
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [token, isLocked, resetInactivityTimer]);

  return {
    isLocked,
    handleActivity,
  };
}

const AUTO_LOCK_TIMEOUT = 10000;
