import React, { useContext, useEffect, useState } from 'react'
import { socketContext } from '../ctx/SocketProvider';
import { toast } from 'react-toastify';

const PollsList = () => {
    const [pollsList, setPollsList] = useState([]);
    const [leaderBoard, setLeaderBoard] = useState([]);

    const socket = useContext(socketContext);

    const voteHandler = async (pollId, optionId) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `polls/${pollId}/vote`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    optionId
                })
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }
            toast.success(data.message);
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    const fetchPolls = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'polls');
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }
            setPollsList([...data.polls]);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        socket.on('POLL_CREATED', (data) => {
            setPollsList(prev => [...prev, data.data.poll]);
        });
        socket.on('VOTE_RECEIVED', ({ pollId, optionId }) => {
            let polls = pollsList;
            polls = polls.map(poll => {
                if (poll.id.toString() === pollId.toString()) {
                    const updatedOptions = poll.Options.map(option => {
                        console.log(option)
                        if (option.id.toString() === optionId.toString()) {
                            option.voteCount += 1;
                        }
                        return option;
                    });
                    return { ...poll, options: updatedOptions };
                }
                return poll;
            });
            setPollsList(polls);
        });

        return () => {
            socket.off('POLL_CREATED');
            socket.off('VOTE_RECEIVED');
        }
    }, [socket, pollsList]);

    useEffect(() => {
        fetchPolls();
    }, [])

    useEffect(() => {
        let results = pollsList.map((poll) => {
            const mostVotedOption = poll.Options.reduce((maxOption, currentOption) => {
                return currentOption.voteCount > maxOption.voteCount ? currentOption : maxOption;
            }, poll.Options[0]);

            if (mostVotedOption.voteCount === 0) {
                return null;
            }

            return {
                question: poll.question,
                option: mostVotedOption.option,
                votes: mostVotedOption.voteCount
            };
        });

        results = results.filter(result => result !== null);
        setLeaderBoard(results);
    }, [pollsList]);

    return (
        <div className='mt-5 flex flex-col justify-center items-center'>
            <div className='border w-[20rem] p-5 rounded mb-5'>
                <h1 className='text-xl font-semibold mt-2'>Leaderboard</h1>
                <div>
                    {leaderBoard.map(({ question, option, votes }) => <div>
                        {`Poll: ${question} -> ${option} is leading with ${votes} votes`}
                    </div>)}
                </div>
            </div>

            <div className='border w-[20rem] p-5 rounded'>
                <h1 className='text-xl font-semibold mt-2'>Polls Active</h1>
                <p>(Click on the options you want to vote for the particular pole.)</p>
                <div>
                    <div>
                        {pollsList.map((poll) => <div className='border rounded p-2 mt-2' key={poll.id}>
                            <div className='text-lg font-semibold'>{poll.question}</div>
                            <ul>
                                {poll.Options.map((option, ind) => (
                                    <li className='cursor-pointer' onClick={() => voteHandler(poll.id, option.id)} key={option.id}>{ind + 1}. {option.option}: {option.voteCount} votes</li>
                                ))}
                            </ul>
                        </div>)}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PollsList