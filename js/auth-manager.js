/**
 * DeployMaster Auth Manager - GitHub & Vercel OAuth 2.0 & Token Connection Engine
 */

(function (window) {
    const GITHUB_CLIENT_ID = window.DEPLOYMASTER_GH_CLIENT_ID || ''; // Optional: set if registering GitHub App
    const VERCEL_CLIENT_ID = window.DEPLOYMASTER_VC_CLIENT_ID || ''; // Optional: set if registering Vercel App

    class AuthManager {
        constructor() {
            this.ghTokenKey = 'dm_gh_token';
            this.vcTokenKey = 'dm_vc_token';
            this.ghUserKey = 'dm_gh_user';
            this.vcUserKey = 'dm_vc_user';
            
            this.initListeners();
        }

        initListeners() {
            // Escuta mensagens de popups de OAuth se utilizados
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'DEPLOYMASTER_OAUTH_SUCCESS') {
                    const { provider, token, user } = event.data;
                    if (provider === 'github') {
                        this.setGitHubAuth(token, user);
                    } else if (provider === 'vercel') {
                        this.setVercelAuth(token, user);
                    }
                }
            });
        }

        // --- GITHUB AUTHENTICATION ---

        getGitHubToken() {
            return localStorage.getItem(this.ghTokenKey) || '';
        }

        getGitHubUser() {
            try {
                return JSON.parse(localStorage.getItem(this.ghUserKey) || 'null');
            } catch (e) {
                return null;
            }
        }

        isGitHubConnected() {
            return !!this.getGitHubToken();
        }

        async setGitHubAuth(token, user = null) {
            localStorage.setItem(this.ghTokenKey, token);
            if (!user) {
                try {
                    user = await this.fetchGitHubUserProfile(token);
                } catch (e) {
                    console.error('Erro ao buscar perfil GitHub:', e);
                }
            }
            if (user) {
                localStorage.setItem(this.ghUserKey, JSON.stringify(user));
            }
            this.notifyStateChange('github', true);
            return user;
        }

        disconnectGitHub() {
            localStorage.removeItem(this.ghTokenKey);
            localStorage.removeItem(this.ghUserKey);
            this.notifyStateChange('github', false);
        }

        async fetchGitHubUserProfile(token = this.getGitHubToken()) {
            if (!token) throw new Error('Token do GitHub não fornecido');
            const res = await fetch('https://api.github.com/user', {
                headers: { Authorization: `token ${token}` }
            });
            if (!res.ok) throw new Error('Token do GitHub inválido ou expirado');
            const data = await res.json();
            const userProfile = {
                login: data.login,
                name: data.name || data.login,
                avatar: data.avatar_url,
                html_url: data.html_url
            };
            localStorage.setItem(this.ghUserKey, JSON.stringify(userProfile));
            return userProfile;
        }

        getGitHubClientId() {
            return window.DEPLOYMASTER_GH_CLIENT_ID || localStorage.getItem('dm_gh_client_id') || '';
        }

        getVercelClientId() {
            return window.DEPLOYMASTER_VC_CLIENT_ID || localStorage.getItem('dm_vc_client_id') || '';
        }

        /**
         * Inicia o fluxo OAuth 2.0 (Logar e Autorizar) do GitHub.
         * Se CLIENT_ID estiver disponível, abre o popup oficial da tela de autorização do GitHub.
         */
        connectGitHub() {
            const clientId = this.getGitHubClientId();
            if (clientId) {
                const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/github`);
                const scope = encodeURIComponent('repo delete_repo workflow user');
                const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
                this.openOAuthPopup(authUrl, 'Conectar GitHub');
            } else {
                if (typeof showOAuthSetupModal === 'function') {
                    showOAuthSetupModal('github');
                } else {
                    const tokenGeneratorUrl = 'https://github.com/settings/tokens/new?description=DeployMaster+Integration&scopes=repo,workflow,delete_repo';
                    window.open(tokenGeneratorUrl, '_blank');
                }
            }
        }

        /**
         * Inicia o fluxo OAuth 2.0 (Logar e Autorizar) da Vercel.
         */
        connectVercel() {
            const clientId = this.getVercelClientId();
            if (clientId) {
                const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/vercel`);
                const authUrl = `https://vercel.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
                this.openOAuthPopup(authUrl, 'Conectar Vercel');
            } else {
                if (typeof showOAuthSetupModal === 'function') {
                    showOAuthSetupModal('vercel');
                } else {
                    const tokenGeneratorUrl = 'https://vercel.com/account/tokens';
                    window.open(tokenGeneratorUrl, '_blank');
                }
            }
        }

        // --- HELPER METHODS ---

        openOAuthPopup(url, title = 'Autenticação') {
            const width = 600;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            window.open(url, title, `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`);
        }

        notifyStateChange(provider, isConnected) {
            const event = new CustomEvent('dm_auth_change', {
                detail: { provider, isConnected }
            });
            window.dispatchEvent(event);
            if (typeof updateAuthUI === 'function') {
                updateAuthUI();
            }
        }
    }

    window.DeployMasterAuth = new AuthManager();
})(window);
