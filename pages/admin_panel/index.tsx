import { useAuthContext } from "@/app/context/AuthContext";
import { postRequest, baseUrl } from "@/utils/services";
import router from "next/router";
import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAdmin } = useAuthContext();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(e);
  };

  const login = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await postRequest(`${baseUrl}/admin_panel_login`, { username, password });

    if (response.error) {
      alert("Username o password errati");
    } else {
      setAdmin(true);
      router.push("/admin_panel/actions");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800">
      <div className="p-10 rounded-2xl shadow-2xl w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md border border-white/10 animate-fade-in">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Pannello Admin</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-5">
            <label className="block text-white mb-1 font-medium">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Inserisci username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Inserisci password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
