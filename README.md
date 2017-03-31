# Screeps Tourney Site

Do you love automation? Programming? Competition? Of course you do! The Screeps Tourney is a coding competition based around [Screeps](https://screeps.com), "the world's first MMO strategy sandbox game for programmers."

This repository is for the website. This is where people go to submit their code and view results. For the processor, see [this repository](https://github.com/FlyingPiMonster/ScreepsTourney).

## Challenge Overview

Each challenge will consist of a Submission Period and a Processing Period. The Submission Period begins when the challenge is announced, and ends several weeks later. During this period, contestants may develop their code and upload it to the web interface. When the Submission Period ends, the Processing Period begins. The processor runs everybody's code, and the player who meets the winning condition of the challenge first (in the fewest ticks) wins.

The challenges are designed to cover various game mechanics and aspects of Screeps. For example, some are based on the market system, some are based on combat and others will be based on code optimization.

All code submissions are run autonomously--contestants may not modify code, memory, flags, etc. once the Processing Period begins.

## Technical Overview

The tourney software is in two parts: the processor and the web interface. The web interface is where people submit their code and view results and replays.

On the website, people can sign up for an account. Each account may only submit one entry per contest.

During the Submission Period, code can be uploaded either through the interface or from GitHub. Code may be reuploaded as long as the Submission Period has not ended. If code is submitted through GitHub, it will be downloaded when the submission period ends.

During the Processing Period, the progress of the contest will be displayed live on the website. This includes a view of every player's room and their console output. This data will also be saved and can be reviewed later.

When the contest is finished, results are automatically posted on the site. All past challenges, room histories, and results will be available on the site. In addition, players will be able to make their code public, in which case it will also be made available on the site.

The site will also contain a static portion that can be used for contest rules, TOS, etc.

## Technologies

The server will be made using ExpressJS. The website will use Material Design.
