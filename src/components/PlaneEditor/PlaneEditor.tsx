import { useEffect, useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import { planesStore } from "../../store/planes.store";
import { countryStore } from "../../store/country.store";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Divider,
    Select,
    MenuItem,
} from "@mui/material";

export const PlaneEditor = observer(function PlaneEditor() {
    const selected = planesStore.selectedPlane;

    const [nameDraft, setNameDraft] = useState("");
    const [countryName, setCountryName] = useState("");

    useEffect(() => {
        setNameDraft(selected?.name ?? "");
        setCountryName(selected?.country ?? "");
    }, [selected?.id]);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selected) return;
        planesStore.updatePlane(selected.id, nameDraft, countryName);
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
                    <Select
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        fullWidth
                    >
                        {countryStore.countries.map((c) => (
                            <MenuItem key={c.name} value={c.name}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Button type="submit" variant="contained" fullWidth>
                    Save
                </Button>
            </Box>
        </Paper>
    );
});