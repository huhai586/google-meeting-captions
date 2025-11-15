import {captionsReceiver, getCaptionsContainer} from "./index";
import debounce from './debounce';

const getAllCaptionDivs = () => {
    const container = getCaptionsContainer();
    if (!container) return [];
    return Array.from(container.childNodes);
};

const extractCaptionInfo = (div: ChildNode) => {
    if (!div.childNodes || div.childNodes.length < 2) {
        return { speaker: '', content: '' };
    }
    
    const speakerNode = div.childNodes[0];
    const contentNode = div.childNodes[1];
    
    if (!(speakerNode instanceof HTMLElement) || !(contentNode instanceof HTMLElement)) {
        return { speaker: '', content: '' };
    }

    return {
        speaker: speakerNode.textContent || '',
        content: contentNode.textContent || ''
    };
};

interface SpeakerSession {
    sessionId: string;
    lastContent: string;
    divElement: ChildNode;
}

let speakerSessions: SpeakerSession[] = [];

const getOrCreateSession = (div: ChildNode, speaker: string, content: string): string => {
    // Try to find existing session for this div
    const existingSession = speakerSessions.find(session => session.divElement === div);
    
    if (existingSession) {
        // Update existing session's content
        existingSession.lastContent = content;
        return existingSession.sessionId;
    }
    
    // Create new session
    const newSession = {
        sessionId: String(new Date().getTime()),
        lastContent: content,
        divElement: div
    };
    
    speakerSessions.push(newSession);
    console.log('create new session', { speaker, content });
    
    // Clean up old sessions that are no longer in the DOM
    const container = getCaptionsContainer();
    if (container) {
        speakerSessions = speakerSessions.filter(session => 
            container.contains(session.divElement)
        );
    }
    
    return newSession.sessionId;
};

const mutationCallback = (receiver: captionsReceiver) => {
    const captionDivs = getAllCaptionDivs();
    
    captionDivs.forEach(div => {
        const { speaker, content } = extractCaptionInfo(div);
        
        if (!speaker || !content) {
            return;
        }

        const sessionId = getOrCreateSession(div, speaker, content);

        receiver({
            session: sessionId,
            activeSpeaker: speaker,
            talkContent: content
        });
    });
};

export default debounce(mutationCallback, 300);
