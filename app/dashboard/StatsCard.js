import { Paper, Typography, Box, alpha } from "@mui/material";

const StatsCard = ({ Icon, value, title, color = "#EEE" }) => {
    return (
        <Paper sx={{ padding: "20px 25px", display: "flex", alignItems: "center", borderRadius: '10px' }}>
            <Box
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: alpha(color, 0.2),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px",
                }}
            >
             <Icon sx={{ width: 24, height: 24, color:color }} />
            </Box>

            {/* Value & Title */}
            <Box>
                <Typography 
                className="nunito-val"
                    sx={{
                        fontFamily: 'var(--font-nunito)',
                        color: "#1e1e1e",
                        fontFamily: "Nunito",
                        fontSize: "22px",
                        fontStyle: "normal",
                        fontWeight: 800,
                        lineHeight: "normal",
                    }}
                >
                    {value}
                </Typography>
                <Typography
                    sx={{
                        fontFamily: 'var(--font-nunito)',
                        color: "#030229",
                        fontFamily: "Nunito",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                    }}
                >
                    {title}
                </Typography>
            </Box>
        </Paper>
    );
};

export default StatsCard;
