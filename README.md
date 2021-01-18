# GridSound [<img height="26" src="https://gridsound.com/social-images/twitter.png" title="twitter"/>](https://twitter.com/gridsound) [<img height="26" src="https://gridsound.com/social-images/facebook.png" title="facebook"/>](https://facebook.com/gridsound)

<img align="right" height="110" src="https://gridsound.com/assets/icon/black/128.png"/>

GridSound is a work-in-progress open-source digital audio workstation developed with HTML5 and more precisely with the new Web Audio API.
The application can be used at [gridsound.com/daw](https://gridsound.com/daw) it's also possible to create an account on [gridsound.com](http://gridsound.com) to save your compositions online to retrieve them from anywhere at any time.

**Some links :**
[**Help**](https://github.com/gridsound/daw/wiki/help) •
[**Changelog**](https://github.com/gridsound/daw/wiki/changelog) •
[**Previous versions**](https://github.com/gridsound/daw/wiki/versions)

Follow us on [**Twitter**](https://twitter.com/gridsound) or [**Facebook**](https://facebook.com/gridsound) to have the latest news related to the product.

###### screenshot of the 0.28.3 version
![screenshot](https://user-images.githubusercontent.com/850754/79024278-c20fc600-7b82-11ea-83b3-f2904b43967f.png)

## Contributing to the DAW
Look for issues under this Github Repository and find something you think you can start working on. We will be available to answer any questions.

## Quicklinks
* [Getting Started](#getting-started)
    * [Fork this repository](#fork-this-repository)
    * [Installing the DAW](#installing-the-daw)
* [Getting Help](#getting-help)

## Getting Started
### Fork this repository
In order to submit any code proposal to the codebase, you need to first fork the repository, and further, sending a Pull Request to this codebase.

### Installing the DAW
Follow the next steps:
1. Clone the forked project into your local machine
2. Run the following commands
```sh
# Install Git Submodules
$ ./build.sh dep
# Bundle the application into an `index.html` file
$ ./build.sh dev
```
3. Add the following assets mentioned [here](https://github.com/gridsound/daw/issues/62#issuecomment-662190893) into the `assets/samples` folder (Otherwise the DAW will not have sounds to reproduce)
4. Run the project with an HTTP server. As an example, you can use the python module SimpleHTTPServer
```sh
$ python -m SimpleHTTPServer 8000
```
5. Go to localhost:8000 and you should see the system up and running

## Getting Help
We have a [discord server](https://discord.gg/NUYxHAg). Feel free to join us if you want to contribute and have any questions
