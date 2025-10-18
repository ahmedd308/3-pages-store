import { createSlice } from "@reduxjs/toolkit";

interface ILockState {
  isLocked: boolean;
  lastActivityTime: number;
}

const initialState: ILockState = {
  isLocked: false,
  lastActivityTime: Date.now(),
};

const lockSlice = createSlice({
  name: "lock",
  initialState,
  reducers: {
    lockApp: (state) => {
      state.isLocked = true;
    },
    unlockApp: (state) => {
      state.isLocked = false;
      state.lastActivityTime = Date.now();
    },
    updateActivity: (state) => {
      state.lastActivityTime = Date.now();
    },
  },
});

export const { lockApp, unlockApp, updateActivity } = lockSlice.actions;
export default lockSlice.reducer;

export const selectIsLocked = (state: { lock: ILockState }) =>
  state.lock.isLocked;
export const selectLastActivityTime = (state: { lock: ILockState }) =>
  state.lock.lastActivityTime;
