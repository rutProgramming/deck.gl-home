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
import SelectPlaneToEdit from "./SelectPlaneToEdit";
import { mapStore } from "../../store/mapstore";

export const PlaneEditor = observer(function PlaneEditor() {    
    const selectedPlane = mapStore.planeStore.selectedPlane;
    const [editName, setEditName] = useState("");

    useEffect(() => {
        setEditName(selectedPlane?.name ?? "");
    }, [selectedPlane?.id,selectedPlane?.name]);

     if (!selectedPlane) {
        return <SelectPlaneToEdit />         
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedPlane) return;
        mapStore.planeStore.renameMapObject(selectedPlane.id, editName);
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
                        Country of Origin {selectedPlane.country}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Latitude {selectedPlane.geoLocation.lat}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Longitude {selectedPlane.geoLocation.lon}
                    </Typography>

                </Box>

                <Button type="submit" variant="contained" fullWidth disabled={editName === selectedPlane.name}>
                    Save
                </Button>
            </Box>
        </Paper>
    );
});