import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsFillBagCheckFill } from 'react-icons/bs';
import { AiFillPlusCircle, AiFillMinusCircle, AiOutlineClear } from 'react-icons/ai';
import Head from 'next/head';
import Script from 'next/script';
import $ from 'jquery';
import { useRouter } from 'next/router';

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

    const handleChange = (event) => {
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
        }

        setTimeout(() => {
            if (name.length >= 3 && email.length >= 3 && phone.length >= 3 && address.length >= 3 && pincode.length >= 3) {
                setDisabled(false)
            }
            else {
                setDisabled(true)
            }
        }, 100);

    }

    const [orderId, setOrderId] = useState();

    const router = useRouter();

    // const createOrderId = async () => {
    //     const userData = { cart, subTotal, orderId, email: email, name, address, pincode, phone };
    //     console.log(userData.subTotal);
    //     console.log(userData.email);
    //     console.log(userData.address);

    //     try {
    //         console.log("Fetching orderId...");
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/razorpay`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 userData: userData,
    //             }),
    //         });

    //         const { orderId } = await response.json();

    //         console.log("Order id bEFORE: " + orderId);
    //         console.log("Subtotal is: " + subTotal);
    //         // setOrderId(`${orderId}`);
    //         setOrderId(orderId);
    //         console.log("Order id AFTER: " + orderId);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };



    const handlePayment = async () => {
        // e.preventDefault();

        // await createOrderId();

        let myorderId;
        const userData = { cart, subTotal, myorderId, email: email, name, address, pincode, phone };

        console.log(userData.subTotal);
        console.log(userData.email);
        console.log(userData.address);
        console.log("Fetching orderId...");

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/razorpay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userData: userData,
            }),
        });

        const { orderId } = await response.json();
        myorderId = orderId

        console.log("Order id is: " + orderId + " amount is: " + subTotal);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: subTotal * 100,
            currency: 'INR',
            name: 'Devwear',
            description: 'Test Transaction',
            image: `/logo.png`,
            order_id: myorderId,
            handler: function (response) {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);

                // Here, We can use --> response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
                console.log(response.razorpay_signature);

                const settings = {
                    url: '/api/razorpayConfirm',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({ response }),
                };

                $.ajax(settings).done(function (response) {
                    if ((response.signatureIsValid)) // Here response is --> Object { signatureIsValid: true/false }
                        window.location.href = `/order?id=${response.id}`;
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
                        <input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
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
                        <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
                        <input onChange={handleChange} value={phone} type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
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
                        <input value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly={true} />
                    </div>
                </div>
                <div className="px-2 w-1/2">


                    <div className=" mb-4">
                        <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
                        <input value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly={true} />
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