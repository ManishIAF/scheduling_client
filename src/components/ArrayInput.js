import {useContext} from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { DataContextProvider } from '../context/dataContext';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray({chipData,rowValue}) {

  const {setData} = useContext(DataContextProvider)

  const handleDelete = (chipToDelete,rowValue) => async() => {
    
    setData((prev)=>{

      const Data = [...prev?.DataArray]
      Data[rowValue].delete(chipToDelete);
      return {...prev,DataArray:Data.filter((set) => set.size > 0)}   
    
    });

  };
  
  return (
    <Paper
      sx={{
        display: 'flex',
        minWidth:'auto',
        width:'630px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        justifyContent: 'left',
        '&::-webkit-scrollbar': {
          width: '6px',
          height:'6px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        },
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {Array.from(chipData)?.map((data,index) => {

        return (
          <ListItem key={index}>
            <Chip
              label={data}
              onDelete={handleDelete(data,rowValue)}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}