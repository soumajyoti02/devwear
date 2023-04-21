import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import { Router, useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({})
  const [subTotal, setSubtotal] = useState(0)
  const [user, setUser] = useState({ value: null })
  const [key, setKey] = useState()

  const [progress, setProgress] = useState(0)

  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }
    } catch (error) {
      console.error(error)
      localStorage.clear()
    }

    const token = localStorage.getItem('token')
    if (token) {
      setUser({ value: token })
      setKey(Math.random())
    }

  }, [router.query])


  const logout = () => {
    localStorage.removeItem('token')
    setKey(Math.random())
    setUser({ value: null })
    router.push('/')
  }

  // Define a function called saveCart that takes in a cart object as an argument
  const saveCart = (myCart) => {
    // Save the cart object to localStorage as a JSON string
    localStorage.setItem("cart", JSON.stringify(myCart))

    // Initialize a variable called subt (short for subtotal) to 0
    let subt = 0;

    // Get an array of all the keys in the cart object
    let keys = Object.keys(myCart)

    // Loop through each key in the cart object
    for (let index = 0; index < keys.length; index++) {
      // Multiply the price and quantity of the item together and add it to the subt variable
      subt += myCart[keys[index]].price * myCart[keys[index]].qty
    }

    // Set the subtotal state to the value of subt
    setSubtotal(subt)
  }


  const clearCart = () => {
    setCart({})
    saveCart({})
  }


  const buyNow = (itemCode, qty, price, name, size, variant) => {
    let newCart = { itemCode: { qty: 1, price, name, size, variant } }

    setCart(newCart)
    saveCart(newCart)

    router.push('/checkout')
  }


  // Define a function called addToCart that takes in several arguments
  const addToCart = (itemCode, qty, price, name, size, variant) => {
    // Create a new variable called newCart and set it equal to the current value of the cart state
    let newCart = cart

    // Check if the itemCode already exists in the cart state
    if (itemCode in cart) {
      // If it does, update the quantity of the item in the newCart variable
      newCart[itemCode].qty = cart[itemCode].qty + qty
    }
    else {
      // If it doesn't, add a new item to the newCart variable with the specified details
      newCart[itemCode] = { qty: 1, price, name, size, variant }
    }

    // Update the cart state with the newCart variable
    setCart(newCart)

    // Save the newCart variable to localStorage and update the subtotal
    saveCart(newCart)
  }


  const removeFromCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = cart
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty
    }
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode]
    }
    setCart(newCart)
    saveCart(newCart)
  }

  return <>
    <LoadingBar
      color='#ff2d45'
      progress={progress}
      waitingTime={400}
      onLoaderFinished={() => setProgress(0)}
    />
    {key && <Navbar logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />}
    <Component buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
    <Footer />
  </>
}
