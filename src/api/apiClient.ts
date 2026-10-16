import axios from 'axios';

import { attachRequestsInspector } from '../libs/requests-inspector';

export const apiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachRequestsInspector(apiClient);

export default apiClient;
