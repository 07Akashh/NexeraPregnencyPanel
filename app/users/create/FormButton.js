import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const FormButtons = ({ onReset, onSubmit, isSubmitting }) => {
  return (
    <Box mt={4} display="flex" justifyContent="flex-end">
      <Button
        variant="outlined"
        sx={{
          bgcolor: "#FFFFFF",
          height: "50px",
          borderRadius: "10px",
          border: "1px solid var(--gray-gray-20, rgba(162, 161, 168, 0.20))",
          padding: "20px",
          gap: "10px",
          "&:hover": {
            bgcolor: "#10B771",
            border: "1px solid var(--gray-gray-20, #10B771)",
            "& .MuiTypography-root": {
              color: "#FFFFFF",
            },
          },
          mr: "20px",
        }}
        onClick={onReset}
      >
        <Typography
          sx={{
            color: " var(--Dark-500, #16151C)",
            fontFamily: "Poppins",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          Reset
        </Typography>
      </Button>
      <Button
        type="submit"
        variant="outlined"
        sx={{
          bgcolor: "#FFFFFF",
          height: "50px",
          borderRadius: "10px",
          border: "1px solid var(--gray-gray-20, rgba(162, 161, 168, 0.20))",
          padding: "20px",
          gap: "10px",
          "&:hover": {
            bgcolor: "#10B771",
            border: "1px solid var(--gray-gray-20, #10B771)",
            "& .MuiTypography-root": {
              color: "#FFFFFF",
            },
          },
        }}
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        <Typography
          sx={{
            color: " var(--Dark-500,rgb(21, 28, 22))",
            fontFamily: "Poppins",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          Next
        </Typography>
      </Button>
    </Box>
  );
};

export default FormButtons;
