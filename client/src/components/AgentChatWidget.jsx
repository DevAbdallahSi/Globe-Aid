import React, { useEffect } from 'react';

const AgentChatWidget = () => {
    useEffect(() => {
        const scriptId = 'dq-voice-widget-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://voicehub.dataqueue.ai/DqVoiceWidget.js';
            script.id = scriptId;
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const apiKey = import.meta.env.VITE_DQ_API_KEY;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <dq-voice
                agent-id="6883c4933495fd66c0377a8d"
                env="https://voicehub.dataqueue.ai/"
                api-key={apiKey}
            />
        </div>
    );
};

export default AgentChatWidget;
