<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Globe Aid - Professional Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .project-title {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .project-subtitle {
            font-size: 1.3rem;
            color: #666;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.8;
        }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }

        .card-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: #4a5568;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }

        .features-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
        .tech-icon { background: linear-gradient(135deg, #43e97b, #38f9d7); }
        .setup-icon { background: linear-gradient(135deg, #fa709a, #fee140); }
        .install-icon { background: linear-gradient(135deg, #a8edea, #fed6e3); }

        .feature-item {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(70, 172, 254, 0.1), rgba(0, 242, 254, 0.1));
            border-left: 4px solid #4facfe;
            transition: all 0.3s ease;
        }

        .feature-item:hover {
            background: linear-gradient(135deg, rgba(70, 172, 254, 0.2), rgba(0, 242, 254, 0.2));
            transform: translateX(5px);
        }

        .feature-title {
            font-weight: 700;
            color: #2d3748;
            font-size: 1.1rem;
            margin-bottom: 8px;
        }

        .feature-description {
            color: #4a5568;
            line-height: 1.6;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }

        .tech-item {
            background: linear-gradient(135deg, rgba(67, 233, 123, 0.1), rgba(56, 249, 215, 0.1));
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            font-weight: 600;
            color: #2d3748;
            border: 2px solid rgba(67, 233, 123, 0.2);
            transition: all 0.3s ease;
        }

        .tech-item:hover {
            background: linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.2));
            border-color: rgba(67, 233, 123, 0.4);
            transform: scale(1.05);
        }

        .full-width-card {
            grid-column: 1 / -1;
        }

        .prereq-list, .install-steps {
            list-style: none;
        }

        .prereq-list li, .install-steps li {
            margin-bottom: 12px;
            padding: 12px 15px;
            background: linear-gradient(135deg, rgba(250, 112, 154, 0.1), rgba(254, 225, 64, 0.1));
            border-radius: 8px;
            border-left: 3px solid #fa709a;
            position: relative;
            padding-left: 40px;
        }

        .prereq-list li::before, .install-steps li::before {
            content: "✓";
            position: absolute;
            left: 15px;
            color: #fa709a;
            font-weight: bold;
            font-size: 1.1rem;
        }

        .install-steps li::before {
            content: counter(step-counter);
            counter-increment: step-counter;
            background: linear-gradient(135deg, #a8edea, #fed6e3);
            color: #2d3748;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .install-steps {
            counter-reset: step-counter;
        }

        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            font-family: 'Courier New', monospace;
            margin-top: 15px;
            overflow-x: auto;
            border: 2px solid #4a5568;
        }

        .gradient-text {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .project-title {
                font-size: 2.5rem;
            }
            
            .tech-grid {
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            }
        }

        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Print/Save PDF</button>
    
    <div class="container">
        <div class="header">
            <h1 class="project-title">Globe Aid</h1>
            <p class="project-subtitle">
                A sophisticated MERN-based platform engineered to provide comprehensive cultural and emergency support for international travelers. Features an innovative time bank system that enables users to offer and exchange services, fostering a collaborative global community.
            </p>
        </div>

        <div class="content-grid">
            <div class="card">
                <h2 class="card-title">
                    <div class="card-icon features-icon">🚀</div>
                    Key Features
                </h2>
                
                <div class="feature-item">
                    <div class="feature-title">🤖 Multilingual AI Voice Agent</div>
                    <div class="feature-description">
                        Integrated DataQueue's advanced AI voice agent widget to assist users seamlessly across multiple languages with intelligent real-time responses.
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-title">🔒 Secure Backend APIs</div>
                    <div class="feature-description">
                        Robust architecture built with Node.js and Express, implementing secure session management with MongoDB for data persistence and enterprise-level security.
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-title">📱 Responsive Frontend</div>
                    <div class="feature-description">
                        Modern React.js interface styled with Tailwind CSS, delivering an intuitive and accessible user experience across all devices.
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-title">⚡ Real-Time Communication</div>
                    <div class="feature-description">
                        Implemented high-performance real-time chat functionality using Socket.IO for instant user-agent interactions and live support.
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-title">☁️ Cloud Deployment</div>
                    <div class="feature-description">
                        Professionally deployed on AWS EC2 with complete environment setup, load balancing, and scalable infrastructure management.
                    </div>
                </div>

                <div class="feature-item">
                    <div class="feature-title">🧠 External AI Integration</div>
                    <div class="feature-description">
                        Seamlessly connected with OpenRouter and DeepSeek APIs to enhance AI-driven responses and orchestrate sophisticated voice agent interactions.
                    </div>
                </div>
            </div>

            <div class="card">
                <h2 class="card-title">
                    <div class="card-icon tech-icon">⚙️</div>
                    Technology Stack
                </h2>
                
                <div class="tech-grid">
                    <div class="tech-item">MongoDB</div>
                    <div class="tech-item">Express.js</div>
                    <div class="tech-item">React.js</div>
                    <div class="tech-item">Node.js</div>
                    <div class="tech-item">Tailwind CSS</div>
                    <div class="tech-item">Socket.IO</div>
                    <div class="tech-item">AWS EC2</div>
                    <div class="tech-item">DataQueue AI</div>
                    <div class="tech-item">OpenRouter API</div>
                    <div class="tech-item">DeepSeek API</div>
                </div>
            </div>

            <div class="card">
                <h2 class="card-title">
                    <div class="card-icon setup-icon">📋</div>
                    Prerequisites
                </h2>
                
                <ul class="prereq-list">
                    <li><strong>Node.js</strong> (v14 or higher) installed on your system</li>
                    <li><strong>MongoDB</strong> database setup and configured</li>
                    <li><strong>AWS Account</strong> with EC2 access for deployment</li>
                    <li><strong>Git</strong> version control system</li>
                    <li><strong>Code Editor</strong> (VS Code recommended)</li>
                </ul>
            </div>

            <div class="card">
                <h2 class="card-title">
                    <div class="card-icon install-icon">🛠️</div>
                    Installation Guide
                </h2>
                
                <ul class="install-steps">
                    <li><strong>Clone the repository:</strong>
                        <div class="code-block">git clone https://github.com/yourusername/globe-aid.git</div>
                    </li>
                    <li><strong>Navigate to project directory:</strong>
                        <div class="code-block">cd globe-aid</div>
                    </li>
                    <li><strong>Install dependencies:</strong>
                        <div class="code-block">npm install</div>
                    </li>
                    <li><strong>Configure environment variables:</strong>
                        <div class="code-block">cp .env.example .env<br>nano .env</div>
                    </li>
                    <li><strong>Start development server:</strong>
                        <div class="code-block">npm run dev</div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card full-width-card">
            <h2 class="card-title">
                <div class="card-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">🎯</div>
                <span class="gradient-text">Project Impact & Vision</span>
            </h2>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #4a5568;">
                Globe Aid represents a paradigm shift in how travelers access support services globally. By leveraging cutting-edge AI technology and real-time communication systems, we've created a platform that not only connects travelers with immediate assistance but also builds a sustainable ecosystem where community members can contribute their expertise and receive help when needed. The time bank system ensures fair value exchange while the multilingual AI agent breaks down language barriers, making emergency and cultural support accessible to everyone, everywhere.
            </p>
        </div>
    </div>
</body>
</html>
