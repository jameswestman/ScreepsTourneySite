# Instructions on Configuring the Server

Server configuration is stored in `config.json`. This file is not included by default. You will need to create it. This is to make sure that it is not overwritten when the server is updated. However, there is a default config file in `config_example.json`.

- **host** _required_ The hostname of the website
- **consolehost** _required_ The hostname for the console server. This must be a separate domain name for security purposes
- **https** If present, only HTTPS connections will be served
    - **key** _required_ Path to the private key
    - **cert** _required_ Path to the certificate.
    - **hpkp** If present, HPKP will be used
        - **maxAge** Max age of the header in seconds
        - **sha256s** Array of SHA256 checksums of allowed certificates, in base64 format
- **paths** _required_ Paths to important locations. Relative paths will be evaluated relative to the install directory of the server
    - **data** _required_ The path to a directory to store data
    - **challenges** _required_ The path to the directory containing the challenges
- **apiPassword** _required_ BCrypt hashed password for the internal API
