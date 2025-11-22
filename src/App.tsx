import { Route, Routes } from "react-router";
import Auth from "./pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
    </Routes>
  );
}

export default App;
