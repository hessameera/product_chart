"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./appSlices";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: any) => augmentColor({ main: mainColor } as any);

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3c3767',
    },
    secondary: {
      main: '#3c3767',
    },
  },
});


export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </Provider>;
}