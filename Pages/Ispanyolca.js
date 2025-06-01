import React, { useEffect, useState } from "react";
import axios from "axios";

function Ispanyolca() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/users") // bu endpoint'i ekleyeceğiz
            .then(res => {
                const filtered = res.data.filter(u => u.skillsHave.includes("İspanyolca 🇪🇸"));
                const sorted = filtered.sort((a, b) => (b.points?.["İspanyolca 🇪🇸"] || 0) - (a.points?.["İspanyolca 🇪🇸"] || 0));
                setUsers(sorted);
            });
    }, []);

    return (
        <div>
            <h2>İspanyolca Öğretenler</h2>
            {users.map((user, i) => (
                <div key={i}>
                    <h4>{user.name}</h4>
                    <p>Puan: {user.points?.["İspanyolca 🇪🇸"] || 0}</p>
                    {/* Oy verme butonu da eklenebilir */}
                </div>
            ))}
        </div>
    );
}

export default Ispanyolca;
