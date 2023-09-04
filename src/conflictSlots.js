import { useState,useContext } from 'react'
import { DataContextProvider } from './context/dataContext'
import TimeSlots from './components/TimeSlot'
import Alert from './components/Alert';

const ConflictSlots = ()=>{
    
    const {Data,setData} = useContext(DataContextProvider);
    const [alert,setAlert] = useState({open:false,message:''})

    const handleChange = (event,node)=>{

        const {
            target: { value },
          } = event;

          if(Data?.TimeSlots?.length === value?.length){ 
            return setAlert({open:true,message:'A subject can not have confliction with all time slots'})
          }
          
          setData((prev)=>{
            const updatedConflictingSlots = { ...prev?.conflictingSlots, [node]: [...value] };
            return {...prev,conflictingSlots:updatedConflictingSlots}
          })

    }

    return(
        <div style={{height:'500px',overflow:'auto'}}>
            {alert?.open&&<Alert alert={alert} setAlert={setAlert} />}
            {Object.keys(Data?.conflictingSlots)?.map((node,index)=>{
                return(
                   <div key={index}>{node }<TimeSlots node={node} allotedTimeSlots = {handleChange} slots={Data?.conflictingSlots[node]}  names={Data?.TimeSlots} /></div>
                )
            })}
        </div>
    )

}

export default ConflictSlots