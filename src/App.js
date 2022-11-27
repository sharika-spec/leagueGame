// import './App.css';
import PlayerTable from './components/PlayerTable';

export const config = {
  endpoint: `https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_Players_of_match.json`,
};


function App() {
  return (
    <div >
      <PlayerTable/>
    </div>
  );
}

export default App;