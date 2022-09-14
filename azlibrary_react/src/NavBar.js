import React from 'react'

export default function NavBar() {
    return (
        <div className="bg-red p-3 mb-5">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12"><span className="text-uppercase heading-style m-0 text-white">The University of
                        Arizona</span>
                        <a className="pull-right" target="_blank" rel="noopener noreferrer" href="https://devdata.azgs.arizona.edu/api/v1/metadata?help=html">API</a>
                    </div>
                </div>
            </div>
        </div>
    )
}