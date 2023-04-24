import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import mongoose from "mongoose";
import Product from "@/models/Product"
import connectDb from "@/middleware/mongoose"
import Head from 'next/head';

export async function getServerSideProps(context) {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI)
    }
    let products = await Product.find({ category: 'stickers' })
    let sticker = {}
    for (let item of products) {
        if (item.title in sticker) {
            if (!sticker[item.title].color.includes(item.color) && item.availableQty > 0) {
                sticker[item.title].color.push(item.color)

            }
            if (!sticker[item.title].size.includes(item.size) && item.availableQty > 0) {
                sticker[item.title].size.push(item.size)
            }
        }
        else {
            sticker[item.title] = JSON.parse(JSON.stringify(item))
            if (item.availableQty > 0) {
                sticker[item.title].color = [item.color]
                sticker[item.title].size = [item.size]
            }
            else {
                sticker[item.title].color = []
                sticker[item.title].size = []
            }
        }
    }

    return {
        props: { products: JSON.parse(JSON.stringify(sticker)) }, // will be passed to the page component as props
    }
}

const Stickers = ({ products }) => {

    return (
        <>
            <Head>
                <title>Stickers | DEVWEAR</title>
                <meta name="description" content="Checkout page of Your Website Name" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            <section className="text-gray-600 body-font min-h-screen">
                <div className="container w-[92%] px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -m-4 justify-center ">
                        {Object.keys(products).length === 0 && <p className='mx-5'>Sorry all the Stickers are Currently Out of Stock. New Stock Coming Soon. Stay Tuned!</p>}
                        {Object.keys(products).map((item) => {
                            return <Link passHref={true} key={products[item]._id} href={`/product/${products[item].slug}`} className='lg:w-1/5 md:w-1/2 p-4 w-full shadow-lg m-5'>
                                <div className="">
                                    <div className=" relative  rounded overflow-hidden">
                                        <img alt="Sticker Image" className="m-auto  h-[30vh] md:h-[36vh] block" src={products[item].img} />
                                    </div>
                                    <div className="mt-4 text-center md:text-left">
                                        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Stickers</h3>
                                        <h2 className="text-gray-900 title-font text-lg font-medium">{products[item].title}</h2>
                                        <p className="mt-1">₹{products[item].price}</p>
                                        <div className="mt-1">
                                            {products[item].size.includes('S') && <span className='border border-gray-300 px-1 mx-1'>S</span>}
                                            {products[item].size.includes('M') && <span className='border border-gray-300 px-1 mx-1'>M</span>}
                                            {products[item].size.includes('L') && <span className='border border-gray-300 px-1 mx-1'>L</span>}
                                            {products[item].size.includes('XL') && <span className='border border-gray-300 px-1 mx-1'>XL</span>}
                                            {products[item].size.includes('XXL') && <span className='border border-gray-300 px-1 mx-1'>XXL</span>}
                                        </div>
                                        <div className="mt-1">
                                            {products[item].color.includes('blue') && <button className="border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                                            {products[item].color.includes('black') && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                                            {products[item].color.includes('green') && <button className="border-2 border-gray-300 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                                            {products[item].color.includes('yellow') && <button className="border-2 border-gray-300 ml-1 bg-yellow-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                                            {products[item].color.includes('pink') && <button className="border-2 border-gray-300 ml-1 bg-pink-700 rounded-full w-6 h-6 focus:outline-none"></button>}

                                        </div>
                                    </div>
                                </div>
                            </Link>
                        })}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Stickers
