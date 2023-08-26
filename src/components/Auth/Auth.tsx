import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Avatar, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { authenticate } from "../../redux/auth";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const auth = useAppSelector(store => store.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.user !== null)
            navigate("/")
    }, [auth])

    const submit = () => {
        dispatch(authenticate({
            email,
            password
        }))
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="div" sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(v) => setEmail(v.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(v) => setPassword(v.target.value)}
                    />

                    {auth.error &&
                        <Alert severity="error">{auth.error}</Alert>
                    }

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={submit}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default Auth