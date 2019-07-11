# TracerBench: Noise Mitigation Techniques

As a general rule of thumb to "zero-out" your environment its recommended you close/exit:

- all running applications other than those strictly needed to run a test, (osx menu bar & dock)
- software updates, file syncing, browser-tabs, (osx spotlight & notification: do not disturb "on" )
- when manually running tests and _not_ using the default headless chrome. be sure to exit all browser extensions

### Background Daemons
Daemons are processes that run continuously in the background performing functions required by other processes. It's not explicitly necessary to kill all running daemons - just the ones consuming large amounts of resources and those that are likely to run a spike process for example OSX updater or Chrome updater.

Some common running daemons such as Dropbox, Google, Adobe, Backblaze, Carbonite, CrashPlan more than likely should be exited before running a trace. 

To quickly scan your environment for running processes run in a terminal window:
```sh
ps -eo pcpu,pid,user,args | sort -k 1 -r -n | head
```

Then kill the process in question by finding the process-id from the previous command and run in a terminal window:
```sh
kill -2 <PROCESS-ID>
```

## OSX
### Disable Spotlight
In more recent versions of OSX you cannot disable spotlight without first disabling system integrity protection. This operation comes with risks, please read-up before continuing.

To disable/enable system integrity protection:
```
- "Restart" your mac while you hold "Command + R"
- Once you enter recovery mode select "Utilities > Terminal"
- To disable "csrutil disable"
- To enable "csrutil enable"
- "Restart" your mac again
```

Once that's complete, time to disable/enable spotlight from indexing (which is very noisy).
```
- From a terminal window
- To disable "sudo launchctl unload -w /System/Library/LaunchDaemons/com.apple.metadata.mds.plist"
- To enable "sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.metadata.mds.plist"
```

## RHEL 7
### Script to stop/start the following jobs
For example: saving this script to something like `~/clean.sh` and running `chmod a+x clean.sh` and then running tracerbench commands eg `./clean.sh tracerbench compare`.

```sh
#!/usr/bin/bash

sudo service yum-cron stop
sudo service cfengine3 stop
sudo service osad stop
sudo service rhnsd stop

# execute the arguments as a command
$*

sudo service yum-cron start
sudo service cfengine3 start
sudo service osad start
sudo service rhnsd start
```
