import { Button, CardActions, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { Tasks } from "kanban-api";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { changeTask } from "../../redux/board";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuButtonAddImage, MenuButtonAddTable, MenuButtonBold, MenuButtonItalic, MenuControlsContainer, MenuDivider, MenuSelectHeading, RichTextEditorProvider, RichTextField } from "mui-tiptap";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";

type TaskDetailProps = {
    task: Tasks
}



function TaskDetail({ task }: TaskDetailProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(task.description)
    const [changed, setChanged] = useState(false)

    const dispatch = useAppDispatch()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image
        ],
        content: value,
        onUpdate: (e) => setValue(e.editor.getHTML()),

    });

    useEffect(() => {
        setChanged(task.description !== value)
    }, [value, task])

    const saveHandler = () => {
        dispatch(changeTask({
            taskId: task._id.toString(),
            task: {
                description: value
            }
        }))
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL')

        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    return (
        <RichTextEditorProvider editor={editor}>
            <CardActions>
                <Button size="small" onClick={() => setOpen(true)}>Show More</Button>
            </CardActions>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth='md'
                fullWidth={true}
            >
                <DialogContent>
                    <Typography variant="h4" component="h2">
                        {task.number}. {task.title}
                    </Typography>

                    <TextField
                        multiline
                        variant="standard"
                        fullWidth={true}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />

                    <RichTextField
                        controls={
                            <MenuControlsContainer>
                                <MenuSelectHeading />
                                <MenuDivider />
                                <MenuButtonBold />
                                <MenuButtonItalic />
                                <MenuButtonAddImage onClick={addImage} />
                                {/* Add more controls of your choosing here */}
                            </MenuControlsContainer>
                        }
                    />

                    {changed &&
                        <Button
                            onClick={saveHandler}
                        >
                            Save
                        </Button>
                    }
                </DialogContent>
            </Dialog>
        </RichTextEditorProvider>
    )
}

export default TaskDetail