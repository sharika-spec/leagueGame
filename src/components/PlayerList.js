import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import { useSnackbar } from "notistack";
import { Divider } from "@mui/material";

export default function PlayerList({
  role,
  playersByRole,
  limitByRole,
  handleTotal,
  finalTeamIds,
  setFinalTeamIds,
  setIsProceed,
}) {
  const [checked, setChecked] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  //   useEffect(() => {
  //     console.log("f-", finalTeamIds);
  //   }, [finalTeamIds]);

  const handleCount = (checked) => {
    if (
      !(
        (role === "All-Rounder" && checked.length <= 4) ||
        (role === "Batsman" && checked.length <= 7) ||
        (role === "Wicket-Keeper" && checked.length <= 5) ||
        (role === "Bowler" && checked.length <= 7)
      )
    ) {
      setIsProceed(false);
      enqueueSnackbar(`Exceeded max limit for ${role}`, {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };
  const handleToggle = (value, credits, teamName, role, id) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    // const currentIndexOfIds = finalTeamIds.indexOf(id);
    // const newFinalTeamIds = [...finalTeamIds];
    // const newFinalTeamIds = [];

    if (currentIndex === -1) {
      newChecked.push(value);
      handleTotal(1, credits, teamName, 1, role, 1, id, true);
      //   setFinalTeamIds(oldArray => [...oldArray, id]);
    } else {
      newChecked.splice(currentIndex, 1);
      handleTotal(-1, -credits, teamName, -1, role, -1, id, false);
      //   newFinalTeamIds.splice(currentIndexOfIds,1);
    }
    // setFinalTeamIds(newFinalTeamIds);
    setChecked(newChecked);
    handleCount(newChecked);
  };
  return (
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
            <h3>
              Pick {limitByRole} {role}
            </h3>
            <div>{checked.length}</div>
          </Stack>
        </ListSubheader>
      }
    >
      <Divider />
      {playersByRole &&
        playersByRole.map((item) => (
          <ListItem key={item.id} sx={{ borderBottom: 1 }}>
            <ListItemButton
              onClick={handleToggle(
                item.name,
                item.event_player_credit,
                item.team_name,
                role,
                item.id
              )}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(item.name) !== -1}
                />
              </ListItemIcon>
              <ListItemText
                id={item.id}
                primary={item.name}
                secondary={item.team_name}
              />
              <ListItemText primary={item.event_player_credit} />
            </ListItemButton>
          </ListItem>
        ))}
    </List>
  );
}
