import { toast } from 'react-toastify';

const success = (msg) => {
    toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT
    });
}

const error = (msg) => {
    toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export {
    success,
    error
}