Rule 30
======

A JavaScript and canvas implementation of Stephen Wolfram's elementary cellular automata according to Rule  30 as described [http://mathworld.wolfram.com/Rule30.html](here).

The page is responsive to window size and will modify the canvas size to fit your screen when you start the automaton. Canvas size is always twice as wide as it is high to prevent the automaton from being cut off at the bottom.

You may download the image produced by clicking the download button once rendering completes. For more information, click the question mark button.

###Run Locally

To run this project locally all you need is a modern browser. Just use the "Download ZIP" button on the right to download the source as a compressed folder. Un-zip the folder, and simply open the index.php file in your browser.

###Potential Improvements:

While a majority of the CSS and JS files included in the vendor folder are minified, they do contain lots of styles and scripts that go unused in the ECA implementation. These could be removed and the remaining files combined. For all intents and purposes though, it's fine as it is.

Looping through raw image data for the canvas and rendering it row by row isn't a hasty process. One change I've already made is to only paint the "live" cells (black ones) and just pass over the rest since having a white background takes care of that by default. Another efficiency implemented is using a lookup table to determine the state of a cell in its next generation instead (with an index formed by taking the three digit binary representation of a cell's state and its neighbors) instead of nested if statements. 

Since the point of the demonstration is to show the evolution of a CA, I've decided to render the image pixels row-by-row. Modifying the code to render several rows at a time and calling the 'putImageData' on the canvas context less often would be a noticeable  boost in performance.

There may be performance to be found by simply using a language that makes swapping pointers more explicit between the buffers used to store the current generation of automaton and the next generation. 
