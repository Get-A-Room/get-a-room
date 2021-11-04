import axios from 'axios';
import { createBrowserHistory } from 'history';

const client = axios.create();
export const history = createBrowserHistory();

const initiateAxiosClient = () => {
    client.defaults.baseURL = '/api';
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response.status === 401) {
                // Redirect user to login screen
                history.push('/login');
            }
            return Promise.reject(error);
        }
    );
};

initiateAxiosClient();
export default client;
