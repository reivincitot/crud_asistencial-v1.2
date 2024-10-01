import React, { useEffect } from 'react'; // Asegúrate de importar useEffect
import axiosInstance from './axiosConfig';

const TestConnection = () => {
    useEffect(() => {
        axiosInstance.get('test/')
            .then(response => console.log(response.data))
            .catch(error => console.error('Error:', error));
    }, []);

    return <div>Test Connection Component</div>;
};

export default TestConnection;
