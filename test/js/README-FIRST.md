# TATS (Tola Activity Test Suite) Status
NOTE: Wed May 23 12:41:56 PDT 2018

This functional test project is being put on hold to focus development
effort on unit tests. The TolaActivity UI is undergoing active, heavy 
development, which makes it impractical to try to write new functional tests 
and keep the existing ones working at this time. This note should orient
whoever might resume this project in the future. The bulk of the pending
tests focus on the IPTT reports, but I had multiple efforts going
forward at once. If/when this project resumes, I recommend proceeding
as follows:

1. Repair tests broken by all the UI changes since 23 May 2018
1. Implement the rest of the IPTT report tests
1. Refactor the pre-ES6 bits into ES6

Pending the explicity refactoring, I also recommend that new page objects 
and new tests be written in ES6 syntax and using proper JavaScript classes.
