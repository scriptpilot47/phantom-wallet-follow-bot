# Phantom Wallet follow bot

### Description

This program allows the user to auto follow other users phantom wallet @username. By default, it will use MY public account for this purpose, but custom bot accounts can be added optionally.

### Requirments:

- a list of phantom @usernames to follow

---

### How to start (linux/mac)

1. Python setup

```bash
cd phantombot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Than open `/source/bots.json` and add new usernames to the list (the bot will follow these accounts)

_dont't delete anything from the json file! The username `oY36hDpnjol9`is my bot account's username_

```json
// [
//     {
//         "username": "oY36hDpnjol9",
//         "address": "AeY123RcNdyCCBmJdPHeETyUjTp8NpbjwJ9x7GRn2JXZ",
//         "phrase": [
//             "job",
//             "sphere",
//             "oval",
//             "narrow",
//             "damage",
//             "mother",
//             "monster",
//             "foot",
//             "charge",
//             "eager",
//             "radar",
//             "toilet"
//         ],
//         "actor_id": "6e3a6043-98e9-4cec-82fd-9a3a0bf30353",
//         "follow_started": true,
//         "follow_finished": true,
//         "following": []
//     },
{
  "username": "username1",
  "actor_id": false,
  "follow_started": true,
  "follow_finished": true
},
{
  "username": "username2",
  "actor_id": false,
  "follow_started": true,
  "follow_finished": true
}
// ]
```

3. install phantom [chrome extension](https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa)

---

## How to start the bot

1. Start the Flask server by running `python app.py`
   - this server will handle the bot auto follow process
1. Open this page in chrome after installed phantom (don't submit any seed phrase)

   - `chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/onboarding.html`

1. Right click --> Dev tools --> console
1. Copy and paste the script from `submit_phrase.js` file and wait for it to run
   - this script requires the passphrase of the bot (stored in the json file) and auto complete the wallet setup
1. Open this page in chrome after installed phantom (don't submit any seed phrase)

   - `chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/popup.html`

1. Right click --> Dev tools --> console
1. Copy and paste the script from `app.js` file and wait for it to run (~1 minutes)
   - this script intercepts a network header and send it back to python Flask server
1. The bot should start to follow the targets and print results to the console

---

# Extended usage

This program capable of running multiple bots simoultanusly.  
A valid bot must have:

- a registered phantom @username
- it's seed phrase
  - `don't use seed phrases with actual $$$ stored in them! Instead, generate new ones`

### JSON file structure

The /source/bots.json file is the 'database' of this app. My bot account (and other bots) stored here, but also the usernames stored here, the bot follows.

The program automatically read / write this file. Only edit manually, to add new phantom accounts / bots.

There are two type of account:

1. `target only`
   - it wont follow anyone (since it has no passphrase)
   - server wont send it
   - other bots will follow it
1. `BOT`
   - it will follow every target when served by the flask server
   - server will send it's phrase to javascript
   - other bots will follow it too

#### Example for a `target only` account

```json
{
  "username": "targetonlyusername",
  "actor_id": false,
  "follow_started": true,
  "follow_finished": true
}
```

#### Example for a `BOT` account

```json
{
  "username": "mybotusername",
  "phrase": [
    "word1",
    "word2",
    "word3",
    "word4",
    "word5",
    "word6",
    "word7",
    "word8",
    "word9",
    "word10",
    "word11",
    "word12"
  ],
  "actor_id": false,
  "follow_started": false,
  "follow_finished": false,
  "following": []
}
```

---

# !THE FIRST ACCOUNT MUST BE MY PUBLIC BOT!

`I will never store anyting in this seed phrase! This meant to be a public actor-id instead, since actor-ids are hard to get without one.`

_(otherwise no valid actor-id is present and the app can't fetch the other accounts actor-id)._

Actor id is the "server username" for a username. For example: username `@oY36hDpnjol9` is recognized by the phantom wallet's server as the actor id: `6e3a6043-98e9-4cec-82fd-9a3a0bf30353`

---

Add custom bots/targets only after this, in the bots.json file: (adding the address is optional)

```json
{
  "username": "oY36hDpnjol9",
  "address": "AeY123RcNdyCCBmJdPHeETyUjTp8NpbjwJ9x7GRn2JXZ",
  "phrase": [
    "job",
    "sphere",
    "oval",
    "narrow",
    "damage",
    "mother",
    "monster",
    "foot",
    "charge",
    "eager",
    "radar",
    "toilet"
  ],
  "actor_id": "6e3a6043-98e9-4cec-82fd-9a3a0bf30353",
  "follow_started": false,
  "follow_finished": false,
  "following": []
}
```

### Flask server

The Flask server handles everything. It reads the json file when it's API endpoint is hit, and send the first BOT account from the list, where:

```json
"follow_finished": false,
```

_This means the current bot hasn't followed every target yet._

After it does, the `"follow_finished": true,` changes automatically.

If you hit the API again, the server will send a new bot, while the previous one is running.

If a bot hit an error 5 times, it stop and save the already followed accounts to the json file `"following"` list, to avoid double work next time.

Also a bot won't follow itself from the list, instead it skips.
