import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"


function ProjectsList() {
    return (
        <List>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText primary={"tasks"} />
                </ListItemButton>
            </ListItem>
        </List>
    )
}

export default ProjectsList