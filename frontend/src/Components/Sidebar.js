import React from 'react'
import { useState } from 'react'

export default function Sidebar(props) {

    // const [visible, setVisible] = useState("flex")
    const toggle=()=>{
        
        // if(visible==="flex")
        // {
        //     setVisible("hidden")
        // }
        // else
        // {
        //     setVisible("flex")
        // }
        alert("fhjdifdf")
    }
    return (
        <nav className="navbar navbar-expand-lg">
            <div className={`drag-icon h-10 w-10 ${visible} justify-center items-center gap-1`} onClick={toggle}>
                <span className='w-5.5 h-1 drag-icon-i'>kdj</span>
                <span className='w-4 h-1 drag-icon-i ml-1'>kdj</span>
                <span className='w-5.5 h-1 drag-icon-i'>kdj</span>
            </div>
            <div className="circles flex flex-col gap-2 ">
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1">

                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1">

                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1">

                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1">

                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="#FFFFFF"
                    >
                        <path
                            fillRule="evenodd"
                            d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                        />
                    </svg>
                </div>
            </div>
        </nav>
    )
}