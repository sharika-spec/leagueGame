import { config } from "../App";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "./Header";
import PlayerList from "./PlayerList";
import FinalPlayerList from "./FinalPlayerList";
import axios from "axios";
import { useSnackbar } from "notistack";

const role = ["Batsman", "Wicket-Keeper", "All-Rounder", "Bowler"];
const playerLimit = ["3-7", "1-5", "0-4", "3-7"];
const totalTeam = 11;
const maxCredits = 100;

export default function PlayerTable() {
  const { enqueueSnackbar } = useSnackbar();

  const [finalTeamIds, setFinalTeamIds] = useState([]);
  const [allPlayers, setAllPlayers] = useState();
  const [groupedByRole, setGroupedByRole] = useState([]);
  const [isProceed, setIsProceed] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalPerTeam, setTotalPerTeam] = useState({
    "Melbourne Stars": 0,
    "Perth Scorchers": 0,
  });
  const [finalSquad, setFinalSquad] = useState([]);
  const [groupedfinalSquad, setGroupedFinalSquad] = useState([]);

  const [flag, setFlag] = useState(false);
  const [playerData, setPlayerData] = useState({
    Batsman: 0,
    "Wicket-Keeper": 0,
    "All-Rounder": 0,
    Bowler: 0,
  });

  const performAPICall = async () => {
    try {
      const { data } = await axios.get(config.endpoint);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
  };

  useEffect(() => {
    const callAPI = async () => {
      const response = await performAPICall();
      const arr = role.map((role) => {
        return response.filter((item) => item.role === role);
      });
      setGroupedByRole(arr);
      setAllPlayers(response);
    };
    callAPI();
  }, []);

  useEffect(() => {
    validations(totalPlayers, totalCredits, totalPerTeam, playerData);
  }, [totalPlayers, totalCredits, totalPerTeam, playerData]);

  const handleTotal = (
    count,
    credits,
    teamName,
    teamNameCount,
    roleOfPlayer,
    roleOfPlayerCount,
    id,
    isChecked
  ) => {
    setTotalPlayers((prevValue) => prevValue + count);
    setTotalCredits((prevValue) => prevValue + credits);
    setTotalPerTeam((prevState) => ({
      ...prevState,
      [teamName]: prevState[teamName] + teamNameCount,
    }));
    setPlayerData((prevState) => ({
      ...prevState,
      [roleOfPlayer]: prevState[roleOfPlayer] + roleOfPlayerCount,
    }));
    if (isChecked) setFinalTeamIds((oldArray) => [...oldArray, id]);
    else {
      const currentIndexOfIds = finalTeamIds.indexOf(id);
      const newFinalTeamIds = [...finalTeamIds];
      newFinalTeamIds.splice(currentIndexOfIds, 1);
      setFinalTeamIds(newFinalTeamIds);
    }
  };

  const validateMinMaxByRole = (playerDetails) => {
    if (
      playerDetails["Batsman"] >= 3 &&
      playerDetails["Batsman"] <= 7 &&
      playerDetails["Wicket-Keeper"] >= 1 &&
      playerDetails["Wicket-Keeper"] <= 5 &&
      playerDetails["All-Rounder"] >= 0 &&
      playerDetails["All-Rounder"] <= 4 &&
      playerDetails["Bowler"] >= 3 &&
      playerDetails["Bowler"] <= 7
    )
      return true;
    else return false;
  };
  const validations = (team, credits, perTeam, playerDetails) => {
    const flagVar = validateMinMaxByRole(playerDetails);
    setFlag(flagVar);
    if (
      team === totalTeam &&
      credits <= maxCredits &&
      perTeam["Melbourne Stars"] <= 7 &&
      perTeam["Perth Scorchers"] <= 7 &&
      flagVar
    ) {
      enqueueSnackbar("Team is selected,Click to proceed", {
        variant: "success",
        autoHideDuration: 2000,
      });
      setIsProceed(true);
    } else if (team > totalTeam) {
      enqueueSnackbar("Total players must be 11.", {
        variant: "error",
        autoHideDuration: 4000,
      });
      setIsProceed(false);
    } else if (credits > maxCredits) {
      enqueueSnackbar("You have exceeded 100 credits", {
        variant: "error",
        autoHideDuration: 4000,
      });
      setIsProceed(false);
    } else if (
      perTeam["Melbourne Stars"] > 7 ||
      perTeam["Perth Scorchers"] > 7
    ) {
      enqueueSnackbar(
        `More than 7 players in ${
          perTeam["Melbourne Stars"] > 7 ? "Melbourne Stars" : "Perth Scorchers"
        }`,
        {
          variant: "error",
          autoHideDuration: 4000,
        }
      );
      setIsProceed(false);
    } else if (team === totalTeam && flagVar === false) {
      enqueueSnackbar("Check max and min limit of player role", {
        variant: "error",
        autoHideDuration: 4000,
      });
      console.log(flagVar);
      setIsProceed(false);
    }
  };

  const handleProceed = (finalData) => {
    let playersObject = [];
    for (let i = 0; i < allPlayers.length; i++) {
      if (finalData.includes(allPlayers[i].id))
        playersObject.push(allPlayers[i]);
    }
    setFinalSquad(playersObject);
    const arr = role.map((role) => {
      return playersObject.filter((item) => item.role === role);
    });
    setGroupedFinalSquad(arr);
  };

  const handleBack = (setFinalSquad) => {
    setFinalSquad([]);
    setFinalTeamIds([]);
    setIsProceed(false);
    setTotalPlayers(0);
    setTotalCredits(0);
    setTotalPerTeam({
      "Melbourne Stars": 0,
      "Perth Scorchers": 0,
    });
    setPlayerData({
      Batsman: 0,
      "Wicket-Keeper": 0,
      "All-Rounder": 0,
      Bowler: 0,
    });
    setFlag(false);
  };
  return (
    <Box sx={{ width: "99%" }} m={1}>
      <Header>
        <div>{finalSquad.length === 0 ? "Pick Players" : "Your Squad"}</div>
        <Stack direction="row" spacing={2}>
          <div>
            Total {totalPlayers}/{totalTeam}
          </div>
          <div>Melbourne Stars {totalPerTeam["Melbourne Stars"]}</div>
          <div>Perth Scorchers {totalPerTeam["Perth Scorchers"]}</div>
          <div>Credits {100 - totalCredits} Left</div>
        </Stack>
      </Header>
      <Stack spacing={0.5}>
        <Grid
          container
          spacing={1}
          m={2}
          direction={{ xs: 'column',sm: 'column', md: 'row', lg: 'row' }}
      justifyContent={{ xs: 'center',sm: 'center', md: 'space-between', lg: 'space-around' }}
      alignItems={{ xs: 'center',sm: 'center', md: 'flex-start', lg: 'flex-start' }}
        >
          {finalSquad.length === 0
            ? role.map((value, index) => {
                return (
                  <Grid xs={12} md={3} lg={3} key={index}>
                    <PlayerList
                      role={value}
                      playersByRole={groupedByRole[index]}
                      limitByRole={playerLimit[index]}
                      handleTotal={handleTotal}
                      finalTeamIds={finalTeamIds}
                      setFinalTeamIds={setFinalTeamIds}
                      setIsProceed={setIsProceed}
                    />
                  </Grid>
                );
              })
            : role.map((value, index) => {
                return (
                  <Grid xs={12} md={3} lg={3} key={index}>
                    <FinalPlayerList
                      role={value}
                      playersByRole={groupedfinalSquad[index]}
                      limitByRole={playerLimit[index]}
                      handleTotal={handleTotal}
                      finalTeamIds={finalTeamIds}
                      setFinalTeamIds={setFinalTeamIds}
                      setIsProceed={setIsProceed}
                    />
                  </Grid>
                );
              })}
        </Grid>
        <Stack direction="row" justifyContent="center" alignItems="center">
          {finalSquad.length === 0 ? (
            <Button
              variant="contained"
              onClick={() => handleProceed(finalTeamIds)}
              disabled={isProceed ? false : true}
            >
              Proceed
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => handleBack(setFinalSquad)}
            >
              Back
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
