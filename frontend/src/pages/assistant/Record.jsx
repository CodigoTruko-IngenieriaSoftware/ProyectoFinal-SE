import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Record() {
  const navigate = useNavigate();

    const [dateStart, setDateStart] = useState('2020-01-01');
    const [dateEnd, setDateEnd] = useState('2022-01-01');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');

    const fetchRecords = async () => {
        const requestData = {
            dateStart,
            dateEnd
        };
        console.log(requestData);
      const userData = localStorage.getItem("userData");


        const user = JSON.parse(userData)

        const roles = user.role.map(role => role.name);
        if(!roles.includes("assistant")){
          if(roles.includes('sysadmin')){
            navigate('/ChangeRole');
          } else if (roles.includes('doctor')){
            navigate('/doctor');
          } else if (roles.includes('assistant')){
            navigate('/Assistant');
          } else if (roles.includes('patient')){
            navigate('/patient');
          } else {
            console.error('Unknown role:', user.role);
            navigate('/User');
        }
        }

        try {            
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/record`, {
                params: requestData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Asumiendo que el token se recupera de localStorage
                }
            });
        
            if (response.data.message === "OK") {
                setRecords(response.data.data);
            } else {
                setError('Failed to fetch records');
            }
        } catch (error) {
            setError('Failed to fetch data: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div>
            <h1>Fetch User Records</h1>
            <label>
                Start Date:
                <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
            </label>
            <label>
                End Date:
                <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
            </label>
            <button onClick={fetchRecords}>Fetch Records</button>
            <div>
                {error && <p>{error}</p>}
                {records.length > 0 && (
                    <ul>
                        {records.map(record => (
                            <li key={record.id}>
                                <p>ID: {record.id}</p>
                                <p>Reason: {record.reason}</p>
                                <p>Creation Date: {record.creationDate}</p>
                                <p>User Username: {record.user.username}</p>
                                <p>User Email: {record.user.email}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Record;
