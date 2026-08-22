// API Serverless Route - GitHub OAuth Callback
// Deployable to Vercel Serverless / Node.js

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Code de autorização não fornecido' });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Credenciais OAuth do GitHub não configuradas no servidor' });
    }

    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code
            })
        });

        const data = await response.json();

        if (data.access_token) {
            // Retorna HTML com script que envia a mensagem para a janela pai (popup flow)
            res.setHeader('Content-Type', 'text/html');
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head><title>Autenticação Concluída</title></head>
                <body style="background:#050505;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
                    <div style="text-align:center;">
                        <h2>Conectado com sucesso ao GitHub!</h2>
                        <p>Redirecionando para o DeployMaster...</p>
                    </div>
                    <script>
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'DEPLOYMASTER_OAUTH_SUCCESS',
                                provider: 'github',
                                token: '${data.access_token}'
                            }, '*');
                            window.close();
                        } else {
                            window.location.href = '/deploy/';
                        }
                    </script>
                </body>
                </html>
            `);
        } else {
            return res.status(400).json({ error: data.error_description || 'Falha ao obter access_token' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
