# raphae-el-system
An L-system renderer using RaphaelJS.

This library can be used to build and draw L-systems.

See the Wikipedia entry if you aren't sure what an L-system is:
http://en.wikipedia.org/wiki/L-system

See the demo code for example setup.

If you wanted to render the fractal plant (Example 7) on Wikipedia:

Example 7: Fractal plant
variables : X F
constants : + − [ ]
start  : X
rules  : (X → F-[[X]+X]+F[+FX]-X), (F → FF)
angle  : 25°

You would first construct the L-system like:

var axiom = 'X';
var n = 6;
var angle = 25;
				
lsystem = new Lsystem(axiom, n, angle);
lsystem.addProduction('X', 'F-[[X]+X]+F[+FX]-X', 1);
lsystem.addProduction('F', 'FF', 1);

Next, create a library object instance and pass a DOM element ID
that is large enough to hold the drawing, the lsystem, the length of line segments in pixels,
and a boolean representing whether or not to animate the rendering.

var r = new RaphaeElSystem();
r.draw("canvas-container", lsystem, 3, true); //3 is the length of line segments in px.

Again, see the demo for specifics as these instructions may be out of sync.
