import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import mongoose from "mongoose";
import Order from "@/models/Order"
import Head from 'next/head';

export async function getServerSideProps(context) {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI)
    }
    let order = await Order.findById(context.query.id)

    return {
        props: { order: JSON.parse(JSON.stringify(order)) }, // will be passed to the page component as props
    }
}


const MyOrder = ({ order, clearCart }) => {
    const [date, setDate] = useState();

    const router = useRouter()

    useEffect(() => {
        const fetchDate = new Date(order.createdAt)
        setDate(fetchDate)

        if (router.query.ClearCart == 1) {
            clearCart()
        }
    }, [])


    // const { id } = router.query
    // console.log(order)
    const products = order.products

    return (
        <div>
            <Head>
                <title>Order Successful | DEVWEAR</title>
                <meta name="description" content="Checkout page of Your Website Name" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">devwear.com</h2>
                            <h1 className="text-gray-900 text-2xl title-font font-semibold mb-4">Order ID: #{order.orderId}</h1>
                            <p className="text-gray-500">Yaay! Your Order has been Successfully placed</p>
                            <p className="text-gray-500">Order Placed On: {date && date.toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-gray-500">Your payment status is: <span className="font-semibold text-slate-700">{order.status}</span></p>

                            <div className="flex mb-4">
                                <a className="flex-grow text-left py-2 text-lg px-1">Description</a>
                                <a className="flex-grow  text-right py-2 text-lg px-1">Quantity</a>
                                <a className="flex-grow  text-center py-2 text-lg px-1">Price</a>
                            </div>

                            {Object.keys(products).map((key) => {
                                return <div key={key} className="flex border-t border-gray-200 py-2">
                                    <span className="text-gray-500 w-[60%]">{products[key].name}({products[key].size}/{products[key].variant})</span>
                                    <span className="m-auto text-gray-900">{products[key].qty}</span>
                                    <span className="m-auto text-gray-900">{products[key].qty} X ₹{products[key].price} = ₹{products[key].qty * products[key].price}</span>
                                </div>
                            })}



                            <div className="flex flex-col mt-2 md:mt-4">
                                <span className="title-font font-semibold text-xl md:text-2xl text-gray-900 ">SubTotal: ₹{order.amount}.00</span>
                                <button className="flex w-36 mt-4 md:mt-5 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">Track Order</button>
                            </div>
                        </div>
                        <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="/order.jpg" />
                    </div>
                </div>
            </section >
        </div >
    )
}

export default MyOrder
