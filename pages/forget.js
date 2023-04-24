import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Router, useRouter } from 'next/router';
import Head from 'next/head';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Forget = () => {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');

    const handleChange = (event) => {
        if (event.target.name === 'password') {
            setPassword(event.target.value)
        }
        else if (event.target.name === 'email') {
            setEmail(event.target.value)
        }
        else if (event.target.name === 'cpassword') {
            setCpassword(event.target.value)
        }
    }


    useEffect(() => {

        if (localStorage.getItem('myuser')) {
            router.push('/')
        }

    }, [])

    // useEffect(() => {
    //     const myuser = JSON.parse(localStorage.getItem('myuser'))
    //     if (!myuser) {
    //         router.push('/')
    //     }

    //     if (myuser && myuser.token) {
    //         setUser(myuser)
    //         setEmail(myuser.email)
    //         fetchData(myuser.token)

    //     }
    // }, [])

    const sendResetEmail = async () => {
        let data = {
            email,
            sendMail: true,
        }
        const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const res = await req.json()
        if (res.success) {
            toast.success("Password reset instructions have been sent to your email!", {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            // router.push(`${process.env.NEXT_PUBLIC_HOST}/forget?token=${123}`)
        }
        else {
            toast.error("Some error Occured. Please Try again!", {
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
    }


    const resetPassword = async () => {
        if (password == cpassword) {
            let data = {
                password,
                cpassword,
                sendMail: false,
                token: router.query.token,
            }
            const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forget`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await req.json()
            if (res.success) {
                toast.success("Password has been changed!", {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })

                setTimeout(() => {
                    router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
                }, 2000);
            }
            else {
                toast.error(`${res.error}`, {
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
        }
    }

    return (
        <div>
            <Head>
                <title>Forget Password | DEVWEAR</title>
                <meta name="description" content="Checkout page of Your Website Name" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            <div className="flex md:min-h-[85vh] min-h-[60vh] items-center justify-center px-4 pb-12 sm:px-6 lg:px-8">
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
                <div className="w-full max-w-md space-y-8">
                    <div>

                        <img className="mx-auto h-12 w-auto" src="/logo.png" alt="Devwear" />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Forget Password</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            or,
                            <Link href={'/login'} className='mt-2 text-center text-lg font-bold text-pink-600'> Sign in</Link>
                        </p>
                    </div>
                    {router.query.token && <div>
                        <div className="mt- space-y-6" >
                            <div className=" rounded-md shadow-sm space-y-3">
                                <div>
                                    <label htmlFor="password" className="sr-only">New Password</label>
                                    <input value={password} onChange={handleChange} id="password" name="password" type="password" autoComplete="password" required className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 pl-3" placeholder="New Password" />
                                </div>
                                <div>
                                    <label htmlFor="cpassword" className="sr-only">Confirm New Password</label>
                                    <input value={cpassword} onChange={handleChange} id="cpassword" name="cpassword" type="password" autoComplete="cpassword" required className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 pl-3" placeholder="Confirm New Password" />
                                </div>
                            </div>

                            <div>
                                <button onClick={resetPassword} type="submit" className=" group relative flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Continue
                                </button>
                            </div>
                            {password != cpassword && <span className="text-red-600">Password not Match</span>}
                            {password && password == cpassword && <span className="text-green-600">Passwords Matched</span>}
                        </div>
                    </div>}






                    {!router.query.token &&
                        <div className="mt- space-y-6" >
                            <input type="hidden" name="remember" value="true" />
                            <div className="-space-y-px rounded-md shadow-sm">
                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email address</label>
                                    <input value={email} onChange={handleChange} id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 pl-3" placeholder="Email address" />
                                </div>
                            </div>


                            <div>
                                <button onClick={sendResetEmail} type="submit" className="group relative flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    Continue
                                </button>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Forget
