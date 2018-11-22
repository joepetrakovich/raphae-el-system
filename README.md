# raphae-el-system
An L-system renderer using RaphaelJS.

This library can be used to build and draw L-systems.

See the Wikipedia entry if you aren't sure what an L-system is:
http://en.wikipedia.org/wiki/L-system

See the demo code for example setup.

Play with an [old live demo here](https://joe.ptrkv.ch/things/raphae-el-system-demo/). (Desktop only).

If you wanted to render the fractal plant (Example 7) on Wikipedia:
<br/>

Example 7: Fractal plant<br/>
variables : X F<br/>
constants : + − [ ]<br/>
start  : X<br/>
rules  : (X → F-[[X]+X]+F[+FX]-X), (F → FF)<br/>
angle  : 25°<br/>

You would first construct the L-system like:

```javascript
var axiom = 'X';
var n = 6;
var angle = 25;
				
lsystem = new Lsystem(axiom, n, angle);
lsystem.addProduction('X', 'F-[[X]+X]+F[+FX]-X', 1);
lsystem.addProduction('F', 'FF', 1);
```

Next, create a library object instance and call the required methods below to setup and draw.
Initial parameters involve specifying the drawing surface, starting point, angle, line length,
and animation speed.

```javascript
var raphaelSystem = new RaphaeElSystem();

raphaelSystem
    .configurePaper("canvas-container", 300, 300, 90, 10)
    .setLSystem(lsystem)
    .draw(true, 50);
```

