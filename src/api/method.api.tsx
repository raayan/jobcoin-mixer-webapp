import axios, {AxiosError, AxiosResponse} from 'axios';
import {message, notification, Tag} from "antd/es";
import * as React from "react";

export const Notify = (response: AxiosResponse, successMessage?: string) => {
    if (response.status === 200) {
        message.success(successMessage || "Operation Success");
    } else {
        let toDisplay = null;

        if (typeof response.data.error === "string") {
            toDisplay = response.data.error;
        } else {
            const errorData = response.data.error;
            toDisplay = Object.keys(errorData).flatMap((key) => {
                const errors = Array.of(errorData[key]).join(", ");
                return (<div><Tag>{key}</Tag> {errors}</div>)
            });
        }

        if (response.status === 422) {
            notification.warning({
                message: response.statusText + " " + response.status,
                description: toDisplay
            });
        } else {
            notification.error({
                message: response.statusText + " " + response.status,
                description: toDisplay
            });
        }
    }

};

export const Get = (path: string) => {
    return new Promise((resolve, reject) => {
        axios.get(`${path}`, {
            headers: ApiHeader
        })
            .then((response: AxiosResponse) => resolve(response))
            .catch((error: AxiosError) => reject(error));
    });
};

export const Post = (path: string, data: any) => {
    return new Promise((resolve, reject) => {
        axios.post(`${path}`, data, {
            headers: ApiHeader
        })
            .then((response: AxiosResponse) => resolve(response))
            .catch((error: AxiosError) => reject(error));
    });
};

export const ApiHeader = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
};