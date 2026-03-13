import React from 'react'

const Navbar = () => {

  const github = "https://github.com/CodedPraveen/PassOP-Mongo";

  return (
    <nav className='bg-slate-800 text-white '>
      <div className="mycontainer flex justify-between items-center px-4 py-8 h-8">

        <div className="logo font-bold ">
          <span className='text-green-500'> &lt; </span>

          Pass
          <span className='text-green-500'> OP / &gt;</span>

        </div>

        <button onClick={() => window.open(github, '_blank')} className='text-white bg-green-500 h-11 rounded-full flex justify-evenly items-center ring-white ring-1'>
          <img className='invert p-2 w-12' src="/icons/github.svg" alt="github logo" />
          <span className='font-bold px-3 text-lg'>Github</span>
        </button>
      </div>

    </nav>
  )
}

export default Navbar
