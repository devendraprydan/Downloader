import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
export default function Navbar(props) {

    const [visible, setVisible] = useState("flex");

    const toggle = () => {

        if (visible === "flex") {
            setVisible("hidden")
        }
        else {
            setVisible("flex")
        }
    }

    // const comming_soon_insta=()=>{

    //     alert("Insta downlaoder also comming soon...")
    // }
    const comming_soon_facebook = () => {

        alert("Facebook downlaoder also comming soon...")
    }
    const comming_soon_twitter = () => {

        alert("Twitter downlaoder also comming soon...")
    }

    return (
        <nav className="navbar-nav">
            <div className={`drag-icon h-10 w-10 flex justify-center items-center gap-1 cursor-pointer`} onClick={toggle}>
                <span className='w-5.5 h-1 drag-icon-i'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className='w-4 h-1 drag-icon-i ml-1'>&nbsp;&nbsp;&nbsp;</span>
                <span className='w-5.5 h-1 drag-icon-i'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div className={`circles ${visible} flex-col gap-2`} >
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1">
                    <Link to="/"><img src="https://www.pngplay.com/wp-content/uploads/8/Youtube-Red-Logo-Background-PNG-Image.png" alt="Not-found" className='logo' /></Link>
                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center drag-icon-insta" //onClick={comming_soon_insta}
                >
                    <Link to="/InstaDownloader"><img src="https://www.pnguniverse.com/wp-content/uploads/2020/10/Logo-de-instagram-original.png" className='Insta_logo' alt="Not-found" /></Link>
                    {/* <img src="https://www.pnguniverse.com/wp-content/uploads/2020/10/Logo-de-instagram-original.png" className='Insta_logo' alt="Not-found" /> */}
                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1 drag-icon-facebook" onClick={comming_soon_facebook}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#2aa4f4"></stop><stop offset="1" stopColor="#007ad9"></stop></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
                    </svg>
                </div>
                <div className="drag-icon h-10 w-10 flex justify-center items-center gap-1 bg-black" onClick={comming_soon_twitter}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"
                        className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp r-1nao33i r-16y2uox r-8kz0gk invert drag-icon-twitter">
                        <g>
                            <path
                                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
                            </path>
                        </g>
                    </svg>
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