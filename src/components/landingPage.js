import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Hero from './Hero';
// import LogoCollection from './LogoCollection';
import getLPTheme from './getLPTheme';

export default function LandingPage() {
    const [mode, setMode] = React.useState('light');
    const [showCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });


    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <Hero />

        </ThemeProvider>
    );
}