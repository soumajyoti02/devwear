import React, { useEffect } from 'react'
import { Router, useRouter } from 'next/router';

const Myaccount = () => {
    const router = useRouter()
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [])
    return (
        <div>

        </div>
    )
}

export default Myaccount
