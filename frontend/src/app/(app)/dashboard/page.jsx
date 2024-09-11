"use client";
import React, { useEffect, useState } from 'react';
import Header from '../Header';

const Dashboard = () => {
    const [musics, setMusics] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = () => {
            fetch('http://localhost:8000/api/user', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                })
                .catch(error => {
                    console.error('Erro ao buscar o usuário:', error);
                });
        };
        
        fetch('http://localhost:8000/get-musics')
        .then(response => response.json())
        .then(data => {
            setMusics(data);
        })
        .catch(error => console.error('Error fetching data:', error));

        fetchUser();
    }, []);

    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            You are logged in!
                            {user && (
                                <div>
                                    <p><strong>User:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mt-6">Musics and Related Users</h2>
                       
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard