import { Box, Typography } from "@mui/material";

function ErrorPage() {
    return (
        <Box className="error-404" sx={{
            display: 'flex', flexDirection: "column", gap:"1em", justifyContent: 'center', alignItems: 'center', width: '100vw', height:'100vh'
        }}>
            <Typography variant="h1">Oops</Typography>
            <Typography variant="h2">404 Error</Typography>
            <Typography variant="h3">Page Not Found</Typography>
        </Box>
    )
}

export default ErrorPage;