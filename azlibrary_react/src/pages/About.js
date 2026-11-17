import { Link } from "react-router-dom";
import Breadcrumb from "../components/presentation/Breadcrumb";

// The API base already carries the right host for whichever environment this
// build is serving, so the links below work on dev and in production without
// a hostname written into the page.
const apiBase = process.env.REACT_APP_AZLIB_API_URL;

const isMining = "ADMM" === process.env.REACT_APP_SITE;

const siteName = isMining ? "AZGS Mining Info" : "the AZGS Library";

// Only the holdings answer differs between the two builds. Everything below
// it is true of both sites and is written once; see Layout.js, where a
// hand-kept second copy of the recent-changes list had to be collapsed for
// the same reason.
const Holdings = () => isMining ?
    <>
        <p>
            AZGS Mining Info publishes mining-related material for Arizona. It replaces the
            AZGS Mining Document Repository formerly found at minedata.azgs.arizona.edu.
        </p>
        <p>
            The bulk of the collection was originally compiled by the now-defunct Arizona
            Department of Mines and Mineral Resources. It is no longer a closed historical
            set: the <a href="https://azgs.arizona.edu/about/staff" target="_blank" rel="noopener noreferrer">AZGS
            Mineral Resources and Bedrock Geology Group</a> adds new material to it.
        </p>
    </> :
    <>
        <p>
            The AZGS Library publishes the materials of the Arizona Geological Survey —
            reports, maps, data sets and the documents that accompany them. It replaces the
            AZGS Document Repository.
        </p>
        <p>
            AZGS publications can also be found in the <a href="https://repository.arizona.edu/handle/10150/628301" target="_blank" rel="noopener noreferrer">University
            of Arizona Campus Repository</a>, which is a separate service holding much of the
            same material.
        </p>
    </>;

const About = () => {
    return <div className="container">
        <Breadcrumb page="About" />

        <h1>About {siteName}</h1>

        <h2 className="h4 mt-4">What is this site?</h2>
        <Holdings />

        <h2 className="h4 mt-4">Who runs it?</h2>
        <p>
            The <a href="https://azgs.arizona.edu/" target="_blank" rel="noopener noreferrer">Arizona
            Geological Survey</a>, part of the University of Arizona. AZGS is the state's
            geological survey, and this site is how it publishes its material.
        </p>

        <h2 className="h4 mt-4">May I reuse what I download?</h2>
        <p>
            Yes. Everything here is published under the <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative
            Commons Attribution-ShareAlike 4.0 licence</a> (CC BY-SA 4.0). You may copy,
            redistribute, adapt and build on it, including commercially, provided you give
            credit and release what you build under the same terms.
        </p>
        <p>
            Each collection record carries its licence, so you can confirm it for any
            individual item rather than taking this page's word for it.
        </p>
        <p>
            Copyright is held by the Arizona Board of Regents on behalf of the University of
            Arizona. Note the disclaimer at the foot of every page: this material is provided
            for informational purposes and accuracy is not guaranteed.
        </p>

        <h2 className="h4 mt-4">Do I need an account?</h2>
        <p>
            No. There is no login, no registration and no API key. Every collection on this
            site is public and can be downloaded by anyone.
        </p>

        <h2 className="h4 mt-4">Can I get at this from a script?</h2>
        <p>
            Yes — this site is a front end for a public HTTP API, and anything you can do
            here you can do from a program. It is versioned, open to requests from any
            origin, and needs no credentials.
        </p>
        <p>
            Each route documents itself. For the collection metadata route:
        </p>
        <ul>
            <li>
                <a href={`${apiBase}/metadata?limit=1`} target="_blank" rel="noopener noreferrer">
                    <code>{apiBase}/metadata</code>
                </a> — the collections themselves
            </li>
            <li>
                <a href={`${apiBase}/metadata?help=json`} target="_blank" rel="noopener noreferrer">
                    <code>?help=json</code>
                </a> — its OpenAPI definition, listing every parameter and response field
            </li>
            <li>
                <a href={`${apiBase}/metadata?help=html`} target="_blank" rel="noopener noreferrer">
                    <code>?help=html</code>
                </a> — the same, formatted for reading
            </li>
        </ul>
        <p>
            Responses come back as JSON by default. Add <code>format=csv</code>,
            <code> format=geojson</code> or <code>format=xml</code> for the others, and
            <code> format=ReSciColl</code> for the CSV variant that service expects.
        </p>

        <h2 className="h4 mt-4">Why can't I find something?</h2>
        <p>
            The search box looks through the catalogue record — the title, authors,
            keywords, series and abstract — and orders results by how closely they match.
        </p>
        <p>
            It can also reach into the text of the documents themselves, but only where that
            text exists. A large proportion of the older collection is scanned images of
            printed pages, and those pages have no machine-readable text behind them. A
            document of that kind can be found by its catalogue record and not by anything
            printed inside it. If you are looking for a place or a name that would appear in
            the body of an old report, it may well be here without being findable that way.
        </p>
        <p>
            If you believe something is missing altogether, please tell us — see below.
        </p>

        <h2 className="h4 mt-4">How do I report a problem or ask a question?</h2>
        <p>
            Email <a href="mailto:azgs-info@arizona.edu">azgs-info@arizona.edu</a>, or see
            the <Link to="/contact/">contact page</Link> for post and telephone.
        </p>
        <p>
            Faults in the site itself can be raised directly
            at <a href="https://github.com/azgs/azlibrary_react/issues" target="_blank" rel="noopener noreferrer">the
            issue tracker</a>.
        </p>

        <h2 className="h4 mt-4">Where is the source code?</h2>
        <p>
            This site is open source. The web application is
            at <a href="https://github.com/azgs/azlibrary_react" target="_blank" rel="noopener noreferrer">azgs/azlibrary_react</a> and
            the API that serves it
            at <a href="https://github.com/azgs/azlibrary_api" target="_blank" rel="noopener noreferrer">azgs/azlibrary_api</a>.
        </p>
    </div>;
};

export default About;
