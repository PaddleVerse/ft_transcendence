'use client';
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define the state type
interface GlobalState {
  // Your global state properties go here
  user: any;
  socket: any;
  show: boolean;
  GameStatus: string | null;
  GameInviteID: string | null;
}

// Define action types
type Action =
  | { type: 'UPDATE_USER'; payload: any }
  | { type: 'UPDATE_SOCKET'; payload: any }
  | { type: 'UPDATE_SHOW'; payload: boolean }
  | { type: 'UPDATE_GAMESTATUS'; payload: string | null }
  | { type: 'UPDATE_GAMEINVITEID'; payload: string | null }

// Define initial state
const initialState: GlobalState = {
  user: null,
  socket: null,
  show: true,
  GameStatus: null,
  GameInviteID: null,
};

// Create context
const GlobalStateContext = createContext<{ state: GlobalState; dispatch: Dispatch<Action> } | undefined>(undefined);

// Define the reducer function
const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_SOCKET':
      return { ...state, socket: action.payload };
    case 'UPDATE_SHOW':
      return { ...state, show: action.payload };
    case 'UPDATE_GAMESTATUS':
      return { ...state, GameStatus: action.payload };
    case 'UPDATE_GAMEINVITEID':
      return { ...state, GameInviteID: action.payload };
    default:
      return state;
  }
};

// Create the provider
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Create a custom hook to use the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
