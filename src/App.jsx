import { BrowserRouter } from "react-router-dom";
import { BaseRouting } from "./routing/BaseRouting";
import './app.css'
import { AlertProvider } from "./context/customContext/AlertContext";
const App = () => {
    return (
        <AlertProvider>
        <BrowserRouter basename="/">
            <BaseRouting />
        </BrowserRouter>
        </AlertProvider>
    );
};

export default App;
