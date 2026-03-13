import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch(`${import.meta.env.VITE_API_URL}/`)
        let passwords = await req.json()
        console.log(passwords);
        setPasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords()
    }, [])


    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }

    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // If any such id exists in the db, delete it 
            await fetch(`${import.meta.env.VITE_API_URL}/`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })


            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch(`${import.meta.env.VITE_API_URL}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

            // Otherwise clear the form and show toast
            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast('Error: Password not saved!');
        }

    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))

            await fetch(`${import.meta.env.VITE_API_URL}/`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition="flip"
            />
            <ToastContainer />

            <div className="p-2 md:p-3 md:mycontainer ">
                <h1 className='text-4xl text-center font-bold'>
                    <span className='text-green-500 '> &lt; </span>
                    Pass
                    <span className='text-green-500'> OP / &gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center '>Your own password saver</p>

                <div className=" flex flex-col text-black p-4 gap-3 md:gap-8 md:w-2/3  md:flex md:mx-auto items-center">

                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 bg-white px-4 py-1 w-full' type="text" name="site" id="site" />

                    <div className="flex flex-col md:flex-row w-full justify-between gap-3 md:gap-6">

                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 bg-white px-4 py-1 w-full' type="text" name="username" id="username" />

                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 bg-white px-4 py-1 w-full' type="password" name="password" id="password" />
                            <span className='absolute right-[5px] top-[2px] cursor-pointer' onClick={showPassword} >
                                <img ref={ref} className='p-1' width={30} src="/icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className="flex justify-center items-center bg-green-400 hover:bg-green-500 rounded-full w-fit px-9 py-2 border border-green-900 ">
                        <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover" ></lord-icon>
                        Save Password </button>
                </div>
                <div className="passwords mx-0 md:mx-auto">
                    <h2 className='font-bold text-xl px-4 pl-0 md:pl-62 md:p-2'>Your passwords</h2>
                    {passwordArray.length === 0 && <div className='md:mx-auto pl-0 md:pl-62'>No Password to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full md:w-2/3 rounded-md overflow-hidden md:mx-auto mb-15">
                        <thead className=' bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Delete</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100 py-2 md:py-17'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='border border-white text-center py-2'>
                                        <div className="flex justify-center items-center ">
                                            <a target='_blank' href={item.site}>{item.site}</a>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.site) }}>
                                                <lord-icon style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='border border-white text-center py-2'>
                                        <div className="flex justify-center items-center ">
                                            <span>{item.username}</span>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.username) }}>
                                                <lord-icon style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='border border-white text-center py-2'>
                                        <div className="flex justify-center items-center ">
                                            <span className='font-bold'>{"*".repeat(item.password.length)}</span>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.password) }}>
                                                <lord-icon style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='border border-white text-center py-2'>
                                        <span onClick={() => { editPassword(item.id) }} className='cursor-pointer mx-0.3'> <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ "width": "25px", "height": "25px" }} ></lord-icon></span>
                                        <span onClick={() => { deletePassword(item.id) }} className='cursor-pointer mx-0.3'> <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ "width": "25px", "height": "25px" }} ></lord-icon></span>
                                    </td>
                                </tr>
                            }
                            )}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    )
}

export default Manager
