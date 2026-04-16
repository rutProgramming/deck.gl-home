import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef, type GridColDef, type GridRowId, type GridRowSelectionModel } from "@mui/x-data-grid";
import { useContext, useEffect } from "react";
import { MapRendererContext } from "../Map/IMapRenderer";
import { mapObjectsStore } from "../../store/mapObjectStore.store";

export const PlanesPanel = observer(function PlanesPanel() {
  const apiRef = useGridApiRef();
  const rendererMap = useContext(MapRendererContext);

 const rows = Array
  .from(mapObjectsStore.allMapObjects.values())
  .filter(obj => obj.type === "plane")
  .map((plane) => ({
    id: plane.id,
    name: plane.name,
    country: plane.country,
    location: `${plane.geoLocation.lat.toFixed(3)}, ${plane.geoLocation.lon.toFixed(3)}`,
  }));

  const columns: GridColDef<typeof rows[number]>[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "location", headerName: "Location", flex: 1.5 },
  ];

  const selectionModel: GridRowSelectionModel = {
    type: "include",
    ids: mapObjectsStore.selectedMapObject ? new Set<GridRowId>([mapObjectsStore.selectedMapObject.id]) : new Set(),
  };


  const handleRowSelectionChange = (model: GridRowSelectionModel) => {
    const selectedIds = Array.from(model.ids).filter((id): id is string => typeof id === "string");
    mapObjectsStore.selectMapObject(selectedIds[0] ?? null);
    if (rendererMap && mapObjectsStore.selectedMapObject) {
      rendererMap.flyToLocation(mapObjectsStore.selectedMapObject.geoLocation.lat, mapObjectsStore.selectedMapObject.geoLocation.lon);
    }

  };
  useEffect(() => {
    const id = mapObjectsStore.selectedMapObject?.id;
    if (!id || !apiRef.current) return;

    const rowIndex = Array.from(mapObjectsStore.allMapObjects.values()).findIndex((row) => row.id === id);

    if (rowIndex === -1) return;
    const pageSize = 5;
    const page = Math.floor(rowIndex / pageSize);

    apiRef.current.setPage(page);
    apiRef.current?.scrollToIndexes({ rowIndex });

  }, [mapObjectsStore.selectedMapObject?.id]);
  return (
    <Box
      sx={{
        height: 300,
        width: 500,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={handleRowSelectionChange}
        disableRowSelectionOnClick={false}
      />
    </Box>
  );
});


