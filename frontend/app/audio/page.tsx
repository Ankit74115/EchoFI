import AudioProcessing from "../../components/AudioProcessing"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Voice Recorder</h1>
        <AudioProcessing />
      </div>
    </div>
  )
}
