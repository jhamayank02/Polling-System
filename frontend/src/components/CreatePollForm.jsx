import React, { useState } from 'react'
import { toast } from 'react-toastify';

const CreatePollForm = () => {
    const [topic, setTopic] = useState();
    const [options, setOptions] = useState();

    const createPollHandler = async (e)=>{
        e.preventDefault();
        if(!topic || topic.trim().length === 0){
            toast.error('Poll topic name not provided');
            return;
        }
        if(!options || options.trim().length === 0){
            toast.error('Poll options not provided');
            return;
        }
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+'polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic,
                    options: options.split(',')
                })
            });
            const data = await response.json();
            if(!data.success){
                throw new Error(data.message);
            }
            toast.success(data.message);
            setTopic('');
            setOptions('');
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className='mt-5 flex justify-center items-center'>
        <div className='border w-[20rem] p-5 rounded'>
            <h1 className='text-xl font-semibold mt-2'>Create a Poll</h1>
            <form className='mt-2' onSubmit={createPollHandler}>
                <div className='flex flex-col gap-y-2'>
                    <label className=''>Poll Topic (Whitespaces are not allowed. Only characters, -, _, and . are allowed)</label>
                    <input className='border p-1' type='text' value={topic} onChange={(e)=>setTopic(e.target.value)} />
                </div>
                <div className='flex flex-col gap-y-2 my-1'>
                    <label className=''>Options (You can add multiple options separated using commas. Eg:- red, blue, green)</label>
                    <input className='border p-1' type='text' value={options} onChange={(e)=>setOptions(e.target.value)} />
                </div>
                <button className='border border px-5 py-1 rounded bg-blue-500 text-white mt-2'>Create Poll</button>
            </form>
        </div>
        </div>
    )
}

export default CreatePollForm