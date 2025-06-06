import { ParticleSystem } from "./components/ParticleSystem"
import "./App.css"
import { Provider } from "react-redux"
import { store } from "./store"

function App() {


    return (
        <Provider store={store}>
            <div className="app-container">
                <ParticleSystem />
            </div>
        </Provider>
    )
}

export default App
