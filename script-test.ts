import 'reflect-metadata';
import { DependencyInjection, find } from './src/core/DependencyInjection';
import { GoogleAuthProvider, googleAuthProviderAlias } from './src/providers/google/GoogleAuthProvider';

DependencyInjection.init()
const googleAuthInstance = find<GoogleAuthProvider>(googleAuthProviderAlias);

const sla = async () => {
  const res = await googleAuthInstance.getAuthToken({
    code: '4/0AQSTgQFzq4GWgm3NL0qHMSHnCPJU1QSK7PJxUifmGRcgO0n35VhoocntQfxjkGY8eu8z7g'
  })

  console.log(res);
  
}

sla();