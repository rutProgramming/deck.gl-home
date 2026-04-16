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

export const PlaneEditor = observer(function PlaneEditor() {
    const selectedMapObject = mapObjectsStore.selectedMapObject;

    const [editName, setEditName] = useState("");

    useEffect(() => {
        setEditName(selectedMapObject?.name ?? "");
    }, [selectedMapObject?.id,selectedMapObject?.name]);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedMapObject) return;
        renameMapObject(selectedMapObject.id, editName);
    };

    if (!selectedMapObject) {
        return (
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    Click a plane on the map or in the list.
                </Typography>
            </Paper>
        );
    }

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
                        Country of Origin {selectedMapObject.country}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Heading {selectedMapObject.heading}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Latitude {selectedMapObject.geoLocation.lat}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Longitude {selectedMapObject.geoLocation.lon}
                    </Typography>

                </Box>

                <Button type="submit" variant="contained" fullWidth>
                    Save
                </Button>
            </Box>
        </Paper>
    );
});