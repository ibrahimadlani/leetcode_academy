"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";

export default function TestFirebasePage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Test 1: Écrire un document
  const testWrite = async () => {
    setLoading(true);
    setStatus("Tentative d'écriture dans Firestore...");
    try {
      const docRef = await addDoc(collection(db, "test_collection"), {
        message: "Test d'écriture depuis l'application",
        timestamp: serverTimestamp(),
        userId: session?.user?.email || "anonymous",
      });
      setStatus(`✅ Succès ! Document créé avec l'ID: ${docRef.id}`);
    } catch (error) {
      setStatus(`❌ Erreur: ${error.message}`);
      console.error("Erreur d'écriture:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Lire les documents
  const testRead = async () => {
    setLoading(true);
    setStatus("Lecture des documents depuis Firestore...");
    try {
      const querySnapshot = await getDocs(collection(db, "test_collection"));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docs);
      setStatus(`✅ ${docs.length} document(s) trouvé(s)`);
    } catch (error) {
      setStatus(`❌ Erreur de lecture: ${error.message}`);
      console.error("Erreur de lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Supprimer tous les documents de test
  const cleanupTests = async () => {
    setLoading(true);
    setStatus("Suppression des documents de test...");
    try {
      const querySnapshot = await getDocs(collection(db, "test_collection"));
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, "test_collection", document.id)));
      });
      await Promise.all(deletePromises);
      setDocuments([]);
      setStatus(`✅ ${deletePromises.length} document(s) supprimé(s)`);
    } catch (error) {
      setStatus(`❌ Erreur de suppression: ${error.message}`);
      console.error("Erreur de suppression:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Firebase Firestore</h1>

        {/* Statut de connexion */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Statut de connexion</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Utilisateur connecté:</span>{" "}
              {session?.user?.email || "Non connecté"}
            </p>
            <p>
              <span className="font-medium">Firebase configuré:</span>{" "}
              <span className="text-green-600">✓ Oui</span>
            </p>
          </div>
        </div>

        {/* Boutons de test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests Firestore</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testWrite}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              1. Tester l'écriture
            </button>
            <button
              onClick={testRead}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              2. Tester la lecture
            </button>
            <button
              onClick={cleanupTests}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              3. Nettoyer les tests
            </button>
          </div>
        </div>

        {/* Statut */}
        {status && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Résultat</h2>
            <p className="text-lg">{status}</p>
          </div>
        )}

        {/* Documents trouvés */}
        {documents.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Documents trouvés</h2>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded p-4 bg-gray-50">
                  <p className="font-mono text-sm text-gray-600 mb-2">ID: {doc.id}</p>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(
                      {
                        ...doc,
                        timestamp: doc.timestamp?.toDate?.()?.toLocaleString() || "N/A",
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Cliquez sur "Tester l'écriture" pour créer un document dans Firestore</li>
            <li>Cliquez sur "Tester la lecture" pour lire les documents</li>
            <li>Vérifiez dans la Console Firebase que les documents apparaissent</li>
            <li>Cliquez sur "Nettoyer les tests" pour supprimer les documents de test</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
