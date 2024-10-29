# Website Title Fetcher Assignment

## Overview
This project implements a Node.js server to fetch and display titles of given websites. The task has been completed using different control flow strategies in Node.js.

## Task Completion

The project has been divided into several branches, each implementing the task with a different approach as specified:

1. **Plain Node.js Callbacks**  
   - Branch: [`feat/plain-callbacks`](https://github.com/abdullah-ch/caremerge/tree/feat/plain-callbacks)
   - This branch implements the task using plain callbacks in Node.js. The server uses basic asynchronous control with callbacks to fetch and parse website titles.

2. **Flow Library (Async.js)**  
   - Branch: [`feat/flow-lib`](https://github.com/abdullah-ch/caremerge/tree/feat/flow-lib)
   - This branch utilizes the `async.js` library to manage asynchronous control flow, specifically using `async.map` to handle multiple requests concurrently.

3. **Promises**  
   - Branch: [`feat/promises`](https://github.com/abdullah-ch/caremerge/tree/feat/promises)
   - This branch implements the solution using Promises, specifically the `Q` library, to handle asynchronous requests with a more structured promise-based approach.

4. **Streams (RxJS)**  
   - Branch: [`feat/streams`](https://github.com/abdullah-ch/caremerge/tree/feat/streams)
   - This branch uses RxJS to implement a reactive, stream-based solution, where each website request is handled as an observable stream, allowing for concurrent and error-tolerant processing of requests.
