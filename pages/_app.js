import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({})
  const [subTotal, setSubtotal] = useState(0)

  useEffect(() => {
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }
    } catch (error) {
      console.error(error)
      localStorage.clear()
    }

  }, [])


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
    <Navbar key={subTotal} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />
    <Component cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
    <Footer />
  </>
}
