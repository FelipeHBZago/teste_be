"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth';

const Home = () => {
    const [musics, setMusics] = useState([]);
    const { user } = useAuth({ middleware: "guest" })

    useEffect(() => {
        axios('http://localhost:8000/get-musics')
            .then(data => {
                console.log("data:", data.data)
                setMusics(data.data)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    return (
        <main className='py-12'>
            <div className='text-end pr-3'>
                <Link className={`text-end px-3 py-3 ${user ? 'bg-green-400 text-white font-medium rounded-md hover:scale-[1.1] transition-all duration-150' : 'text-blue-300 underline'}`} href={user ? "/my-musics" : "/login"}>{user ? 'Minhas músicas' : 'Login'}</Link>
            </div>
            <h1 className='text-4xl text-center mb-8'>Cadastros</h1>
            <div className="flex justify-center">
                <table className="min-w-[80%] table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Usuário</th>
                            <th className="border border-gray-300 px-4 py-2">Música</th>
                            <th className="border border-gray-300 px-4 py-2">Nome do artista</th>
                            <th className="border border-gray-300 px-4 py-2">URL da Música</th>
                        </tr>
                    </thead>
                    <tbody>
                        {musics && musics.users && musics.users.length > 0 ? (
                            musics.users.map((music, index) => (
                                <tr key={index} className="bg-white border-b">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{music.user_name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{music.music_artist}</td>
                                    <td className="border border-gray-300 px-4 py-2">{music.music_artist}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <a href={music.music_url} className="text-blue-500 underline">
                                            {music.music_url}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">
                                    No records available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default Home
