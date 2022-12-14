import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { connect } from 'react-redux';
import {addAction} from './actions/addAction';

const equipment_types = [
  'Select Equipment Type',
  'AHU',
  'RTU',
  'Chiller',
];

const sensor_types = [
  'Select Sensor Type',
  'Temperature',
  'Pressure',
  'Humidity',
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const rows = [];

function App(props) {
  const [anchorEquipmentEl, setAnchorEquipmentEl] = React.useState(null);
  const [anchorSensorEl, setAnchorSensorEl] = React.useState(null);
  const [equipmentName, setEquipmentName] = React.useState("");
  const [sensorName, setSensorName] = React.useState("");
  const [setpoint, setSetpoint] = React.useState(0);
  const [selectedEquipmentIndex, setSelectedEquipmentIndex] = React.useState(1);
  const [selectedSensorIndex, setSelectedSensorIndex] = React.useState(1);
  const openEquipment = Boolean(anchorEquipmentEl);
  const openSensor = Boolean(anchorSensorEl);
  const btn = React.useRef(null);
  const [srows, setRows] = React.useState([]);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    rows.push(props);
    let new_rows = [];
    async function map_array() {
      await rows.map((row, index) => {
        if(index >= 1) new_rows.push(row)
        return new_rows
      });
    }
    map_array();
    setRows(new_rows);
  },[btn, props]);

  const handleClickEquipmentListItem = (event) => {
    setAnchorEquipmentEl(event.currentTarget);
  };

  const handleClickSensorListItem = (event) => {
    setAnchorSensorEl(event.currentTarget);
  };

  const handleEquipmentMenuItemClick = (event, index) => {
    setSelectedEquipmentIndex(index);
    setAnchorEquipmentEl(null);
  };

  const handleSensorMenuItemClick = (event, index) => {
    setSelectedSensorIndex(index);
    setAnchorSensorEl(null);
  };

  const handleClose = () => {
    setAnchorEquipmentEl(null);
    setAnchorSensorEl(null);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    let new_row = {equipmentName, sensorName, setpoint};

    await srows.map((row, index) => {
      if(row.equipmentName === new_row.equipmentName) {
        setError(true);
        new_row = null;
      }
      else {
        setError(false);
      }
      return new_row
    });

    if(!error) props.addAction(new_row);

  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1270px', marginLeft: 'auto', marginRight: 'auto '}}>
      <h1 style={{textAlign: "center"}}>Add Equipment Data and Sensor Data</h1>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={4}>
          <Item>
            <List
              component="nav"
              aria-label="Device settings"
              sx={{ bgcolor: 'background.paper' }}
            >
              <ListItem
                button
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="Equipment Type"
                aria-expanded={openEquipment ? 'true' : undefined}
                onClick={handleClickEquipmentListItem}
              >
                <ListItemText
                  primary="Equipment Type"
                  secondary={equipment_types[selectedEquipmentIndex]}
                />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEquipmentEl}
              open={openEquipment}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
              }}
            >
              {equipment_types.map((equipment_type, index) => (
                <MenuItem
                  key={equipment_type}
                  disabled={index === 0}
                  selected={index === selectedEquipmentIndex}
                  onClick={(event) => handleEquipmentMenuItemClick(event, index)}
                >
                  {equipment_type}
                </MenuItem>
              ))}
            </Menu>
          </Item>
          <Item>
            {error? (
            <TextField error id="filled-error-helper-text" label="Error" variant="outlined" value={equipmentName} helperText="Current Equipment Name already exists" onChange={(e) => setEquipmentName(e.target.value)} />
            ):(
              <TextField id="outlined-basic" label="Equipment Name" variant="outlined" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} />
            )}
          </Item>
          <Item>
            <List
              component="nav"
              aria-label="Device settings"
              sx={{ bgcolor: 'background.paper' }}
            >
              <ListItem
                button
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="Sensor Type"
                aria-expanded={openSensor ? 'true' : undefined}
                onClick={handleClickSensorListItem}
              >
                <ListItemText
                  primary="Sensor Type"
                  secondary={sensor_types[selectedSensorIndex]}
                />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorSensorEl}
              open={openSensor}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
              }}
            >
              {sensor_types.map((sensor_type, index) => (
                <MenuItem
                  key={sensor_type}
                  disabled={index === 0}
                  selected={index === selectedSensorIndex}
                  onClick={(event) => handleSensorMenuItemClick(event, index)}
                >
                  {sensor_type}
                </MenuItem>
              ))}
            </Menu>
          </Item>
          <Item>
            <TextField id="outlined-basic" label="Sensor Name" variant="outlined" value={sensorName} onChange={(e) => setSensorName(e.target.value)} />
          </Item>
          <Item>
            <TextField id="outlined-number" label="Sensor Setpoint" type="number" InputLabelProps={{shrink: true}} value={setpoint} onChange={(e) => setSetpoint(e.target.value)} />
          </Item>
          <Item>
            <Button variant="contained" color="success" onClick={(event) => handleSubmit(event)} ref={btn}>Submit</Button>
          </Item>
        </Grid>
        <Grid xs={8}>
          <Item>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Equipment Name</TableCell>
                  <TableCell align="center">Sensor Name</TableCell>
                  <TableCell align="center">Sensor Setpoint</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {srows.map((row) => (
                  <TableRow
                    key={row.equipmentName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">{row.equipmentName}</TableCell>
                    <TableCell align="center">{row.sensorName}</TableCell>
                    <TableCell align="center">{row.setpoint}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

const mapStateToProps = (state, props) => {
  return {
    equipmentName: state.equipmentName,
    sensorName: state.sensorName,
    setpoint: state.setpoint
  };
};

const mapDispatchToProps = {
  addAction
}

export default connect(mapStateToProps, mapDispatchToProps)(App);