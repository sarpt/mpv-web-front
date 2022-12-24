import { styled } from "@mui/material";

export const Footer = styled('div')(({ theme }) => ({
  height: '120px',
  flexShrink: 0,
  flexGrow: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));
