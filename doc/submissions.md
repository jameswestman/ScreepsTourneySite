# Submission File Format

Each submission is a JSON file stored in `data/challenges/<name>/entries` with
the user ID as a filename (with `.json` extension).

- **settings** _required_ The user's settings, chosen on the submission page. Settings should not be included if they are not allowed by the challenge rules. This will be checked by both the webserver and the processor
    - **spawn** An object containing X and Y coordinates for the player's first spawn. Keys are lowercase: `x` and `y`
    - **mineral** The mineral in the room
- **code** _required_ The user's code. Maps filenames to strings
- **username** _required_ The player's username
