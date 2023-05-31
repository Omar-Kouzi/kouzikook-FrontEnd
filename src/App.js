import "./App.css";
import NavigationBar from "./Components/navbar/NavigationBar";
import PageRoutes from "./Components/navbar/Routes";

function App() {

  return (
    <div className="App">
      <NavigationBar />

      <PageRoutes className="pagesRouts" />
    </div>
  );
}

export default App;
