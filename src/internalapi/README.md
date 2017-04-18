# Internal API Specification

The internal API is for use by the processor system in order to download player data and code for it to process.

The challenge is never specified by the processor; the API only responds to queries concerning the current challenge. If there is no current challenge, a 404 File Unavailable error will be returned.

Requests are authenticated using the Authorization header. The header should contain only the auth scheme (`api-password`) and the password.

- **GET /challenge** Returns the current challenge's JSON file
- **GET /submission-list** A list of all players who are competing in the challenge. Returns a JSON array of player IDs. The processor does not need to be provided with usernames
- **GET /submission/:id** The player's code and settings. Returns a JSON object as specified in `doc/submissions.md`
- **PUT /status** Sets the status string. Before the processor sets a status string, it equals "Waiting for processor to connect". The processor should update this frequently while loading
    - **status** The status string
    - **progress** _optional_ The progress, as an integer from 0 to 999
    - **time** _if status is "~START"_ The game tick on which the processor starts
- **PUT /tickrate** Sets the tickrate, in seconds per hundred ticks. This is necessary because the webserver is delayed by 100 ticks, because the processor only sends data every 100 ticks. The webserver attempts to stay at the same pace. The processor may choose to update this endpoint at any time
    - **tickrate** The tickrate.
- **POST /room-history/:id** Post a room history for 100 ticks. Should be a JSON object
    - `notifyWhenAttacked` may be removed from the data
- **POST /notification** Posts an event to be broadcast to all spectators in all rooms. Note that the event should not be displayed immediately; it should be queued to display at the correct time
    - **time** The gametick on which the event occurs
    - **eventData** A JSON string containing data about the event. Usually includes `player`, which is the player ID
        - **type** The type of event
            - **rcl** A player has reached the next RCL
            - **storage** A player has built a storage
            - **terminal** A player has built a terminal
            - **spawn2** A player has built a second spawn
            - **spawn3** A player has built a third spawn
            - **nuker** A player has built a nuker
            - **extractor** A player has built a mineral extractor
