import React, { useEffect } from 'react';

const AgentChatWidget = () => {
    useEffect(() => {
        // Avoid registering the script more than once
        const scriptId = 'dq-voice-widget-script';
        const isScriptAlreadyPresent = document.getElementById(scriptId);

        if (!isScriptAlreadyPresent) {
            const script = document.createElement('script');
            script.src = 'https://voicehub.dataqueue.ai/DqVoiceWidget.js';
            script.id = scriptId;
            script.async = true;
            document.body.appendChild(script);
        }

        // No cleanup — we want to keep the script across routes

    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <dq-voice
                agent-id="6883c4933495fd66c0377a8d"
                env="https://voicehub.dataqueue.ai/"
                api-key="dqKey_53fab97ce83a85ca8cad539273a8dddbd1627d7f5db7e74ebc7d59eb12023b4aty1hhroplgo"
            />
        </div>
    );
};

export default AgentChatWidget;
