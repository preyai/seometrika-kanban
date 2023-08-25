import { useEffect } from "react"
import auth, { authenticate, logout, reAuthenticate } from "./redux/auth"
import { useAppDispatch, useAppSelector } from "./hooks/redux"
import { Button, Typography } from "@mui/material"


function App() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.auth)

  useEffect(() => {
    dispatch(reAuthenticate())
  }, [])

  const handlerOne = () => {
    dispatch(authenticate({
      email: 'preyaizman@yandex.ru',
      password: '0507spase'
    }))
  }

  const handlerTwo = () => {
    dispatch(logout())
  }

  return (
    <>
      <Typography>{auth.token}</Typography>
      <Button onClick={handlerOne}>login</Button>
      <Button onClick={handlerTwo}>logout</Button>
    </>
  )
}

export default App
