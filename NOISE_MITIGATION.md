# TracerBench: Noise Mitigation Techniques

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
