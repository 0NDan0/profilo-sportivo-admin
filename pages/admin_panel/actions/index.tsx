import Button from '@/app/components/shared/Button'
import { useAdminContext } from '@/app/context/AdminContext'
import { useAuthContext } from '@/app/context/AuthContext'
import { getRequest, baseUrl, putRequest } from '@/utils/services'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type AssistanceRequest = {
  contactMethod: string;
  createdAt: Date;
  email: string;
  message: string;
  name: string;
  surname: string;
  _id: string;
}

const AdminPanel = () => {
  const { admin, setAdmin } = useAuthContext()
  const { deletePost, getReportedPosts, reportedPosts } = useAdminContext()
  const router = useRouter()
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([])
  const [view, setView] = useState<'none' | 'assistance' | 'reports'>('none')

  const getAssistanceRequests = async () => {
    try {
      const response = await getRequest(`${baseUrl}/assistanceRequest/get`)
      if (response) {
        setAssistanceRequests(response)
        setView('assistance')
      }
    } catch (error) {
      console.error("Errore nella richiesta GET:", error)
    }
  }

  const handleCompleteRequest = async (requestId: string) => {
    try {
      console.log("ID richiesta:", requestId)
         const response = await putRequest(`${baseUrl}/assistanceRequest/delete`, {id: requestId})
        if (response) {
            setAssistanceRequests(prevRequests => prevRequests.filter(req => req._id !== requestId))
            alert("Richiesta completata con successo")
        }
    }
    catch (error) {
        console.error("Errore nella richiesta PUT:", error)
    }
    }


  const loadReportedPosts = async () => {
    await getReportedPosts()
    setView('reports')
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">ADMIN PANEL - PROFILO SPORTIVO</h1>
        <p className="text-red-400 text-xl mb-6">Accesso non autorizzato</p>
        <button
          onClick={() => router.push("/admin_panel")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Vai al login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 px-6">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-blue-700 text-white py-4 shadow-md text-center text-2xl font-bold z-30">
        ADMIN PANEL - PROFILO SPORTIVO
      </header>

      {/* Selezione visualizzazione */}
   <div className="flex flex-wrap justify-center mt-10 gap-4">
  <button
    onClick={loadReportedPosts}
    className={`px-6 py-3 rounded text-lg transition ${
      view === 'reports' ? 'bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'
    }`}
  >
    Post Segnalati
  </button>
  <button
    onClick={getAssistanceRequests}
    className={`px-6 py-3 rounded text-lg transition ${
      view === 'assistance' ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'
    }`}
  >
    Richieste Assistenza
  </button>
  <button
    onClick={() => setAdmin(false)}
    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-lg"
  >
    Logout
  </button>
</div>

      {view === 'reports' && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">Post Segnalati</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportedPosts.map(post => (
              <div key={post._id} className="bg-gray-800 rounded p-5 shadow-md">
                <video controls muted className="w-full rounded mb-3" src={post.videoUrl} />
                <p className="mb-2 text-sm text-gray-400">ID: {post._id}</p>
                <p className="mb-2"><strong>Descrizione:</strong> {post.description}</p>
                <button
                  onClick={() => deletePost(post._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded mt-2 w-full"
                >
                  Elimina post
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button onClick={() => setView('none')} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded">
              Torna alla selezione
            </button>
          </div>
        </div>
      )}

      {view === 'assistance' && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">Richieste di Assistenza</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistanceRequests.map(req => (
              <div key={req._id} className="bg-gray-800 rounded p-5 shadow-md space-y-2">
                <p><strong>Nome:</strong> {req.name} {req.surname}</p>
                <p><strong>Email:</strong> {req.email}</p>
                <p><strong>Contatto:</strong> {req.contactMethod}</p>
                <p><strong>Messaggio:</strong> {req.message}</p>
                <p className="text-xs text-gray-400"><strong>Data:</strong> {new Date(req.createdAt).toLocaleString()}</p>
                <Button className="mx-auto"  onClick={() => handleCompleteRequest(req._id)}>Risolvi</Button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button onClick={() => setView('none')} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded">
              Torna alla selezione
            </button>
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  )
}

export default AdminPanel
