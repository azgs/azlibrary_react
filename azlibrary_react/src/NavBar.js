import React from 'react'

export default function NavBar() {
    return (
        <>
            <header className="bg-red arizona-header" id="header_arizona">
                <div className="container">
                    <div className="row">
                        <a className="arizona-logo" href="http://www.arizona.edu" title="The University of Arizona homepage">
                            <img className="arizona-line-logo" alt="The University of Arizona Wordmark Line Logo White" src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg" />
                        </a>
                    </div>
                </div>
            </header>

            <ul class="nav justify-content-end">
                <li class="nav-item">
                    <a class="nav-link" href="https://digital.arizona.edu/arizona-bootstrap/docs/2.0/getting-started/introduction/" target="_blank" rel="noopener noreferrer">AZBootstrap</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://devdata.azgs.arizona.edu/api/v1/metadata?help=html" target="_blank" rel="noopener noreferrer">API</a>
                </li>
            </ul>
        </>
    )
}