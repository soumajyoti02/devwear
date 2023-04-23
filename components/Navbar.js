import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsCart4, BsFillBagCheckFill } from 'react-icons/bs';
import { AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle, AiOutlineClear } from 'react-icons/ai';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';

const Navbar = ({ logout, user, cart, addToCart, removeFromCart, clearCart, subTotal }) => {
    const [dropdown, setDropdown] = useState(false)
    const [sidebar, setSidebar] = useState(false);

    const router = useRouter()

    useEffect(() => {
        Object.keys(cart).length !== 0 && setSidebar(true)
        let exempted = [`/checkout`, `/order`, `/orders`, `/myaccount`]
        if (exempted.includes(router.pathname)) {
            setSidebar(false)
        }
    }, [])

    const toggleCart = () => {
        setSidebar(!sidebar)
        // if (ref.current.classList.contains('translate-x-full')) {
        //     ref.current.classList.remove('translate-x-full')
        //     ref.current.classList.add('translate-x-0')
        // }
        // else if (!ref.current.classList.contains('translate-x-full')) {
        //     ref.current.classList.remove('translate-x-0')
        //     ref.current.classList.add('translate-x-full')
        // }
    }

    const ref = useRef()

    return (
        <>

            {!sidebar && <span onMouseOver={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)} className='fixed right-14 top-[1.8rem] md:right-20 md:top-[1.6rem] z-30 cursor-pointer'>
                {dropdown && <div className="absolute right-[-1rem] top-4 md:top-6 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:py-5 py-3 z-30" aria-orientation="vertical" >
                    <ul className="py-1">
                        <Link href={'/myaccount'}><li className="text-gray-700 block px-4 py-2 text-sm hover:bg-pink-100" id="menu-item-0">Account</li></Link>
                        <Link href={'/orders'}><li className="text-gray-700 block px-4 py-2 text-sm hover:bg-pink-100" id="menu-item-1">My Orders</li></Link>
                        <li onClick={logout} className="text-gray-700 block px-4 py-2 text-sm hover:bg-pink-100" id="menu-item-3">Sign out</li>
                    </ul>
                </div>}
                <span onMouseOver={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                    {user.value && <MdAccountCircle className='text-2xl md:text-3xl mt-[0.1rem] md:mt-[0.2rem]' />}
                </span>
            </span>}



            <div className={`flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky z-10 top-0 bg-white ${!sidebar && 'overflow-hidden'}`}>
                <div className="logo mx-5 mr-auto md:mr-5">
                    <Link href={'/'}><Image width={200} height={40} src={'/logo.png'} alt='logo' /></Link>
                </div>
                <div className="nav">
                    <ul className="flex items-center space-x-4 font-bold md:text-lg">
                        <Link href={`/tshirts`}><li className="cursor-pointer hover:text-pink-500">Tshirts</li></Link>
                        <Link href={`/hoodies`}><li className="cursor-pointer hover:text-pink-500">Hoodies</li></Link>
                        <Link href={`/stickers`}><li className="cursor-pointer hover:text-pink-500">Stickers</li></Link>
                        <Link href={`/mugs`}><li className="cursor-pointer hover:text-pink-500">Mugs</li></Link>
                    </ul>
                </div>

                <div className="cursor-pointer cart items-center absolute right-0 top-[1.35rem] mx-5 flex space-x-2 md:space-x-6 h-10">



                    {!user.value && <Link href={'/login'}>
                        <button className="flex mx-auto mr-3 md:mt-1 text-white font-semibold bg-pink-500 border-0 py-[0.359rem] md:py-2 px-[0.7rem] md:px-4 focus:outline-none hover:bg-pink-600 rounded-md text-base">Login</button>
                    </Link>}
                    <BsCart4 onClick={toggleCart} className='text-2xl md:text-3xl' />
                </div>

                <div ref={ref} className={`sideCart  h-[100vh] w-80 absolute overflow-y-scroll top-0 bg-pink-100 p-10 transform transition-transform ${sidebar ? 'right-0' : '-right-96'}`}>
                    <h2 className="font-bold text-xl">Shopping Cart</h2>
                    <span onClick={toggleCart} className="cursor-pointer absolute top-5 right-2  text-2xl text-pink-600">
                        <AiFillCloseCircle />
                    </span>
                    <ol className="list-decimal font-semibold">
                        {/* Object.keys(cart) returns an array of all the keys in the cart object. */}

                        {Object.keys(cart).length == 0 && <div className='my-4 font-normal'>Your Cart is Empty</div>}

                        {Object.keys(cart).map((k) => {
                            return <li key={k} className="">
                                <div className='item flex my-5'>
                                    <div className="w-2/3 font-semibold">{cart[k].name} ({cart[k].size}/{cart[k].variant})</div>
                                    <div className="flex font-semibold justify-center items-center w-1/3 text-lg">
                                        {/* Here k is slug */}

                                        <AiFillMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                                        <span className="mx-2 text-sm">{cart[k].qty}</span>
                                        <AiFillPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                                    </div>
                                </div>
                            </li>
                        })}
                    </ol>
                    <div className="total font-bold my-3">SubTotal: ₹{subTotal}</div>
                    <div className="flex space-x-3">
                        <Link href={'/checkout'}>
                            <button disabled={Object.keys(cart).length === 0} className=" disabled:bg-pink-300 flex mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm">
                                <BsFillBagCheckFill className='m-1' />
                                CheckOut</button>
                        </Link>
                        <button disabled={Object.keys(cart).length === 0} onClick={clearCart} className="disabled:bg-pink-300 flex mx-2 text-white bg-pink-500 border-0 py-2 px-[0.7rem] focus:outline-none hover:bg-pink-600 rounded text-sm">
                            <AiOutlineClear className='m-1' />
                            Clear Cart</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
