# Arizona Geological Survey Web Application

The Arizona Geological Survey freely publishes all of its materials online at https://library.azgs.arizona.edu. This online repository is powered by a custom data service - https://data.azgs.arizona.edu and database. The combination of all three services is codenamed AZLib.

## Features List
The following is a checklist of key features that the web application (and/or underlying API/database) are meant to facilitiate. 

- [x] **Versioning**: AZLib currently supports a linear versioning system where relationships between new publications that supersede an older publication are explicitly tracked. A user is always able to find the successor/predecessor of any item in the repository.

- [x] **Geographic Search**: AZLib supports geographic search of its items. This is powered in the web applicaiton through a leaflet interface and in the API by OGC WKT queries.

- [x] **Full-text Search**: AZLib supports full-text search of the metadata records AND any of the texts (e.g., PDFs, word-documents) bundled in the publication. This is powered on the back-end by the [native PostgreSQL full-text search](https://www.postgresql.org/docs/15/textsearch.html) functions (`tsvector` and `tsquery`). 
