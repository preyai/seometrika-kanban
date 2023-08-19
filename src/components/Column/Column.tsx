import { Paper } from "@mui/material";
import { PropsWithChildren } from "react";

function Column({ children }: PropsWithChildren) {
    return (
        <Paper sx={{
            width: "300px",
            padding: 1
        }}>
            {children}
        </Paper>
    )
}

export default Column