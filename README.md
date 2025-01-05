How to use

import {getCaptions} from 'google-meeting-captions-resolver';

interface Captions {
    session: string;
    activeSpeaker: string;
    talkContent: string;
}

getCaptions(cls = "custom captions container").then(captions => {
  console.log(captions); //
});
```
