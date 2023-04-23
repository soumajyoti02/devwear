import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsFillBagCheckFill } from 'react-icons/bs';
import { AiFillPlusCircle, AiFillMinusCircle, AiOutlineClear } from 'react-icons/ai';
import Head from 'next/head';
import Script from 'next/script';
import $ from 'jquery';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Razorpay from 'razorpay';

const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [pincode, setPincode] = useState('')
    const [address, setAddress] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [user, setUser] = useState({ value: null })

    useEffect(() => {
        const myuser = JSON.parse(localStorage.getItem('myuser'))

        if (myuser && myuser.token) {
            setUser(myuser)
            setEmail(myuser.email)

            fetchData(myuser.token)
        }
    }, [])

    useEffect(() => {
        if (name.length >= 3 && email.length >= 3 && phone.length >= 3 && address.length >= 3 && pincode.length >= 3) {
            setDisabled(false)
        }
        else {
            setDisabled(true)
        }
    }, [name, email, phone, pincode, address])

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
        getPinCode(res.pincode)
    }

    const getPinCode = async (pin) => {
        let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
        let pinJson = await pins.json()
        if (Object.keys(pinJson).includes(pin)) {
            setState(pinJson[pin][1])
            setCity(pinJson[pin][0])
        }
        else {
            setState('')
            setCity('')
        }
    }


    const handleChange = async (event) => {
        if (event.target.name === 'name') {
            setName(event.target.value)
        }
        else if (event.target.name === 'email') {
            setEmail(event.target.value)
        }
        else if (event.target.name === 'phone') {
            setPhone(event.target.value)
        }
        else if (event.target.name === 'address') {
            setAddress(event.target.value)
        }
        else if (event.target.name === 'pincode') {
            setPincode(event.target.value)

            if (event.target.value.length === 6) {
                getPinCode(event.target.value)
            }
            else {
                setState('')
                setCity('')
            }
        }
    }

    const [orderId, setOrderId] = useState();
    const router = useRouter();

    const handlePayment = async () => {
        let myorderId;
        const userData = { cart, subTotal, myorderId, email: email, name, address, pincode, phone, city };

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/razorpay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userData: userData,
            }),
        });

        const responseData = await response.json();
        const { orderId, success, cartClear } = responseData
        myorderId = orderId

        if (success) {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: subTotal * 100,
                currency: 'INR',
                name: 'Devwear',
                description: 'Test Transaction',
                image: `/logo.png`,
                order_id: myorderId,
                handler: function (response) {

                    // alert(response.razorpay_payment_id);
                    // alert(response.razorpay_order_id);
                    // alert(response.razorpay_signature);

                    // Here, We can use --> response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature

                    const settings = {
                        url: '/api/razorpayConfirm',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({ response }),
                    };

                    $.ajax(settings).done(function (response) {
                        if (response.signatureIsValid) // Here response is --> Object { signatureIsValid: true/false }
                            window.location.href = `/order?id=${response.id}&ClearCart=1`;
                    });

                },
                theme: {
                    color: '#99cc33',
                },
            };

            const rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);


            });
            rzp1.open();
        }
        else {
            toast.error(`${responseData.error}`, {
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
        if (cartClear) {
            clearCart()
        }
    };


    return (
        <div className='container m-auto w-[90%] md:w-[80%]'>
            <Head>
                <title>Checkout | DEVWEAR</title>
                <meta name="description" content="Checkout page of Your Website Name" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
            </Head>

            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
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
            <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>
            <h2 className="text-xl font-semibold">1. Delivery Details</h2>
            <div className="mx-auto flex flex-wrap">
                <div className="px-2 w-1/2">
                    <div className=" mb-4">
                        <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                        <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                </div>
                <div className="px-2 w-1/2">
                    <div className=" mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>

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

            <div className="mx-auto flex flex-wrap">
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
            </div>

            <div className="mx-auto flex flex-wrap">
                <div className="px-2 w-1/2">
                    <div className=" mb-4">
                        <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
                        <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                </div>
                <div className="px-2 w-1/2">


                    <div className=" mb-4">
                        <label htmlFor="city" className="leading-7 text-sm text-gray-600">District</label>
                        <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>

                </div>
            </div>

            <h2 className="text-xl font-semibold">2. Review Cart Items</h2>
            <div className="sideCart bg-pink-100 p-5 my-4 pl-8 md:pl-14">

                <ol className="list-decimal font-semibold">
                    {/* Object.keys(cart) returns an array of all the keys in the cart object. */}

                    {Object.keys(cart).length == 0 && <div className='my-4 font-normal'>Your Cart is Empty</div>}

                    {Object.keys(cart).map((k) => {
                        return <li key={k} className="">
                            <div className='item flex my-5'>
                                <div className=" font-semibold">{cart[k].name} ({cart[k].size}/{cart[k].constiant})</div>
                                <div className="flex font-semibold justify-center items-center w-1/3 text-lg">
                                    {/* Here k is slug */}

                                    <AiFillMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].constiant) }} className='cursor-pointer text-pink-500' />
                                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                                    <AiFillPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].constiant) }} className='cursor-pointer text-pink-500' />
                                </div>
                            </div>
                        </li>
                    })}
                </ol>
                <span className="total font-bold">SubTotal: ₹{subTotal}</span>
            </div>
            <div className="mx-4">
                <Link href={'/checkout'}>
                    <button id='rzp-button1' disabled={disabled} onClick={() => handlePayment()} className="disabled:bg-pink-300  flex mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm">
                        <BsFillBagCheckFill className='m-1' />
                        Pay ₹{subTotal}</button>
                </Link>
            </div>
        </div>
    )
}

export default Checkout