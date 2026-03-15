import { useEffect, useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import { planesStore } from "../../store/planes.store";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Divider
} from "@mui/material";
import { renamePlane } from "../../services/workerClient";

export const PlaneEditor = observer(function PlaneEditor() {
    const selected = planesStore.selectedPlane;

    const [nameDraft, setNameDraft] = useState("");

    useEffect(() => {
        setNameDraft(selected?.name ?? "");
    }, [selected?.id,selected?.name]);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selected) return;
        renamePlane(selected.id, nameDraft);
    };

    if (!selected) {
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
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        Country of Origin {selected.country}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Heading {selected.heading}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Latitude {selected.geoLocation.lat}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Longitude {selected.geoLocation.lon}
                    </Typography>

                </Box>

                <Button type="submit" variant="contained" fullWidth>
                    Save
                </Button>
            </Box>
        </Paper>
    );
});