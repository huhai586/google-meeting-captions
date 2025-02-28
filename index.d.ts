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
export const getCaptionsContainer: () => HTMLElement | null;
/**
 * Type definition for the GetCaptionsInterface function.
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
export const getCaptions: GetCaptionsInterface;
export default getCaptions;

//# sourceMappingURL=index.d.ts.map
