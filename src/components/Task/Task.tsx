import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

type TaskProps = {
    label: string
}

function Task({ label }: TaskProps) {
    return (
        <Card sx={{ marginBottom: 1 }}>
            <CardContent>

                <Typography variant="h5" component="div">
                    {label}
                </Typography>

                <Typography variant="body2">
                    task description
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}

export default Task