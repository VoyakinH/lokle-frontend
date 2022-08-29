import axios from "axios";

// Обработчик POST запроса
export const postRequestHandler = async (path, data, isFile=false) => {
    let result;
    let formData = new FormData();
    if (isFile) {
        for (var key in data) {
            formData.append(key, data[key]);
        }
    }
    await axios.post(
        // `http://localhost${path}`,
        `https://kit.lokle.ru${path}`,
        isFile?
            formData:
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

// Обработчик GET запроса
export const getRequestHandler = async (path) => {
    let result;
    await axios.get(
        // `http://localhost${path}`,
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

// Обработчик DELETE запроса
export const deleteRequestHandler = async (path) => {
    let result;
    await axios.delete(
        // `http://localhost${path}`,
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