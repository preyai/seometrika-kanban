import { useAppSelector } from "./hooks/redux"
import Navigation from "./components/Navigation"
import Auth from "./components/Auth"
import Board from "./components/Board/Board"


function App() {
  const auth = useAppSelector(state => state.auth)

  return (
    <>
      {auth.user !== null ?
        <Navigation>
          <Board />
        </Navigation>
        :
        <Auth />
      }
    </>
  )
}

export default App
