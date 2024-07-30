import React from 'react'

export default function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand text-red link" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link link" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link link" aria-current="page" href="#">About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link link" aria-current="page" href="#">Contect Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link link" href="#">Pricing</a>
                        </li>
                        <div className="form-check form-switch pt-2 link">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onClick={props.Toggle} />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{props.label}</label>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
