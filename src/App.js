import React,{useState,useContext} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { DataContextProvider } from './context/dataContext';
import Alert from './components/Alert';
import ConflictingSubjects from './ConflictingSubjects'
import ConflictSlots from './conflictSlots';
import Table from './components/createTable';

axios.defaults.baseURL = "https://scheduling-server.onrender.com"

const steps = ['Add Conflicting Subjects', 'Allot conflicting slots', 'Schedule'];

export default function App() {
    
  const {Data,setData} = useContext(DataContextProvider)
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [alert,setAlert] = useState({open:false,message:''})

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async() => {
    
    let newSkipped = skipped;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if(activeStep === 0){

        if(Data?.DataArray?.length === 0){
          return setAlert({open:true,message:'Please add conflicting subjects'})
        }

        if(!Data?.start){
          return setAlert({open:true,message:'Exam starting date is required'})
        }

        if(!Data?.end){
          return setAlert({open:true,message:'Exam ending date is required'})
        }

        if(Data?.TimeSlots?.length === 0){
          return setAlert({open:true,message:'Time slots required'})
        }
        
        const dataArray = Data?.DataArray.map(set => Array.from(set));

        const {data,status} = await axios.post('/api/get_Graph',{data:dataArray});    
        
        if(status === 200){

            const conflictingSlots = await new Promise((innerResolve) => {
                const result = Object.keys(data)?.reduce((obj, node) => {
                  obj[node] = [];
                  return obj;
                }, {});
                innerResolve(result);
              });

            setData((prev)=>{
                return {...prev,Graph:data,conflictingSlots}
            })

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        
        }
    
    }

    if(activeStep === 1){

        const {data,status} = await axios.post('/api/get_solution',{data:Data});    
        
        if(status === 200){

            const solvedSubjects = Object.keys(data)
            const remainingSubjects = Object.keys(Data?.Graph).filter((subject)=>!solvedSubjects.includes(subject))

            setData((prev)=>{
                return {...prev,solution:data,unScheduled:remainingSubjects}
            })
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        
        }
    
    }
    
    if(activeStep === 2){

        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    }    
    setSkipped(newSkipped);
  
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  return (
    <div style={{height:'100vh',width:'100%',backgroundColor: '#282c34',color: 'white'}}>
        {alert?.open&&<Alert alert={alert} setAlert={setAlert} />}
        <header style={{paddingLeft:'10px',paddingRight:'10px' }}>
            <Box sx={{ width: '100%'}}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                          <Typography style={{color:'#fff'}} variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>
                            <Typography style={{color:'#fff'}} variant="caption">
                              {label}
                            </Typography>
                          </StepLabel>
                        </Step>
                    );
                    })}

                    
                </Stepper>
                  <React.Fragment>
                      
                    {(activeStep===0)&&<Typography sx={{ mt: 2, mb: 1 }}>
                    
                        <ConflictingSubjects/>

                    </Typography>
                    }
                    {(activeStep===1)&&<Typography sx={{ mt: 2, mb: 1 }}>
                    
                        <ConflictSlots/>
                    
                    </Typography>}
                    {(activeStep===2)&&<Typography sx={{ mt: 2, mb: 1 }}>
                    
                      <Table/>
                
                    </Typography>}

                
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            variant="contained" 
                            size="small"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>

                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button variant="contained" size="small" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button variant="contained" size="small" onClick={handleNext}>
                          {activeStep <= steps.length - 1 && 'Next'}
                        </Button>
                    </Box>
                  </React.Fragment>
                
            </Box>
        </header>
    </div>
  );
}