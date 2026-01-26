import React, { useEffect } from "react";
import { auth } from "../config/firebase";

const TestFirebase = () => {
    useEffect(() => {
        console.log("Firebase Auth instance:", auth);
    }, []);

    return <div>Firebase Initialized</div>;
};

export default TestFirebase;
