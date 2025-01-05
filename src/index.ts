import {googleMeetCaptionsClassName} from './constant';
import mutationCallback from './mutation-callback';

/**
 * Type definition for the captions receiver function.
 */
export interface Captions {
    session: string;
    activeSpeaker: string;
    talkContent: string;
}
export type captionsReceiver = (v: Captions) => void;
/**
 * Type definition for the GetCaptionsInterface function.
 * @typedef {Function} GetCaptionsInterface
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
type GetCaptionsInterface = (cls: string, receiver: captionsReceiver) => void;

/**
 * Waits for the target element to be available and starts observing it for mutations.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
const waitForObserving = (receiver: captionsReceiver) => {
    const targetElement = document.querySelector(googleMeetCaptionsClassName);
    if (targetElement) {
        const observer = new MutationObserver(() => {
            console.log('mutation observed');
            mutationCallback(receiver);
        });
        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        setTimeout(() => {waitForObserving(receiver)}, 1000);
    }
}

/**
 * Type definition for the GetCaptionsInterface function.
 * @typedef {Function} GetCaptionsInterface
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
export const getCaptions : GetCaptionsInterface = (cls = googleMeetCaptionsClassName, receiver) => {
    const readyGetCaptions = () => {
        window.requestAnimationFrame(() => {
            if (document.readyState === 'complete') {
                console.log('document complete');
                waitForObserving(receiver);
            } else {
                readyGetCaptions()
            }
        })
    };

    readyGetCaptions();

}

export default getCaptions;
