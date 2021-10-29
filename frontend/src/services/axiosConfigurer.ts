import axios from 'axios';

const client = axios.create();

const initiateAxiosClient = () => {
    client.defaults.baseURL = '/api';
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                // TODO: Redirect to login page
                console.error('Token missing or invalid');
            }
            return Promise.reject(error);
        }
    );
};

initiateAxiosClient();
export default client;
