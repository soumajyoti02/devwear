import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsFillBagCheckFill } from 'react-icons/bs';
import { AiFillPlusCircle, AiFillMinusCircle, AiOutlineClear } from 'react-icons/ai';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Myaccount = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [pincode, setPincode] = useState('')
    const [address, setAddress] = useState('')
    const [user, setUser] = useState({ value: null })
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [npassword, setNpassword] = useState('');

    const router = useRouter()
    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'))
        if (!myuser) {
            router.push('/')
        }

        if (myuser && myuser.token) {
            setUser(myuser)
            setEmail(myuser.email)
            fetchData(myuser.token)

        }
    }, [])
    const fetchData = async (token) => {
        let data = { token: token }
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const res = await req.json()
        setName(res.name)
        setAddress(res.address)
        setPincode(res.pincode)
        setPhone(res.phone)
    }

    const handleUserSubmit = async () => {
        let data = { token: user.token, address, name, phone, pincode }
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const res = await req.json()

        toast.success("Details Succesfully Updated!", {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    const handlePasswordSubmit = async () => {
        let res;
        if (npassword == cpassword) {
            let data = { token: user.token, password, cpassword, npassword }
            const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            res = await req.json()
        }
        else {
            res = { success: false }
        }

        if (res.success) {
            toast.success("Password Succesfully Updated!", {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
        else {
            toast.error("Error Updating Password", {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }

        setPassword('')
        setCpassword('')
        setNpassword('')
    }



    const handleChange = async (event) => {
        if (event.target.name === 'name') {
            setName(event.target.value)
        }

        else if (event.target.name === 'phone') {
            setPhone(event.target.value)
        }
        else if (event.target.name === 'address') {
            setAddress(event.target.value)
        }
        else if (event.target.name === 'pincode') {
            setPincode(event.target.value)
        }
        else if (event.target.name === 'password') {
            setPassword(event.target.value)
        }
        else if (event.target.name === 'cpassword') {
            setCpassword(event.target.value)
        }
        else if (event.target.name === 'npassword') {
            setNpassword(event.target.value)
        }
    }


    return (
        <>
            <div className='container mx-auto my-9 w-11/12'>
                <ToastContainer
                    position="top-left"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <h1 className="text-2xl text-center font-bold">Upate Your Account</h1>
                <h2 className="text-xl font-semibold mt-7">1. Delivery Details</h2>
                <div className="mx-auto flex flex-wrap">
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email (Cannot be updated)</label>

                            {user && user.token ? <input value={user.email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly={true} /> : <input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}


                        </div>
                    </div>
                </div>
                <div className="px-2 w-full">
                    <div className=" mb-4">
                        <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
                        <textarea onChange={handleChange} value={address} id="address" name="address" cols={'30'} rows={'2'} className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" ></textarea>
                    </div>
                </div>

                <div className="mx-auto flex flex-wrap justify-center md:justify-normal">
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
                            <input onChange={handleChange} value={phone} type="phone" id="phone" name="phone" placeholder='Your 10 Digit Phone Number' className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">PinCode</label>
                            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <button onClick={handleUserSubmit} className="disabled:bg-pink-300  flex justify-center items-center mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm w-8/12 md:w-24 m-auto">Submit</button>
                </div>


                <h2 className="text-xl font-semibold mt-7">2. Change Password</h2>
                <div className="mx-auto flex flex-wrap justify-center md:justify-normal">
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input onChange={handleChange} value={password} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="npassword" className="leading-7 text-sm text-gray-600">New Password</label>
                            <input onChange={handleChange} value={npassword} type="password" id="npassword" name="npassword" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>
                    <div className="px-2 w-1/2">
                        <div className=" mb-4">
                            <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">Confirm New Password</label>
                            <input onChange={handleChange} value={cpassword} type="password" id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                    </div>

                    <button onClick={handlePasswordSubmit} className="disabled:bg-pink-300  flex justify-center items-center mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm w-8/12 md:w-24 m-auto">Submit</button>
                </div>

            </div>
        </>
    )
}

export default Myaccount
