import {useContext} from 'react'
import { DataContextProvider } from '../context/dataContext';
import TextField from '@mui/material/TextField';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  textField: {
    '& .MuiInputLabel-root': {
      color: '#fff', 
    },
    '& .MuiInput-root': {
      borderColor: '#fff',
      color: '#fff',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#fff',
    },
    '& .MuiIconButton-root': {
      color: 'your_date_button_color', // Change to your desired date button color
    },
    
}}));

function DateSelect() {
  const classes = useStyles();
  const {Data,setData} = useContext(DataContextProvider) 

  return (
    <div style={{display:'flex'}}>
        <div style={{fontSize:'15px',marginLeft:'10px'}}>
            
            <TextField id="standard-number" 
              variant="standard" 
              label="Exam starting date" 
              required type='date'
              className={classes.textField} 
              value={Data?.start} 
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>setData((prev)=>{return{...prev,start:e.target.value}})}
            />
          </div>
          <div style={{fontSize:'15px',marginLeft:'200px'}}>
            
            <TextField 
              id="standard-number" 
              variant="standard" 
              label="Exam ending date"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                disableUnderline: false,
              }}
              required type='date' 
              value={Data?.end} 
              onChange={(e)=>setData((prev)=>{return{...prev,end:e.target.value}})}
            />
          </div>
    </div>
  )
}

export default DateSelect