import { createContext,useState} from "react";

const DataContextProvider = createContext(null)

const DataContext = ({children})=>{

    const [Data,setData] = useState({DataArray:[new Set(['Physics(H)','Mathematics(G)','Computer Science(G)','Chemistry(G)','Electronics(G)']),new Set(['Chemistry(H)','Mathematics(G)','Physics(G)','Computer Science(G)']),  new Set(['Mathematics(H)','Physics(G)','Chemistry(G)','Computer Science(G)','Statistics(G)']),
        new Set(['Electronics(H)','Mathematics(G)','Statistics(G)','Computer Science(G)'])],
        TimeSlots:[],
        conflictingSlots:{},
        Graph:'',
        start:'',
        end:'',
        solution:'',
        unScheduled:'',
        filteredSchedule:''
    })

    return(

        <DataContextProvider.Provider value={{Data,setData}}>
            {children}
        </DataContextProvider.Provider>
    )
}

export {DataContext,DataContextProvider};
