import { Routes, Route } from "react-router-dom";
import TopShows from "./components/TopShows";
import ShowInfo from "./components/ShowInfo";
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TopShows />} />
        <Route path="/:id" element={<ShowInfo />} />
      </Routes>

    </div>
  );
}

export default App;
