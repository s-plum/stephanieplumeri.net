#stephanieplumeri.net

> Lack of version control makes me anxious.

##About this site

Four score and 7 years ago (minus the four score), I brought forth the first version of stephanieplumeri.net. What started with table layouts and (forgive me, web gods) a flash-based splash page evolved into a lean, mean, responsive web-portfolio'n machine. This is the ninth and by no means final iteration of my portfolio site.

Those who frequent this site (so, my mom and I) may notice that it looks almost exactly the same as its predecessor. The difference is all behind the scenes, in style, script, and image optimization. 

The ninth ~~doctor~~ stephanieplumeri.net introduces:

*Local build process powered by [gulp.js](http://gulpjs.com/)
*[EJS](http://www.embeddedjs.com/) templating
*Image minification
*Javascript concatenation/minification from [UglifyJS](https://github.com/mishoo/UglifyJS) ([gulp flavor](https://github.com/terinjokes/gulp-uglify/))
*[Autoprefixer](https://github.com/postcss/autoprefixer) ([gulp flavor](https://www.npmjs.org/package/gulp-autoprefixer))
*[Ender.js Jeesh](https://github.com/ender-js/jeesh) in place of jQuery

The end result of all of these new toys put the site on a major browser diet:

|                     | Load Time (seconds)     | Requests     | KB       | CSS (bytes)     | JS (bytes)     | Images (bytes) |
| ------------------- | ----------------------- | ------------ | -------- | --------------- | -------------- | -------------- |
| Home (old)          | 1.875  				    | 18	       | 267      | 21688	        | 66963          | 116709         |
| Home (new)          | 1.577                   | 12           | 166      | 12605           | 29922          | 108053         |
| **% change**        | **-16%**                | **-33%**     | **-38%** | **-42%**        | **-55%**       | **-7%**        |

|                     | Load Time (seconds)     | Requests     | KB       | CSS (bytes)     | JS (bytes)     | Images (bytes) |
| ------------------- | ----------------------- | ------------ | -------- | --------------- | -------------- | -------------- |
| About (old)         | 2.17  				    | 16	       | 236      | 21688	        | 68104          | 116709         |
| About (new)         | 1.125                   | 10           | 149      | 11114           | 29922          | 108053         |
| **% change**        | **-16%**                | **-21%**     | **-26%** | **-40%**        | **-56%**       | **-7%**        |

*stats from webpagetest.org*

##Pretend you're me

If you feel like tinkering around with my site and/or development setup, sync the repo, navigate to the root folder in your favorite command line tool, and run

```
npm install
```

to install dependencies. Note that this install assumes that your local machine is already set up with [Sass](http://sass-lang.com/) (3.4.5) and [Compass](http://compass-style.org/) (version 1.0.0.alpha.19 - alpha is required in order to enable source maps). Once everything is installed, you can run 

```
gulp
```

from the root folder. This spins up a local instance of the site, complete with file watching, Sass compilation, script bundling, image optimization, free ice cream, live reload (with the LiveReload extension), and more. When everything is running, you should be able to view the site at http://localhost:4242/.