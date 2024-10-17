# NeuronOS Dev Exercise

## Table of Contents
1. [Installation](#installation)
2. [Local Setup Instructions](#instructions)
4. [Assumptions](#assumptions)
5. [Architectural Decisions](#decisions)
6. [Future Improvements](#improvements)

## Chrome Extension Installation

You have two options to install this Chrome extension:
1. Install the latest build
2. Install from your local development environment

**Installing from the latest build**

The latest build (v0.0.3) can be [downloaded from this link](#download-link) as a zip file.

1. Click on the link above & download the zip file
2. Once the file is downloaded unzip the file
3. Note the directory where you unzipped the contents (the folder that contains the extension code)
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable “Developer mode” using the toggle in the upper-right corner
6. Click the **Load unpacked** button and select the directory that contains the extension code (ref: step 3)

The extension should now be available in Chrome, and you can open the popup to view and interact with messages.

**Installing from your local environment**

1. Follow the [instructions to setup and build this repository locally](#link-to-section)
2. Once the build has been completed, note the `dist/` directory that contains the build
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable “Developer mode” using the toggle in the upper-right corner
5. Click the **Load unpacked** button and select the `dist/` directory within this repository

## Development Setup Instructions

### Prerequisites
Ensure that you have the following software and corresponding version installed on your machine:

- **NodeJS** (v20.16.0 or higher)
- **NPM** (10 recommended)
- **Google Chrome** (Latest version)

**Clone the repository**
```
git clone <repo-url>/neuronos-dev-exercise.git
cd neuronos-dev-exercise
```

**Install the dependencies**
```
npm install
```

**Build the extension**
```
npm run build
```

This will generate the `dist/` directory that contains the unpacked extension.

## Assumptions

The following assumptions were made during the development of this extension.

These assumptions were made according to the following factors:
- The information given in the exercise criteria
- Time allocated for this exercise

**API**
- A live endpoint would have pagination capability and would serve only the latest messages after a certain cursor (message)
- The live endpoint would also expect a limit of messages to return, it can return less than the limit but no more
- Give the above, this behaviour is simulated in this extension

**Data Storage**
- The extension relies solely on Chrome's storage for the state and doesn't make use of any other databases or storage other than the mocked endpoint

**Authentication**
- This exercise doesn't note any requirement for authentication, therefore there's no handling or simulation of an authentication flow or an authentication with the API
- Normally, there would be a mechanism to authenticate the user and also authenticate the API requests (since these messages would normally be assumed to be private)

**Receiving Updates**
- It's assumed that the API endpoint that's mocked doesn't support real-time, "push" based updates
- Normally, we wouldn't poll an endpoint for receiving messages. The API for this type of application would usually use Web Sockets or Push Notifications to receive updates rather than poll for updates
- Since the requirement for this exercise is to mock an endpoint, we are "asking" for updates rather than "waiting" for updates from a real-time push-based API.

**Happy Path Assumption**
- For the purpose of this exercise, we're assuming successful responses (happy path)
- While error handling mechanisms are in place, it's assumed that an API error isn't critical enough to retry the request

**Timestamp based sorting**
- It's assumed that by default messages are sorted by timestamp
- It's also assumed that messages in storage aren't stored in a particular order since we're fetching messages periodically and the stored messages might not follow a linear history, therefore when we retrieve the data we must re-sort the messages by timestamp.
- This project also assumes that timezone differences aren't a concern and that the user is always in the same timezone, so we don't need to adjust the timestamp based on timezone changes

**Simple Inbox Model**
- This project assumes that it's sufficient to mark message read state as binary (read: true/false) and that there's no consideration for more granular states (e.g. seen, partially read, archived)
- I'm assuming that while messages can be marked as read, they can't be marked as unread (in other words, no toggling the read state)
- It's also assumed that the message history doesn't need to be deleted by the user
- It's assumed that there's no external application or interface that shares these messages or modifies their state, we're assuming that this extension is the only way messages can be read

**Message Priorities**
- It's assumed that message priority level is limited to `high` or `low` and there's no other priority level or dynamic properties (e.g. medium, critical, revenue impacting, catastrophic, etc...)

**Simple Sorting**
- It's assumed that it's sufficient to sort by individual properties (timestamp, priority & read state)
- There's no sorting by a combination of properties (e.g timestamp + priority, priority + read state)
