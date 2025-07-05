# Frontend Voice Integration Test Guide

## 🎤 Voice Button Testing Instructions

### Prerequisites
1. ✅ Backend server running with voice dependencies installed
2. ✅ Frontend development server running (`npm run dev`)
3. ✅ User authenticated and logged in
4. ✅ At least one document uploaded to enable chat

### Voice Button Location
The voice button appears **between the text input and send button** in the chat interface:

```
[Text Input Field] [🎤 Voice Button] [📤 Send Button] [➕ New Chat]
```

### Voice Button States Visual Test

#### 1. Initial State (Idle)
- **Expected**: Gray microphone icon (🎤)
- **Tooltip**: "Click to record voice message"
- **Action**: Click to start recording

#### 2. Recording State
- **Expected**: Red background with square stop icon (⏹️)
- **Visual**: Red pulsing dot indicator above button
- **Timer**: Shows recording time (e.g., "0:05")
- **Countdown**: Shows remaining time (e.g., "295s left")
- **Action**: Click to stop recording

#### 3. Processing State
- **Expected**: Yellow background with spinning loader (⏳)
- **Tooltip**: "Processing voice message..."
- **Behavior**: Button disabled during processing

#### 4. Error State
- **Expected**: Dark red background with X icon (🚫)
- **Error Message**: Appears above button with dismiss option
- **Action**: Click dismiss to return to idle state

#### 5. Disabled State
- **Expected**: Gray background with disabled microphone
- **Reasons**: 
  - No chat session active
  - Microphone permission denied
  - Not authenticated

### Step-by-Step Test Process

#### Test 1: Microphone Permission
1. Open the chat page
2. Look for the voice button
3. Click the voice button
4. **Expected**: Browser asks for microphone permission
5. **Action**: Grant permission
6. **Result**: Button should become active (gray microphone icon)

#### Test 2: Voice Recording
1. Click the voice button
2. **Expected**: Button turns red, timer starts
3. **Action**: Speak clearly for 3-5 seconds
4. **Expected**: Timer shows recording time
5. Click the red button to stop
6. **Expected**: Button turns yellow (processing)

#### Test 3: Voice Message Processing
1. After recording and stopping
2. **Expected**: Button shows yellow processing state
3. **Expected**: Processing takes 1-10 seconds depending on audio length
4. **Expected**: Your spoken words appear as a user message in chat
5. **Expected**: AI responds to your voice message

#### Test 4: Error Handling
1. Click voice button but don't speak
2. Wait for processing
3. **Expected**: Error message "No speech detected"
4. **Action**: Click dismiss on error message
5. **Expected**: Button returns to idle state

### Browser Compatibility

#### Chrome (Recommended)
- ✅ Full voice recording support
- ✅ Audio permission management
- ✅ WebM audio format support

#### Safari
- ✅ Voice recording support
- ⚠️ May require HTTPS for microphone access
- ✅ Audio permission management

#### Firefox
- ✅ Voice recording support
- ✅ Audio permission management
- ✅ WebM/WAV audio format support

### Troubleshooting

#### "Voice button not visible"
- **Check**: Console for JavaScript errors
- **Check**: Authentication status
- **Check**: VoiceButton component import in ChatWindow.tsx
- **Fix**: Refresh page and check network tab

#### "Microphone access denied"
- **Chrome**: `chrome://settings/content/microphone`
- **Safari**: Safari > Preferences > Websites > Microphone
- **Firefox**: `about:preferences#privacy` → Permissions

#### "No speech detected"
- **Check**: Microphone is working (test in other apps)
- **Try**: Speaking louder and clearer
- **Try**: Recording for longer duration (5+ seconds)
- **Check**: Background noise levels

#### "Processing timeout"
- **Check**: Backend server is running
- **Check**: Network connectivity
- **Try**: Shorter recordings (under 1 minute)
- **Check**: Server logs for errors

#### "Button stays in processing state"
- **Check**: Browser console for errors
- **Check**: Network tab for failed requests
- **Action**: Refresh page and try again

### Technical Verification

#### Console Checks
Open browser developer tools and look for:
- ✅ No JavaScript errors
- ✅ VoiceButton component renders
- ✅ MediaRecorder API available
- ✅ Voice endpoints respond with 200 status

#### Network Tab Verification
When using voice button, check for:
1. `POST /voice/transcribe` - Audio upload and transcription
2. `POST /chat/{chat_id}/message` - Sending transcribed message
3. Both requests should return 200 status

#### Authentication Check
```javascript
// In browser console:
console.log('Token:', sessionStorage.getItem('token'));
console.log('Chat ID:', /* check if currentChatSessionId is set */);
```

### Performance Expectations

#### Recording Performance
- ✅ Immediate response when clicking microphone
- ✅ Real-time timer updates during recording
- ✅ Smooth state transitions

#### Processing Performance
- **Short audio (5-10s)**: 1-3 seconds processing
- **Medium audio (30s)**: 3-8 seconds processing  
- **Long audio (60s+)**: 8-15 seconds processing

#### Audio Quality
- **Minimum**: Clear speech in quiet environment
- **Optimal**: 16kHz sample rate, mono audio
- **Format**: WebM (preferred), WAV, or MP3 fallback

---

## ✅ Success Criteria

### Functional Requirements
- [ ] Voice button appears in chat interface
- [ ] Microphone permission requested and granted
- [ ] Recording state visual feedback works
- [ ] Audio recording captures voice input
- [ ] Processing state shows during transcription
- [ ] Transcribed text appears as user message
- [ ] AI responds to voice-generated messages
- [ ] Error states handle gracefully

### User Experience Requirements
- [ ] Intuitive button placement and design
- [ ] Clear visual feedback for all states
- [ ] Responsive interaction (no delays)
- [ ] Accessible tooltips and error messages
- [ ] Consistent with existing chat UI

### Security Requirements
- [ ] Audio files not stored locally or on server
- [ ] Requires authentication for voice features
- [ ] Proper error handling for security issues
- [ ] HTTPS compatibility for production

---

## 🎉 Integration Complete!

If all tests pass, your voice chat integration is working perfectly! Users can now seamlessly switch between typing and speaking to interact with QueryAmie while maintaining full privacy and security. 