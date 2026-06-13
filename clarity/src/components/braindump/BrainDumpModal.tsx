import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, Zap } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useBrainDump } from '@/hooks/useBrainDump'
import { useAppStore } from '@/store/appStore'

interface BrainDumpModalProps {
  open: boolean
  onClose: () => void
}

export function BrainDumpModal({ open, onClose }: BrainDumpModalProps) {
  const { dump } = useBrainDump()
  const { showToast } = useAppStore()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (open && textRef.current) {
      setTimeout(() => textRef.current?.focus(), 100)
    }
  }, [open])

  const handleDump = async () => {
    if (!text.trim()) return
    setLoading(true)
    await dump(text.trim())
    setLoading(false)
    setText('')
    showToast('Thought captured! Check your Inbox to sort it.', 'success')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleDump()
    }
  }

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      showToast('Voice input not supported in this browser', 'error')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setText(prev => prev ? `${prev} ${transcript}` : transcript)
      setListening(false)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <Modal open={open} onClose={onClose} title="Brain Dump" size="md">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-500">
          <Zap className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />
          <span>Just dump it. Don't organise. You'll sort it later from your Inbox.</span>
        </div>

        <div className="relative">
          <textarea
            ref={textRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind? Let it all out..."
            rows={6}
            className="input-base resize-none text-base leading-relaxed"
          />
          <button
            onClick={toggleVoice}
            className={`absolute bottom-3 right-3 p-2 rounded-xl transition-colors ${
              listening
                ? 'bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            aria-label={listening ? 'Stop recording' : 'Start voice input'}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {listening && (
          <p className="text-xs text-red-500 text-center animate-pulse">Listening… speak now</p>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleDump}
            loading={loading}
            disabled={!text.trim()}
            className="flex-1"
          >
            <Send className="w-4 h-4" />
            Dump it
          </Button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Tip: ⌘+Enter to save quickly
        </p>
      </div>
    </Modal>
  )
}
