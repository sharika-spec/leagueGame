import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";

export default function PlayerList({ role, playersByRole }) {
  return (
    <Box>
      <List
        sx={{ width: "100%", maxWidth: 360, border: "solid" }}
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            align="center"
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mx={2}
            >
              <h3>{role}</h3>
            </Stack>
          </ListSubheader>
        }
      >
        <Divider />
        {playersByRole &&
          playersByRole.map((item) => (
            <ListItem key={item.id} sx={{ borderBottom: 1 }}>
              <ListItemText
                id={item.id}
                primary={item.name}
                secondary={item.team_name}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
}
