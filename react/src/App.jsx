import { Box, Stack, ThemeProvider, createTheme } from "@mui/material"
import { useState } from "react"
import Sidebar from "./comps/Sidebar"
import Main from "./comps/Main"
import Navbar from "./comps/Navbar"

function App() {
  const [mode, setMode] = useState('light')

  const darkTheme = createTheme({
    palette: {
      mode: mode
    }
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor={'background.default'} color={'text.primary'}>
        <Navbar/>
        <Stack direction='row' spacing={2} justifyContent='space-between'>
          <Sidebar setMode={setMode} mode={mode}/>
          <Main/>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}

export default App
