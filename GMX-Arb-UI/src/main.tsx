import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from './ErrorPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SocketContextProvider } from './Context/SocketContext.tsx'
import { PositionProvider } from './Context/PositionContext.tsx'
import { BotProvider } from './Context/BotContext.tsx'
import About from './About.tsx'
import PrivacyPolicy from './Privacy.tsx'
import Onboarding from './onboarding/Onboarding.tsx'
import App from './App.tsx'
import Faq from './Faq.tsx'
import {NotificationProvider} from './Context/NotificationContext.tsx'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './styledComponent/customTheme'
import { AccountProvider } from './Context/AccountContext.tsx'
import { OsProvider } from './Context/DownloaderContext.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "onboarding",
    element: <Onboarding />,
  },
  {
    path: "privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "faq",
    element: <Faq />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketContextProvider>
        <PositionProvider>
          <AccountProvider>
            <BotProvider>
              <NotificationProvider>
                <OsProvider>
                <RouterProvider router={router} />
                </OsProvider>
              </ NotificationProvider>
            </BotProvider>
          </AccountProvider>
        </ PositionProvider>
      </SocketContextProvider>
    </ThemeProvider>
  </React.StrictMode>
)