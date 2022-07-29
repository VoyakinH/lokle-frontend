import axios from "axios";

export const postRequestHandler = async (path, data) => {
    let result;
    await axios.post(
        `https://kit.lokle.ru${path}`,
        JSON.stringify(data),
        { withCredentials: true }
    )
        .then(response => {
            result = response
        })
        .catch(error => {
            result = error.response
        });
    return result
};

export const getRequestHandler = async (path) => {
    let result;
    await axios.get(
        `https://kit.lokle.ru${path}`,
        { withCredentials: true }
    )
        .then(response => {
            result = response
        })
        .catch(error => {
            result = error.response
        });
    return(result);
};

export const deleteRequestHandler = async (path) => {
    let result;
    await axios.delete(
        `https://kit.lokle.ru${path}`,
        { withCredentials: true }
    )
        .then(response => {
            result = response
        })
        .catch(error => {
            result = error.response
        });
    return(result);
};