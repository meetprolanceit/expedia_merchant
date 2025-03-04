const axios = require('axios');

const axiosRequest = async ({ config }) => {
    try {
        const response = await axios.request(config);
        return response;
    } catch (error) {
        console.log(`🚀 ~ axiosRequest ~ error:`, error, error);
        return { message: error, status: error };
    }
};

module.exports = {
    axiosRequest,
};
