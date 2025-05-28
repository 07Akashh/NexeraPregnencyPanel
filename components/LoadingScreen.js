import { Box, Typography, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Nexera and Telangana Govt
      </Typography>
      <CircularProgress sx={{ mt: 3 }} />
    </Box>
  );
} 