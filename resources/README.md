# Resources Directory

This directory contains most of the files that are served on the www subdomain.
It does not contain challenge files; those are in a separate repository (see
the main README for details on that.)

- **static** Contains files that are _truly static,_ that is, they do not need any templating. This is mostly images, stylesheets, and javascript files
- **misc** For HTML sources that should not be served automatically, but are there for use by one of the endpoints
- **content** For HTML sources that need only basic templating, such as inserting a username
- **errors** For error pages.
