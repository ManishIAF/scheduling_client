import {useContext } from 'react';
import './App.css';
import DateSelect from './components/DateSelect';
import ChipsArray from './components/ArrayInput';
import { Button } from '@mui/material';
import {DataContextProvider} from './context/dataContext';
import TimeSlot from './components/TimeSlot'

const names = [
  '09 A.M to 11 A.M',
  '12 P.M to 02 P.M',
  '03 P.M to 05 P.M',

];

function ConflictingSubjects() {

  const {Data,setData} = useContext(DataContextProvider)

  const addSubjects = (event)=>{

    event.preventDefault()
  
    const form = event.target;
    const formData = new FormData(form)

    const formJson = Object.fromEntries(formData.entries());

    setData((prev)=>{
      return {...prev,DataArray:[...prev.DataArray,new Set(formJson?.inputarray?.split(','))]}
    })
    
  }

  const allotedTimeSlots = (event)=>{
    const {
      target: { value },
    } = event;

    setData((prev)=>{
      return {...prev,TimeSlots:[...value]}
    })

  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',marginTop:'20px',height:'495px'}}>
      <div>
        Add conflicting Subjects
        <form onSubmit={addSubjects}>
          
          <input style={{width:'540px',height:'30px',fontSize:'15px'}} required type='text' name='inputarray'/>
        
          <Button type='submit' variant="contained" size="small" style={{marginLeft:'10px'}}>Add</Button>
        
        </form>

        <div style={{display:'flex',marginTop:'50px'}}>
          <DateSelect/>
        </div>

        <div style={{marginTop:'50px'}}>
          <TimeSlot names={names} slots={Data?.TimeSlots} allotedTimeSlots={allotedTimeSlots} />
        </div>

      </div>

      <div>
        Conflicting Subjects
        {(Data?.DataArray?.length>0)?<div style={{maxHeight:'480px',overflow:'auto',maxWidth:'650px',padding:'10px'}}>
          {Data?.DataArray?.map((eachData,index)=>{
            
              return <div key={index} style={{marginTop:'5px'}}>
                <ChipsArray rowValue={index} chipData={eachData}/>
              </div>
            
          })}
        </div>:<h6 style={{color:'#fff',marginTop:'30px',marginLeft:'100px'}}>No conflicting subjects added</h6>}
      </div>

    </div>
  );
}

export default ConflictingSubjects;
