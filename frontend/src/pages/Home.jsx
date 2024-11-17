import React from 'react'
import CreatePollForm from '../components/CreatePollForm'
import PollsList from '../components/PollsList'

const Home = () => {
  return (
    <div>
        <CreatePollForm />
        <PollsList />
    </div>
  )
}

export default Home