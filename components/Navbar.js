import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsCart4, BsFillBagCheckFill } from 'react-icons/bs';
import { AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle, AiOutlineClear } from 'react-icons/ai';

const Navbar = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
    const toggleCart = () => {
        if (ref.current.classList.contains('translate-x-full')) {
            ref.current.classList.remove('translate-x-full')
            ref.current.classList.add('translate-x-0')
        }
        else if (!ref.current.classList.contains('translate-x-full')) {
            ref.current.classList.remove('translate-x-0')
            ref.current.classList.add('translate-x-full')
        }
    }

    const ref = useRef()


    return (
        <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md'>
            <div className="logo mx-5">
                <Link href={'/'}><Image width={200} height={40} src={'/logo.png'} alt='logo' /></Link>
            </div>
            <div className="nav">
                <ul className="flex items-center space-x-4 font-bold md:text-lg">
                    <Link href={`/tshirts`}><li className="cursor-pointer">Tshirts</li></Link>
                    <Link href={`/hoodies`}><li className="cursor-pointer">Hoodies</li></Link>
                    <Link href={`/stickers`}><li className="cursor-pointer">Stickers</li></Link>
                    <Link href={`/mugs`}><li className="cursor-pointer">Mugs</li></Link>
                </ul>
            </div>
            <div onClick={toggleCart} className="cursor-pointer cart absolute right-0 top-[1.35rem] mx-5">
                <BsCart4 className='text-2xl md:text-3xl' />
            </div>

            <div ref={ref} className="sideCart z-50 h-[100vh] w-80 absolute top-0 right-0 bg-pink-100 p-10 transform transition-transform translate-x-full">
                <h2 className="font-bold text-xl">Shopping Cart</h2>
                <span onClick={toggleCart} className="cursor-pointer absolute top-5 right-2  text-2xl text-pink-600">
                    <AiFillCloseCircle />
                </span>
                <ol className="list-decimal font-semibold">
                    {Object.keys(cart).length == 0 && <div className='my-4 font-normal'>Your Cart is Empty</div>}
                    {Object.keys(cart).map((k) => {
                        return <li key={k} className="">
                            <div className='item flex my-5'>
                                <div className="w-2/3 font-semibold">{cart[k].name}</div>
                                <div className="flex font-semibold justify-center items-center w-1/3 text-lg">
                                    <AiFillMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                                    <span className="mx-2 text-sm">{cart[k].qty}</span>
                                    <AiFillPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                                </div>
                            </div>
                        </li>
                    })}
                </ol>
                <div className="flex space-x-3">
                    <button class="flex mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm">
                        <BsFillBagCheckFill className='m-1' />
                        CheckOut</button>
                    <button onClick={clearCart} class="flex mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm">
                        <AiOutlineClear className='m-1' />
                        Clear Cart</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
