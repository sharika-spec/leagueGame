import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

const Header = ({ children }) => {
  return (
    <Box>
      <Stack direction="row" m={2} justifyContent="space-between">
        {children}
      </Stack>
    </Box>
  );
};

export default Header;
