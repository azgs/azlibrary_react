import { Outlet, Link, useLocation } from "react-router-dom";
import logo from '../assets/images/azgs.png';
import logo2 from '../assets/images/AZGS_Logo_-Mine-100x100.png'

const debug = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

const Layout = () => {

    const location = useLocation();

    // Current route
    const pathname = location.pathname;

    return (
        <>
            <header className="bg-red arizona-header" id="header_arizona">
                <div className="container">
                    <div className="row">
                        <a className="arizona-logo" href="http://www.arizona.edu" title="The University of Arizona">
                            <img className="arizona-line-logo" alt="The University of Arizona Wordmark Line Logo White" src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg" />
                        </a>
                    </div>
                </div>
            </header>

            <div className="container">

                <nav className="navbar navbar-expand-lg navbar-light mb-4">
                    <a className="navbar-brand" href="https://azgs.arizona.edu/"><img src={logo} alt="AZGS logo" className="img-fluid" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="icon material-icons-sharp"> menu </span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className={pathname === "/" ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" to="/">Home</Link>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="https://github.com/azgs/azlibrary_react/" target="_blank" rel="noopener noreferrer">About</a>
                            </li>

                            <li className={pathname === "/contact" ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" to="/contact">Contact</Link>
                            </li>

                            {debug && <>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://devdata.azgs.arizona.edu/api/v1/metadata?help=html" target="_blank" rel="noopener noreferrer">API</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://xdd.wisc.edu/adept/" target="_blank" rel="noopener noreferrer">Adept</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://digital.arizona.edu/arizona-bootstrap/docs/2.0/getting-started/introduction/" target="_blank" rel="noopener noreferrer">AZBootstrap</a>
                                </li>
                            </>}

                        </ul>
                    </div>
                </nav>

                {"azlib" === process.env.REACT_APP_SITE &&
                <div className="alert alert-annc alert-dismissible fade show text-left  rounded py-4" role="alert">
                    The AZGS Library website is the replacement for the AZGS Document Repository. This site is still under development. Please contact <a className="alert-link" href="azgs-info@arizona.edu" target="_blank" rel="noopener noreferrer" >azgs-info@arizona.edu</a> for additional information and support. All AZGS publications can also be accessed from the <a className="alert-link" href="https://repository.arizona.edu/handle/10150/628301" target="_blank" rel="noopener noreferrer" >University of Arizona Campus Repository</a>.
                    <p></p>
                    <b>Recent Changes</b>
                    <ul>
                        <li>Based on user feedback, you must now hit <i>Apply filters</i> to execute a search.</li>
                        <li>Total number of collections returned displayed at top of form</li>
                        <li>Results sorted by publication year unless preempted by filter ranking</li>
                        <li>Multiple lineage versioning (collection can supersede/be superseded by one or more collections)</li>
                    </ul>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                }

            </div>

            <div className='fullpage'>
                <Outlet />
            </div>

            <footer className="footer bg-warm-gray text-center mt-4">
                <div className="container py-4">
                    <div className="row">
                        <div className="col-12">
                            <p>520.621.2352 | 1955 East 6th Street, P.O. Box 210184, Tucson, AZ 85721</p>
                            <p><a href="https://www.arizona.edu/information-security-privacy" target="_blank" rel="noopener noreferrer">University Information Security and Privacy</a></p>
                            <p className='small'>The maps, reports, and other information and content on this website are provided as a public service for informational purposes only.  Accuracy is not guaranteed, and the information contained or linked on this website should not be relied on except as general information.  The University makes no warranties or representations of any kind, and specifically disclaims all warranties including the warranty of merchantability and fitness for a particular purpose.  Users are responsible for verification of all facts and information to their own satisfaction.</p>
                            <hr />
                            <p>&copy; 2022 The Arizona Board of Regents on behalf of <a href="https://www.arizona.edu" target="_blank" rel="noopener noreferrer" >The University of Arizona</a>.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Layout