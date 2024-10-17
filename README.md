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

### API
- A live endpoint would have pagination capability and would serve only the latest messages after a certain cursor (message)
- The live endpoint would also expect a limit of messages to return, it can return less than the limit but no more
- Give the above, this behaviour is simulated in this extension
- It's assumed that the message ID's are in the format `msg{number}`

### Data Storage
- The extension relies solely on Chrome's storage for the state and doesn't make use of any other databases or storage other than the mocked endpoint
- It's assumed that storage is a simple key/value pair where the message history is stored as an array of objects under a particular key
- Since it's simple data storage, there's no need for a more advanced storage or data sync mechanism

### Authentication
- This exercise doesn't note any requirement for authentication, therefore there's no handling or simulation of an authentication flow or an authentication with the API
- Normally, there would be a mechanism to authenticate the user and also authenticate the API requests (since these messages would normally be assumed to be private)

### Receiving Updates
- It's assumed that the API endpoint that's mocked doesn't support real-time, "push" based updates
- Normally, we wouldn't poll an endpoint for receiving messages. The API for this type of application would usually use Web Sockets or Push Notifications to receive updates rather than poll for updates
- Since the requirement for this exercise is to mock an endpoint, we are "asking" for updates rather than "waiting" for updates from a real-time push-based API.

### Happy Path Assumption
- For the purpose of this exercise, we're assuming successful responses (happy path)
- While error handling mechanisms are in place, it's assumed that an API error isn't critical enough to retry the request
- It's also assumed that the user always has a connection to the database, in other words no offline capabilities or sync-capabilities for data-loss scenarios
- Components also assume that an action will be successful (for example marking a message as read), instead of waiting for a callback on whether the message has been successfully marked unread, the frontend component assumes success for the sake reactivity

### Timestamp based sorting
- It's assumed that by default messages are sorted by timestamp
- It's also assumed that messages in storage aren't stored in a particular order since we're fetching messages periodically and the stored messages might not follow a linear history, therefore when we retrieve the data we must re-sort the messages by timestamp.
- This project also assumes that timezone differences aren't a concern and that the user is always in the same timezone, so we don't need to adjust the timestamp based on timezone changes

### Simple Inbox Model
- This project assumes that it's sufficient to mark message read state as binary (read: true/false) and that there's no consideration for more granular states (e.g. seen, partially read, archived)
- I'm assuming that while messages can be marked as read, they can't be marked as unread (in other words, no toggling the read state)
- It's also assumed that the message history doesn't need to be deleted by the user
- It's assumed that there's no external application or interface that shares these messages or modifies their state, we're assuming that this extension is the only way messages can be read

### Message Priorities
- It's assumed that message priority level is limited to `high` or `low` and there's no other priority level or dynamic properties (e.g. medium, critical, revenue impacting, catastrophic, etc...)

### Simple Sorting
- It's assumed that it's sufficient to sort by individual properties (timestamp, priority & read state)
- There's no sorting by a combination of properties (e.g timestamp + priority, priority + read state)

### Simple Extension Handling States
- For simplicity, we're assuming that the user will always be in the browser while using this extension
- Therefore, callbacks on other events such as closing, re-opening the browser are handled (due to the time allocation)
- It's also assumed that even if when the user doesn't use the browser, messages should still be polled

## Architectural Decisions

### Data & Data Source Mocking
Based on the criteria **Mock an API endpoint that would provide messages**, I chose to create a random message generator using `faker`. I also chose to simulate an endpoint that would allow for pagination based on the last stored message id. So my random message generator increments the message id on each message.

### Service Abstraction Layers
I decided to create abstractions of working with the critical services:
- Messages
- Storage
- API

This way the application only needs to interface with the `Messages` services and the `Messages` service handles all work with the `Storage` and `API`. The main application (background and popup) doesn't directly make use of the `Storage` or `API` service.

The advantages of this approach:
- Readability - `Message.get`, `Storage.get`, `Storage.set`, etc... are easily read and explainable in terms of what service we're acting on and what we're doing
- Testing - It's easier to test certain aspects of the application when they are wrapped in services this way, especially mocking outputs from these services
- Decoupled/Futureproof - If later on I decide to change the storage medium, then it would be easy without changing the API of the service, the same for the data source if I implement a live endpoint or a web socket for example. In this case the consumer of the service wouldn't need modification since if the API of the service oesn't change.
- Encapsulation - Everything you need to work with a particular aspect is of the system is available through one service, anything that you don't need to care about is not made available via the service (e.g. how the data is fetched or stored) 

