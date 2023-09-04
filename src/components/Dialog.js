import {forwardRef,useState,useContext} from 'react';
import { DataContextProvider } from '../context/dataContext';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
// import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import TimeSlots from './TimeSlot'
// import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = useState(false);
  const [filterization,setFilterization] = useState({filteredSlots:[],filteredData:[]})
  const {Data} = useContext(DataContextProvider);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const allotedSlots = async(event)=>{

    const {
        target: { value },
      } = event;
    
    setFilterization((prev)=>({...prev,filteredSlots:[...value]}))
  
  }
  
  const filterFunction = ()=>{

    const filteredSchedule = Object.entries(Data?.solution)
                            .filter(([key])=>filterization?.filteredSlots?.includes(key))
                            .sort((a, b) => {
                                const dateA = new Date(a[1].date);
                                const dateB = new Date(b[1].date);
                                return dateA - dateB;
                              });
                              

    setFilterization((prev)=>({...prev,filteredData:filteredSchedule}))
  
}
 
console.log('filterization : ',filterization);
  return (
    <div>
      <Button type='submit' variant="contained" size="small" onClick={handleClickOpen}>
        Filter Exam Schedule
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Filter Exam Schedule
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{width:'800px',marginLeft:'50px'}}>
                    <h2 style={{marginLeft:'10px'}}>Select Subject Slots</h2>
                    <TimeSlots names={Object.keys(Data?.solution).sort()} allotedTimeSlots = {allotedSlots} slots={filterization?.filteredSlots} />
                </div>
                <div style={{marginTop:'90px'}}>
                    <Button variant="contained" size="large" onClick={filterFunction} >
                        Filter Schedule
                    </Button>
                </div>
            </div>
            {(filterization?.filteredData?.length>0)&&<div style={{display:'flex',justifyContent:'center'}}>
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterization?.filteredData?.map(([subject,schedule],index)=>{
                            return(
                                <tr key={index}>
                                    <td>{subject}</td>
                                    <td>{schedule?.date}</td>
                                    <td>{schedule?.slot}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>}
        </List>
      </Dialog>
    </div>
  );
}