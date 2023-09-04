import { useContext } from "react"
import axios from "axios";
import { Button } from '@mui/material';
import FullScreenDialog from "./Dialog";
import { DataContextProvider } from "../context/dataContext"
import DateSelect from "./DateSelect";

const Table =()=>{
    
    const {Data,setData} = useContext(DataContextProvider);

    const schedule = async()=>{
    
        const {data,status} = await axios.post('http://localhost:8000/api/get_solution',{data:Data});    
        
        if(status === 200){

            const solvedSubjects = Object.keys(data)
            const remainingSubjects = Object.keys(Data?.Graph).filter((subject)=>!solvedSubjects.includes(subject))

            setData((prev)=>{
                return {...prev,solution:data,unScheduled:remainingSubjects}
            })
        
        }
    
    }
    
    const dates = [...new Set(Object.values(Data?.solution).map(item => item.date))];
    const slots = [...new Set(Object.values(Data?.solution).map(item => item.slot))];
    
  return (
    <div style={{width:'100%',height:'500px',overflow:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div>
            {(Data?.unScheduled?.length > 0)&&
                <div style={{display:'flex'}}>
            
                    <DateSelect/>
                    <Button type='submit' variant="contained" size="small" style={{marginLeft:'50px'}} onClick={schedule} >
                        Re-Schedule
                    </Button>
                
                </div>
            }
        </div>
        <div style={{float:'right'}}><FullScreenDialog/></div>
      </div>
      <div style={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {slots.map(slot => (
                <th key={slot}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map(date => (
              <tr key={date}>
                <td>{date}</td>
                {slots.map(slot => (
                  <td key={slot}>
                    {Object.keys(Data?.solution).map(subject => {
                      const data = Data?.solution[subject];
                      if (data.date === date && data.slot === slot) {
                        return subject;
                      }
                      return null;
                    }).filter(Boolean).join(', ')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(Data?.unScheduled?.length === 0)?
        <div className='typing-effect'>
            <p className="line">
                The exam of all the subjects can be conducted from <strong style={{color:'green'}}>{dates?.slice(0,1)}</strong> to <strong style={{color:'green'}}>{dates?.slice(-1)}</strong>.
                All Subjects have been alloted threir respective date and time.
            </p>
        </div>
            :
        <div className="typing-effect">
            <p className="line">
                Exams of all the subjects can't be conducted within <strong style={{color:'red'}}>{Data?.start}</strong> and 
                <strong style={{color:'red'}}> {Data?.end}</strong> date range.Subject(s) like
            </p>
            <p className="line">
                <strong style={{color:'red'}}>{(Data?.unScheduled?.length===1)?Data?.unScheduled?.slice(0,1):`${Data?.unScheduled?.slice(0,-1)} and ${Data?.unScheduled?.slice(-1)}`}</strong> 
            </p>
            <p className="line">have not been scheduled due to time constraints.Please increase the date range to schedule the remainig subject(s).</p>
        </div>

    }
    </div>
  );
};
export default Table