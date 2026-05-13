import { BrowserRouter } from "react-router";
import { AppRouter } from "@/app/routes/AppRouter";

const App = () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);

export default App;
