"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Github, Linkedin, RotateCcw, Twitter, User } from "lucide-react"
import toast from "react-hot-toast";

// Simple tokenizer simulation - in reality this would use a proper tokenizer
const createSimpleTokenizer = () => {
  const vocabulary = new Map<string, number>()
  const reverseVocab = new Map<number, string>()

  // Common tokens
  const commonTokens = [
    "Hello",
    "world",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "Price",
    ":",
    "199",
    ".",
    "99",
    "INR",
    "Chai",
    "Coffee",
    "Let",
    "'s",
    "tokenize",
    "this",
    "text",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "can",
    "may",
    "might",
    "must",
    "shall",
    "ought",
    " ",
    "\n",
    "\t",
    "!",
    "?",
    ",",
    ";",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    '"',
    "'",
    "-",
    "_",
    "+",
    "=",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ]

  commonTokens.forEach((token, index) => {
    vocabulary.set(token, index)
    reverseVocab.set(index, token)
  })

  return { vocabulary, reverseVocab }
}

const { vocabulary, reverseVocab } = createSimpleTokenizer()

const tokenizeText = (text: string) => {
  const tokens: string[] = []
  const tokenIds: number[] = []

  let i = 0
  while (i < text.length) {
    let found = false

    // Try to find the longest matching token
    for (let len = Math.min(20, text.length - i); len > 0; len--) {
      const substr = text.substring(i, i + len)
      if (vocabulary.has(substr)) {
        tokens.push(substr)
        tokenIds.push(vocabulary.get(substr)!)
        i += len
        found = true
        break
      }
    }

    if (!found) {
      // If no token found, treat as unknown character
      const char = text[i]
      tokens.push(char)
      tokenIds.push(vocabulary.size + char.charCodeAt(0)) // Use char code as fallback ID
      i++
    }
  }

  return { tokens, tokenIds }
}

const decodeTokens = (tokenIds: number[]) => {
  return tokenIds
    .map((id) => {
      if (reverseVocab.has(id)) {
        return reverseVocab.get(id)!
      }
      // Handle unknown tokens
      return String.fromCharCode(id - vocabulary.size)
    })
    .join("")
}

const getTokenColor = (token: string, index: number) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-red-100 text-red-800",
    "bg-orange-100 text-orange-800",
  ]

  if (token.match(/^\d+$/)) return "bg-cyan-100 text-cyan-800" // Numbers
  if (token.match(/^[.,:;!?()[\]{}'"]/)) return "bg-gray-100 text-gray-800" // Punctuation
  if (token === " " || token === "\n" || token === "\t") return "bg-slate-100 text-slate-800" // Whitespace

  return colors[index % colors.length]
}

export default function TokenizerPage() {
  const [inputText, setInputText] = useState("Hello, world! Chai > Coffee! Let's tokenize this. Price: 199.99 INR")
  const [tokens, setTokens] = useState<string[]>([])
  const [tokenIds, setTokenIds] = useState<number[]>([])
  const [decodeInput, setDecodeInput] = useState("")
  const [decodedText, setDecodedText] = useState("")

  useEffect(() => {
    const result = tokenizeText(inputText)
    setTokens(result.tokens)
    setTokenIds(result.tokenIds)
  }, [inputText])

  useEffect(() => {
    if (decodeInput.trim()) {
      try {
        const ids = decodeInput
          .split(",")
          .map((s) => Number.parseInt(s.trim()))
          .filter((n) => !isNaN(n))
        const decoded = decodeTokens(ids)
        setDecodedText(decoded)
      } catch (error) {
        setDecodedText("Invalid token IDs")
      }
    } else {
      setDecodedText("")
    }
  }, [decodeInput])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard.....')

  }

  const clearInput = () => {
    setInputText("")
  }

  const resetDecoder = () => {
    setDecodeInput("")
    setDecodedText("")
  }

  const handleDecodeInputChange = (value: string) => {
    // Auto-populate with current token IDs if empty and user starts typing
    if (decodeInput === "" && value && tokenIds.length > 0) {
      setDecodeInput(tokenIds.join(", "))
    } else {
      setDecodeInput(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-left py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="text-orange-600">Tokenizer Project</span> for Chai aur GenAI
            </h1>
            <p className="text-gray-600">
              Explore tokenization and its impact on AI models — sip your chai while you learn.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* GitHub */}
            <a href="https://github.com/ankushsingh8416?tab=repositories" className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/ankush8416/" className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md">
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">LinkedIn</span>
            </a>

            {/* Twitter */}
            <a href="https://x.com/AnkushRajp80867?t=I0PxUl2n7dSK09BllQX-3g&s=09" className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-sky-500 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md">
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Twitter</span>
            </a>

            {/* Portfolio */}
            <a href="https://portfolio-ankush-tech.netlify.app/" className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Portfolio</span>
            </a>
          </div>


        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Text Input */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-orange-600">📝</span> Text Input
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearInput}>
                Clear
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="min-h-32 resize-none"
              />
              <div className="text-sm text-gray-500">{inputText.length} characters</div>
            </CardContent>
          </Card>

          {/* Token Encoding */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-orange-600">🔢</span> Token Encoding ({tokens.length} IDs)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(tokenIds.join(", "))}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Token → ID Mapping:</div>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {tokens.map((token, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      "{token}" → {tokenIds[index]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Encoded Sequence:</div>
                <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">[{tokenIds.join(", ")}]</div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(tokenIds.join(", "))}>
                  Copy Encoded IDs
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Token Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-orange-600">🎨</span> Token Visualization ({tokens.length} tokens)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {tokens.map((token, index) => (
                <Badge
                  key={index}
                  className={`${getTokenColor(token, index)} font-mono text-sm px-2 py-1`}
                  title={`Token: "${token}" | ID: ${tokenIds[index]}`}
                >
                  {token === " " ? "␣" : token === "\n" ? "↵" : token === "\t" ? "⇥" : token}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 rounded"></div>
                Words
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-cyan-100 rounded"></div>
                Numbers
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                Punctuation
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-100 rounded"></div>
                Whitespace
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Decoding */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-orange-600">🔓</span> Token Decoding
            </CardTitle>
            <Button variant="outline" size="sm" onClick={resetDecoder}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Enter comma-separated IDs (e.g., 1, 2, 3):</label>
              <Input
                value={decodeInput}
                onChange={(e) => handleDecodeInputChange(e.target.value)}
                placeholder={`Try: ${tokenIds.slice(0, 5).join(", ")}...`}
                className="font-mono"
              />
            </div>

            {decodedText && (
              <div>
                <label className="text-sm font-medium mb-2 block">Decoded Text:</label>
                <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                  <span className="font-mono">{decodedText}</span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">Clean all learned tokens and resets the vocabulary</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
