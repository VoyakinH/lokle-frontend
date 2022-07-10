import axios from "axios";

export const postRequestHandler = async (path, data) => {
    let result;
    await axios.post(
        `http://185.225.34.197${path}`,
        JSON.stringify(data),
        { withCredentials: true }
    )
        .then(response => {
            result = response
        })
        .catch(error => {
            console.log(error);
            result = error.response
        });
    return result
};

export const getRequestHandler = async (path) => {
    let result;
    await axios.get(
        `http://185.225.34.197${path}`,
        { withCredentials: true }
    )
        .then(response => {
            result = response
        })
        .catch(error => {
            console.log(error);
            result = error.response
        });
    return(result);
};