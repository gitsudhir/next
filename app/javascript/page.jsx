"use client"
import { useState } from 'react';
import Button from "@mui/material/Button";
import { useSearchParams } from 'next/navigation'


const JsEditor = () => {
    const searchParams = useSearchParams()
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const search = searchParams.get('search')

    const runCode = () => {
        let consoleOutput = '';
        try {
            const customConsole = {
                log: (...args) => {
                    consoleOutput += args.join(' ') + '\n';
                },
            };
            // eslint-disable-next-line no-new-func
            const result = new Function('console', code)(customConsole);
            setOutput(consoleOutput + (result !== undefined ? result : ''));
        } catch (err) {
            setOutput(consoleOutput + err.message);
        }
    };

    return (<>
        <p>{search}</p>
        <div style={{ display: 'flex', alignItems: 'start', margin: '1% 3%' }}>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your JavaScript code here"
                rows="10"
                cols="50"
            />
            <Button variant="outlined" onClick={runCode}>Run</Button>
            <code style={{ color: 'red' }}>{output}</code>
        </div>
    </>
    );
};

export default JsEditor;
