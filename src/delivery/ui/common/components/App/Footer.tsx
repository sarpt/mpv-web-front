import { styled } from "@mui/material";

export const Footer = styled('div')(({ theme }) => ({
  padding: '10px 0 10px 0', 
  flexShrink: 0,
  flexGrow: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'column'
}));
