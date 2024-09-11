"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth';

const List = () => {
    const [musics, setMusics] = useState([]);
    const { user } = useAuth({ middleware: "guest" });
    const [otherMusics, setOthers] = useState([]);

    useEffect(() => {
        axios('http://localhost:8000/get-user-musics', { withCredentials: true })
            .then(data => {
                setOthers(data.data.otherMusics)
                setMusics(data.data.musics)
            })
            .catch(error => console.error('Error fetching data:', error));

    }, []);


    const handleMusicAction = async (trackId, action) => {
        try {
            const response = await axios.post('http://localhost:8000/link-song', {
                trackId,
                action
            });

            console.log('Resposta do servidor:', response.data);

            if (action === 'link') {

                const linkedMusic = otherMusics.find(music => music.id === trackId);
                setMusics([...musics, linkedMusic]);
                setOthers(otherMusics.filter(otherMusic => otherMusic.id !== trackId));

            } else if (action === 'unlink') {

                const unlinkedMusic = musics.find(music => music.id === trackId);
                setOthers([...otherMusics, unlinkedMusic]);
                setMusics(musics.filter(music => music.id !== trackId));
            }
        } catch (error) {
            console.log(error)
            alert('Erro ao processar ação');
        }
    };

    return (
        <main className='py-12'>
            <div className='text-end pr-3'>
                <Link className={`text-end px-3 py-3 ${user ? 'bg-green-400 text-white font-medium rounded-md hover:scale-[1.1] transition-all duration-150' : 'text-blue-300 underline'}`} href="/">Voltar</Link>
            </div>
            <h1 className='text-4xl text-center mb-8'>Minhas músicas</h1>
            <div className="flex justify-center">
                <table className="w-[90%] table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-5 py-2">ID</th>
                            <th className="border border-gray-300 px-5 py-2">Música</th>
                            <th className="border border-gray-300 px-5 py-2">Nome do artista</th>
                            <th className="border border-gray-300 px-5 py-2">URL da Música</th>
                            <th className="border border-gray-300 px-5 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {musics && musics.length > 0 ? (
                            musics.map((music, index) => (
                                <tr key={index} className="bg-white border-b">
                                    <td className="border border-gray-300 px-5 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-5 py-2">{music.title}</td>
                                    <td className="border border-gray-300 px-5 py-2">{music.artist}</td>
                                    <td className="border border-gray-300 px-5 py-2">
                                        <a href={music.url} className="text-blue-500 underline">
                                            {music.url}
                                        </a>
                                    </td>
                                    <td className="border border-gray-300 px-5 py-2">
                                        <Link
                                            href=""
                                            onClick={() => handleMusicAction(music.id, 'unlink')}
                                            className="text-white bg-red-400 px-2 py-1 rounded-md">
                                            Desvincular
                                        </Link>
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
            <h1 className='text-4xl text-center mt-10 mb-8'>Todas as músicas</h1>
            <div className="flex justify-center">
                <table className="w-[90%] table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-5 py-2">ID</th>
                            <th className="border border-gray-300 px-5 py-2">Música</th>
                            <th className="border border-gray-300 px-5 py-2">Nome do artista</th>
                            <th className="border border-gray-300 px-5 py-2">URL da Música</th>
                            <th className="border border-gray-300 px-5 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {otherMusics && otherMusics.length > 0 ? (
                            otherMusics.map((otherMusic, index) => (
                                <tr key={index} className="bg-white border-b">
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{otherMusic.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{otherMusic.artist}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <a href={otherMusic.url} className="text-blue-500 underline">
                                            {otherMusic.url}
                                        </a>
                                    </td>
                                    <td className="border border-gray-300 px-5 py-2">
                                        <Link
                                            href=""
                                            onClick={() => handleMusicAction(otherMusic.id, 'link')}
                                            className="text-white bg-green-400 px-2 py-1 rounded-md">
                                            Vincular
                                        </Link>

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

export default List
