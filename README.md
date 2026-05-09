# clock-timer
JS clock and timer apps with lots of bells and whistles

As a sub teacher I found it useful to have a clock and a timer on my
Chromebook. I had found good free ones online, but suddenly one day
the clock added ads, which needed to be clicked away before I could
use it. I looked for a replacement, but didn't find anything as 
good - so I wrote my own.
 
 And of course, onve I had it I needed to add bells and whistles (and
 smoke and mirrors). All the functions are built on the same base, so 
 some characteristics are common to all apps. These include things like

 - The font sizes itself to fill up the maximum space on the screen
 - Features like font (face, bold, italic), 12 or 24 hour clock, 
   color of text or background, and more can be set in a cascade from 
   app -> alarmset -> alarm
 - flashes the screen when alarm triggers or timer ends, and optionally 
   plays an audio
 - timer and alarms can optionally have a warning interval set so they change
   style when a selected amount of time remains before triggering
 - clock can be set for 24-hour (military) time or 12 hour (am-pm)
 - seconds can be displayed or not. In eaither case a seconds bar along the
   bottom of the screen tracks the progress of the current minute
 - configuration can be saved to local storage
 - alarm sets and alarms can be named to provide context to the display
 
 The functions supplied here include:
 - **clock.html**: a digital clock, on which can be set alarms or sets of
   alarms. If alarms are set it can optionally count down to the next alarm
 - **timer.html**: in timer mode counts down to 0 from a chosen time, in stopwatch
   mode starts at 0 and goes up
 - **ai-clock.html**: After I spent free time for a week working on this I decided
   to see how AI would do on it, so I opened up copilot and gave it a try. This is
   the result, after spending under 2 hours on it. It does not have all the features
   that clock.html does, but it took a lot less time, and while the code is not as
   flexible or reusable as mine it is simpler code to understand and 
   maintain/enhance. Included for interest
   
 Query arguments on starting up:
  - clock.html:
    - **?noread**: do not read the existing localstorage configuration
	- **?nocontext**: disable context menu (mainly for debugging)
	- **?up**: start clock in Up mode (regular clock) (default)
	- **?down: start clock in countdown mode, showing time to next alarm
	- **?curtis**: initialize Curtis Middle School class schedule alarm sets
	- **?set=XXX**: use alarm set XXX as the initial alarm set
  - timer.html:
    - **?noread**: do not read the existing localstorage configuration
	- **?nocontext**: disable context menu (mainly for debugging)
	- **?up**: start clock in Up mode (regular clock) (default)
	- **?down: start clock in countdown mode, showing time to next alarm
	- **?time=HH[:MM[:SS]]**: initialize the timer to HH:MM:SS
	- **?go**: starts the timer upon load
	- **nosleep**: Normally if the computer host goes to sleep the timer will also
		and no time will be registered until the machine wakes. If **nosleep** is set
		the timer will check whether timer has passed in between ticks and add in 
		the interval, so no time will be lost
		
