[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_fPcJsOm)
# CSC313-Stock-Dashboard

Implement a "reactive" stock dashboard using React/JSX and Server Side Events

You've had some experience already with a very basic form of this, a simple SSE server that sends timestamps and JSX that shows a constantly updating display.

This is a little more complex.

The server sends randomized data for four stocks using JSON:

Example: {"ticker": "AMZN", "name": "Amazon", "price": 356, "volume": 3500}

The four ticker symbols are configured in a JSON configuration file used by the node server: AMZN, IBM, DOW, NASDAQ

The randomization of data is still a bit of a work in progress. But it works reasonably well. Future updates may be released with better randomization. The volumes drop to zero over time.

Here is a very simple sample of the output (with no detailed CSS work done, I'm sure you can do better!)

<img width="681" height="274" alt="2025-11-30 19_26_42-Greenshot" src="https://github.com/user-attachments/assets/325cfd93-71e5-4665-96fe-20f413749f0f" />

That's a table that automatically updates when data comes in from the server. Remember that SSE means that the server initiates the updates. There is live React data for the four fields in JSON sent by the server, and a sparkline (see D3) that redraws with each event.

A couple of hints:
1) The React/JSX part of this is a *lot* simpler once you realize that the state variable can be a JSON object.
For example [appleData, setApple] = setState({ticker: "AAPL", name: "Apple Corporation", price: 0, volume: 0});
2) When you receive an event, you need to decide which stock it is, call its setState function, and update the sparkline.
3) Javascript doesn't have a fixed length queue to hold price values, but it's a very simple class to build. I set the size to 500.
4) My JSX creates a table that has five columns, the last one contains a DIV with a unique ID that's used to hold the Sparkline
5) You need to delete the old sparkline before drawing a new one, otherwise you get sparklines marking across the page. Cute, but not what I wanted.

The sparklines will look better when I fix the server's randomization process.

It took me an afternoon, with copious references to Stackoverflow and D3 documentation. Just Google. I prefer to make my own mistakes, not debug an AI's idea of what I should be doing.

The repository contains the node server and configuration file for the server (must be in the same directory). Note the port to use is defined in the configuration file. Currently set to 31415. It also contains the sample client code that was posted in Brightspace.
