import { useEffect, useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Divider
} from "@mui/material";
import { mapObjectsStore } from "../../store/mapObjectStore.store";
import { renameMapObject } from "../../services/workerClient";
import type { Plane } from "../../models/Plane";
import SelectPlaneToEdit from "./SelectPlaneToEdit";

export const PlaneEditor = observer(function PlaneEditor() {
    const selectedMapObject = mapObjectsStore.selectedMapObject;
    const [editName, setEditName] = useState("");

    useEffect(() => {
        setEditName(selectedMapObject?.name ?? "");
    }, [selectedMapObject?.id,selectedMapObject?.name]);

     if (!selectedMapObject || selectedMapObject.type !== "plane") {
        return <SelectPlaneToEdit />         
    }
    const plane = selectedMapObject as Plane;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!plane) return;
        renameMapObject(plane.id, editName);
    };


    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
                Edit Plane Info
            </Typography>

            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                <TextField
                    label="Plane Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Country of Origin {plane.country}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Heading {plane.heading}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Latitude {plane.geoLocation.lat}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Longitude {plane.geoLocation.lon}
                    </Typography>

                </Box>

                <Button type="submit" variant="contained" fullWidth disabled={editName === plane.name}>
                    Save
                </Button>
            </Box>
        </Paper>
    );
});