# 🏃💨 SCRIPT RUNNER 🏃💨
## What is it? 
Script runner's job is to run all of the scripts for the upcoming version when the server starts.

## How To Use It
Write a script using the [Guidelines](https://github.com/CoronaTeamMOD/CoronaInvestigation/wiki/Writing-and-inserting-SQL-Scripts).
Upload your script to the upcoming scripts folder - currently 'index' (managed by common/SCRIPTS_DIRECTORY).  
**notice**: the script has to be a `.sql` file in order for the reader to read it  
Once the sprint is complete - move all of the scripts to the appropriate archive folder (instead of DB scripts!)

## Blacklisting
If you have a script that you'd only want to run once **and you have no way of preventing it from running again** like a script that takes a lot of time to run or could corrupt the DB if it'd run again _(please read the guidelines before writing the script)_ , you can affix it the blacklist **affixion**, currently managed at `commons/BLACKLIST_AFFIX.ts` - this action will cause the file to only run once and then add it to the global blacklist file (managed at `Logs/blacklist.txt`)
example : `BLK_run_only_once.sql will` only run once.