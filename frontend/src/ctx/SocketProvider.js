import {createContext, useMemo} from 'react';
import io from 'socket.io-client';

const socketContext = createContext();

const SocketProvider = ({children})=>{
    const socket = useMemo(()=>io(process.env.REACT_APP_BACKEND_URL), []);

    return <socketContext.Provider value={socket}>
        {children}
    </socketContext.Provider>
}

export {SocketProvider, socketContext};