### Layered Architecture
The system is broken down into layers where the `Messages` service is the top-most layer and the application interfaces with only the top-most layer. The `Messages` service then interfaces with the services beneath it, `Storage` and `API`, while the main application never interfaces with those services. While they can, those services are made available, but I prefer the application to mainly interface with the `Messages` service.

The benefit of this architecture is that there's single point in interfacing with the messages and how the `Messages` service retrieves, stores or fetches the messages is abstracted away. When developing features that need to use the messages, we only care about the functions that are available via the `Messages` service. Changing, managing or updating the underlying logic or processes to retrieve, store & fetch messsages are also done in one place, the `Messages` service.

### Handlers
The methods available via the services follow the **Single Responsibility Principle** as the method has only one simple objective and don't perform more than one simple function (except for `Messages.get` which sorts the messages by timestamp). The handler functions act as controllers to combine separate operations. For example, the function `handleNewMessages` handles the full procedure when working with new messages.

This allows for the event functions (chrome event callback functions) to re-use these handlers for separate events. Allowing for changing the procedure in one place.

### State Managment
I decided to use React's `useReducer` For managing messages and their updates in the frontend (extension popup). This provides a centralized state for messages and handling state mutations. Essentially our application state is the message history that is stored in Chrome's storage. Therefore a centralized state is a representation of what's in Chrome's storage as well as certain attributes such as how the messages are sorted. React's `useReducer` makes it easy to extend and follow how the state is changed and provides an easy API.

The `MessagesProvider` is the central component to communication between the frontend and background service. The `MessageProvider` listens for events from the background service as well passes messages to the background when the message state is mutated (when a message is marked read) to reflect the change in storage.

### Smart & Dumb (Presentation) Component Architecture
Components below the main `Popup` component are "dumb" components in the sense that they don't call a hook `useMessages` directly but rather receive props from the `Popup` component, which is considered the smart component because it directly interacts with the state using the `useMessages` hook.

This provides the following advantages:
- Single point of state interaction: The `Popup` component acts as a controller therefore we know that any changes in how we interact with the state is managed in that component
- Decouples from context or state: Since the components under `Popup` aren't coupled to any state or hook, they can be re-used in other sections
- Readability - I know exactly what data is being passed to the components, instead of, for example, `<Component />` where I don't know what properties it requires to function unless I look into it.

The disadvantage is that there's some prop drilling. For example, `<MessageList messages={messages} onUpdateMessage={updateMessage} />` receives `messages` while it can retrieve this via the `useMessages` hook internally. Then, inside that component, `<MessageItem key={id} content={content} timestamp={timestamp} {...} />` I pass through certain props of one message, where that component can also simply retrieve it by id via `useMessages`. I choose not to do this though, because it would then be tied to the context and wouldn't be easily re-used if it needs to work the same in another part of the application using a different but similar state/context. Another reason is that I prefer visibility of what props are being passed to a component.

It's important to note that this type of component organisation is a personal preference, as it simply works for me on my projects. Some React developers enforce this architecture [because of this article by Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) who has since changed his opinion (which in turn triggered arguments against this architecture). I still use this architecture because I find it natural, but don't consider this the only way of component organisation as some might argue.

### Testing Strategy
This solution currently consists of mainly unit tests. The testing strategy that I employ here is to test the services (Messages, Storage & API) in isolation where the underlying services are mocked in order to test certain conditions. However for the handlers, the only component that I mock is `faker`. This way the unit test allows the logic to pass all the way through to the source of the data in order to test the full system. Otherwise, in the handlers, no service such as the `Messages` or `API` service is mocked.

In terms of frontend tests, I'm also using **jest** for testing the main `Popup` component. Due to time constraints, I written unit tests for the isolated components.

### Styling
I used tailwind for styling as it provides with a great CSS framework that allows me to have a visually appealling with very little effort. Simply setting up tailwind and adding the classes that I need. Another reason that I used tailwind is because it's mentioned in the exercise specification.

Otherwise, my personal preference would have been to use a CSS-in-JS based solution. This would have eaten time for setup however.

While I like tailwind's simplicity and ease of setup, the disadvantage of tailwind is the long list of CSS classes and it's not as great in terms of extendability when compared to CSS-in-JS styling frameworks.

### Build System
I used vite for the bundling and build system. Mainly for it's ease of use and quick setup. However, it's my preference over webpack due to the fact that vite uses rollup under the hood, which provides better tree-shaking capability and a smaller bundle size. Additionally, Vite’s faster HMR (Hot Module Replacement) is better for productivity.
