import React from "react";
import { PulseLoader } from "react-spinners";

const styles = {
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -9,
        marginLeft: -28,
        width: 57,
        height: 19,
    },
};

// Глобальный спиннер по центру экрана
export const GlobalLoader = () => {
    return <PulseLoader style={styles.loader} speedMultiplier={2} color={"#42a5f5"} size={15} />
}