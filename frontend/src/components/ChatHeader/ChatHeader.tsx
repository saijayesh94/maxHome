import React from "react";
import { Grid, Avatar, Typography, Divider } from "@mui/joy";
import logo from "../../logo.svg";

interface ChatHeaderProps {
  hide?: boolean;
}

function ChatHeader({ hide }: ChatHeaderProps) {
  return (
    // <Grid container direction="column" alignItems="center" sx={{ width: '90%' }}>
    <>
      <Grid>
        <Avatar
          size="lg"
          variant="outlined"
          sx={{
            width: "var(--Avatar-size, 3rem)",
            height: "var(--Avatar-size, 3rem)",
            marginBottom: "24px",
            borderRadius: "8px",
            backgroundColor: "transparent",
            "& img": {
              objectFit: "contain",
              backgroundColor: "white",
            },
          }}
          src={logo}
        />
      </Grid>
      <Grid>
        <Typography
          level="title-md"
          sx={{
            marginBottom: "5px",
            fontFamily: "Inter, sans-serif !important",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#2B3340",
          }}
        >
          MaxHome Offer Creation
        </Typography>
      </Grid>
      <Grid>
        <Typography
          level="body-md"
          sx={{
            fontFamily: "Inter, sans-serif !important",
            fontSize: "14px",
            color: "#697386",
          }}
        >
          Elevate your Real Estate Business with AI
        </Typography>
      </Grid>

      <Divider
        sx={{
          marginY: hide ? "10px" : "24px",
          marginBottom: hide ? 0 : "24px",
        }}
      >
        {/* <Chip
          sx={{
            fontFamily: 'Inter, sans-serif !important',
            fontSize: '11px',
          }}
        >
          Today
        </Chip> */}
      </Divider>
    </>
    // </Grid>
  );
}

export default ChatHeader;
