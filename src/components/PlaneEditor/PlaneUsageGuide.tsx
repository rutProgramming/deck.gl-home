import { Paper, Typography } from "@mui/material";

export default function PlaneUsageGuide() {
       return (
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                    Click a plane on the map or in the list.
                </Typography>
            </Paper>
        );
}