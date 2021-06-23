import React from 'react'

export default function Login() {
    return (
        <div className="tw-flex tw-flex-col">
            <span className="tw-border tw-border-black">Username</span>
            <input />
            <span>Password</span>
            <input type="password" className="tw-border tw-border-black" />
            <button className="">Masuk</button>
        </div>
    )
}
