spritzify
=========

Easy to use Javascript Spritz style reader extension for Google Chrome. I plan to make this an extension for other browsers as well. To build and get a demo of spritzify follow the build instructions below.

### Build
make sure you have [nodejs](http://nodejs.org/) and [grunt CLI](http://gruntjs.com/getting-started) installed before doing the commands below in terminal.

    git clone https://github.com/andrewmilson/shifty-spritz.git
    cd shifty-spritz/
    npm install
    cd chrome/
    grunt build

Then in Google Chrome head over to tools > extensions. Click the button at the top that says "Load unpacked extension". Locate the build directory inside shifty-spritz/chrome/ and press select. After you have done that its just a matter of loading a webpage and doubble tapping the SHIFT key on some selected text and watching the magic appear in front of you.

Please feel free to contribute to the project as 2 brains are better than one.
